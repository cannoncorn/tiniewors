
// import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
// import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import SoundManager                 from "../../tools/helpers/SoundManager";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarActionExecutor            from "../../tools/warHelpers/WarActionExecutor";
// import WarVisibilityHelpers         from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsRwWarMenuPanel           from "../view/RwWarMenuPanel";
// import TwnsRwField                  from "./RwField";
// import TwnsRwPlayerManager          from "./RwPlayerManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsRwWar {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import WarType                  = Types.WarType;
    import WarAction                = ProtoTypes.WarAction;
    import IWarActionContainer      = WarAction.IWarActionContainer;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;

    type CheckpointData = {
        warData     : ISerialWar;
        nextActionId: number;
    };

    export class RwWar extends TwnsBwWar.BwWar {
        private readonly _playerManager         = new TwnsRwPlayerManager.RwPlayerManager();
        private readonly _field                 = new TwnsRwField.RwField();
        private readonly _commonSettingManager  = new TwnsBwCommonSettingManager.BwCommonSettingManager();
        private readonly _warEventManager       = new TwnsBwWarEventManager.BwWarEventManager();

        private _settingsForMcw?                    : ProtoTypes.WarSettings.ISettingsForMcw | null;
        private _settingsForScw?                    : ProtoTypes.WarSettings.ISettingsForScw | null;
        private _settingsForMrw?                    : ProtoTypes.WarSettings.ISettingsForMrw | null;
        private _settingsForCcw?                    : ProtoTypes.WarSettings.ISettingsForCcw | null;
        private _settingsForMfw?                    : ProtoTypes.WarSettings.ISettingsForMfw | null;

        private _replayId?                          : number;
        private _pauseTimeMs                        = 1000;
        private _isAutoReplay                       = false;
        private _nextActionId                       = 0;
        private _checkpointIdsForNextActionId       = new Map<number, number>();
        private _checkpointDataListForCheckpointId  = new Map<number, CheckpointData>();

        public async init(warData: ISerialWar): Promise<void> {
            await this._baseInit(warData);
            this._setSettingsForMcw(warData.settingsForMcw ?? null);
            this._setSettingsForScw(warData.settingsForScw ?? null);
            this._setSettingsForMrw(warData.settingsForMrw ?? null);
            this._setSettingsForCcw(warData.settingsForCcw ?? null);
            this._setSettingsForMfw(warData.settingsForMfw ?? null);
            this.setNextActionId(0);

            this._setCheckpointId(0, 0);
            this._setCheckpointData(0, {
                nextActionId    : 0,
                warData         : Helpers.deepClone(warData),
            });

            // await Helpers.checkAndCallLater();

            this._initView();
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getField(): TwnsRwField.RwField {
            return this._field;
        }
        public getPlayerManager(): TwnsRwPlayerManager.RwPlayerManager {
            return this._playerManager;
        }
        public getCommonSettingManager(): TwnsBwCommonSettingManager.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): TwnsBwWarEventManager.BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
            // No need to update units.

            const tileMap       = this.getTileMap();
            const visibleTiles  = WarVisibilityHelpers.getAllTilesVisibleToTeam(this, this.getPlayerInTurn().getTeamIndex());
            for (const tile of tileMap.getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));

                if (!isFastExecute) {
                    tile.flushDataToView();
                }
            }

            if (!isFastExecute) {
                tileMap.getView().updateCoZone();
            }
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0081)} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return `${Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn())} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0095)} ${Lang.getUnitName(Helpers.getExisted(action.unitType))} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null> {
            return `${await this.getPlayerInTurn().getNickname()} ${Lang.getText(action.deprecatedIsBoot ? LangTextType.B0396: LangTextType.B0055)} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null> {
            const nickname      = await this.getPlayerInTurn().getNickname();
            const playerIndex   = this.getPlayerIndexInTurn();
            const suffix        = this._getDescSuffix();
            const isAgree       = action.extraData ? action.extraData.isAgree : action.isAgree;
            if (!isAgree) {
                return `${Lang.getFormattedText(LangTextType.F0017, playerIndex, nickname)} ${suffix}`;
            } else {
                if (this.getDrawVoteManager().getRemainingVotes()) {
                    return `${Lang.getFormattedText(LangTextType.F0018, playerIndex, nickname)} ${suffix}`;
                } else {
                    return `${Lang.getFormattedText(LangTextType.F0019, playerIndex, nickname)} ${suffix}`;
                }
            }
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | null> {
            return `P${this.getPlayerIndexInTurn()} ${await this.getPlayerInTurn().getNickname()} ${Lang.getText(LangTextType.B0094)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0451)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            const playerIndex = Helpers.getExisted(action.targetPlayerIndex);
            return `P${playerIndex} ${await this.getPlayer(playerIndex).getNickname()}${Lang.getText(LangTextType.B0450)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0087)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname(), this.getPlayerIndexInTurn());
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0028, await this.getPlayerInTurn().getNickname());
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0097)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0097)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0098)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0099)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0100)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0101)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0102)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0103)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0104)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0105)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0139)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0106)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0107)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0108)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0142)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0109)} ${this._getDescSuffix()}`;
        }
        private _getDescSuffix(): string {
            return `(${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(LangTextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`;
        }

        public serializeForCheckpoint(): CheckpointData {
            const randomNumberManager = this.getRandomNumberManager();
            return {
                nextActionId    : this.getNextActionId(),
                warData         : {
                    settingsForCommon           : null,
                    settingsForMcw              : null,
                    settingsForScw              : null,

                    warId                       : null,
                    seedRandomInitialState      : Helpers.getExisted(randomNumberManager.getSeedRandomInitialState()),
                    seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentState(),
                    executedActions             : null,
                    remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                    weatherManager              : this.getWeatherManager().serialize(),
                    warEventManager             : Helpers.deepClone(this.getWarEventManager().serialize()),
                    playerManager               : this.getPlayerManager().serialize(),
                    turnManager                 : this.getTurnManager().serialize(),
                    field                       : this.getField().serialize(),
                },
            };
        }

        public getWarType(): WarType {
            const hasFog = this.getCommonSettingManager().getSettingsHasFogByDefault();
            if (this._getSettingsForMcw()) {
                return hasFog ? WarType.McwFog : WarType.McwStd;
            } else if (this._getSettingsForMrw()) {
                return hasFog ? WarType.MrwFog : WarType.MrwStd;
            } else if (this._getSettingsForScw()) {
                return hasFog ? WarType.ScwFog : WarType.ScwStd;
            } else if (this._getSettingsForCcw()) {
                return hasFog ? WarType.CcwFog : WarType.CcwStd;
            } else if (this._getSettingsForMfw()) {
                return hasFog ? WarType.MfwFog : WarType.MfwStd;
            } else {
                throw Helpers.newError(`Invalid war data.`, ClientErrorCode.RwWar_GetWarType_00);
            }
        }
        public getIsNeedExecutedAction(): boolean {
            return true;
        }
        public getIsNeedSeedRandom(): boolean {
            return true;
        }
        public getMapId(): number | null {
            const settingsForMcw = this._getSettingsForMcw();
            if (settingsForMcw) {
                return Helpers.getExisted(settingsForMcw.mapId);
            }

            const settingsForMrw = this._getSettingsForMrw();
            if (settingsForMrw) {
                return Helpers.getExisted(settingsForMrw.mapId);
            }

            const settingsForScw = this._getSettingsForScw();
            if (settingsForScw) {
                return Helpers.getExisted(settingsForScw.mapId);
            }

            const settingsForCcw = this._getSettingsForCcw();
            if (settingsForCcw) {
                return Helpers.getExisted(settingsForCcw.mapId);
            }

            return null;
        }

        public getBootRestTime(): number | null {
            return null;
        }
        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        public getIsExecuteActionsWithExtraData(): boolean {
            return false;
        }

        private _getSettingsForMcw(): ProtoTypes.WarSettings.ISettingsForMcw | null {
            return Helpers.getDefined(this._settingsForMcw, ClientErrorCode.RwWar_GetSettingsForMcw_00);
        }
        private _setSettingsForMcw(value: ProtoTypes.WarSettings.ISettingsForMcw | null): void {
            this._settingsForMcw = value;
        }
        private _getSettingsForScw(): ProtoTypes.WarSettings.ISettingsForScw | null {
            return Helpers.getDefined(this._settingsForScw, ClientErrorCode.RwWar_GetSettingsForScw_00);
        }
        private _setSettingsForScw(value: ProtoTypes.WarSettings.ISettingsForScw | null): void {
            this._settingsForScw = value;
        }
        private _getSettingsForMrw(): ProtoTypes.WarSettings.ISettingsForMrw | null {
            return Helpers.getDefined(this._settingsForMrw, ClientErrorCode.RwWar_GetSettingsForMrw_00);
        }
        private _setSettingsForMrw(value: ProtoTypes.WarSettings.ISettingsForMrw | null): void {
            this._settingsForMrw = value;
        }
        private _getSettingsForCcw(): ProtoTypes.WarSettings.ISettingsForCcw | null {
            return Helpers.getDefined(this._settingsForCcw, ClientErrorCode.RwWar_GetSettingsForCcw_00);
        }
        private _setSettingsForCcw(value: ProtoTypes.WarSettings.ISettingsForCcw | null): void {
            this._settingsForCcw = value;
        }
        private _getSettingsForMfw(): ProtoTypes.WarSettings.ISettingsForMfw | null {
            return Helpers.getDefined(this._settingsForMfw, ClientErrorCode.RwWar_GetSettingsForMfw_00);
        }
        private _setSettingsForMfw(value: ProtoTypes.WarSettings.ISettingsForMfw | null): void {
            this._settingsForMfw = value;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getReplayId(): number {
            return Helpers.getExisted(this._replayId);
        }
        public setReplayId(replayId: number): void {
            this._replayId = replayId;
        }

        public getPauseTimeMs(): number {
            return this._pauseTimeMs;
        }
        public setPauseTimeMs(time: number): void {
            this._pauseTimeMs = time;
        }

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(nextActionId: number): void {
            this._nextActionId = nextActionId;
            Notify.dispatch(NotifyType.RwNextActionIdChanged);
        }

        public getIsAutoReplay(): boolean {
            return this._isAutoReplay;
        }
        public setIsAutoReplay(isAuto: boolean): void {
            if (this.getIsAutoReplay() !== isAuto) {
                this._isAutoReplay = isAuto;
                Notify.dispatch(NotifyType.ReplayAutoReplayChanged);

                if ((isAuto) && (!this.getIsExecutingAction()) && (!this.checkIsInEnd())) {
                    this._executeNextAction(false);
                }
            }
        }

        private _getCheckpointId(nextActionId: number): number | null {
            return this._checkpointIdsForNextActionId.get(nextActionId) ?? null;
        }
        private _setCheckpointId(nextActionId: number, checkpointId: number): void {
            this._checkpointIdsForNextActionId.set(nextActionId, checkpointId);
        }

        private _getCheckpointData(checkpointId: number): CheckpointData | null {
            return this._checkpointDataListForCheckpointId.get(checkpointId) ?? null;
        }
        private _setCheckpointData(checkpointId: number, data: CheckpointData): void {
            this._checkpointDataListForCheckpointId.set(checkpointId, data);
        }

        public getAllCheckpointInfoArray(): Types.ReplayCheckpointInfo[] {
            const turnManager   = Helpers.getExisted(this._getCheckpointData(0)?.warData.turnManager, ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_00);
            let checkpointId    = 0;
            let turnIndex       = Helpers.getExisted(turnManager.turnIndex, ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_01);
            let playerIndex     = Helpers.getExisted(turnManager.playerIndex, ClientErrorCode.HrwWar_GetAllCheckpointInfoArray_02);
            const infoArray     : Types.ReplayCheckpointInfo[] = [{
                checkpointId,
                nextActionId    : 0,
                turnIndex,
                playerIndex,
            }];

            const allActionArray    = this.getExecutedActionManager().getAllExecutedActions();
            const maxPlayerIndex    = this.getPlayerManager().getTotalPlayersCount(false);
            const actionsCount      = allActionArray.length;
            for (let i = 1; i < actionsCount; ++i) {
                const action = allActionArray[i];
                if ((action.WarActionPlayerEndTurn) || (action.WarActionSystemEndTurn) || (i === actionsCount - 1)) {
                    ++checkpointId;
                    if (playerIndex < maxPlayerIndex) {
                        ++playerIndex;
                    } else {
                        playerIndex = 0;
                        ++turnIndex;
                    }
                    infoArray.push({
                        checkpointId,
                        nextActionId: i + 1,
                        turnIndex,
                        playerIndex,
                    });
                }
            }
            return infoArray;
        }

        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public checkIsInEnd(): boolean {
            return this.getNextActionId() >= this.getTotalActionsCount();
        }

        public async loadNextCheckpoint(): Promise<void> {
            if ((this.checkIsInEnd()) || (this.getIsExecutingAction()) || (!this.getIsRunning())) {
                return;
            }

            await this.loadCheckpoint(Helpers.getExisted(this._getCheckpointId(this.getNextActionId())) + 1);
        }
        public async loadPreviousCheckpoint(): Promise<void> {
            if ((this.checkIsInBeginning()) || (this.getIsExecutingAction()) || (!this.getIsRunning())) {
                return;
            }

            const nextActionId = this.getNextActionId();
            const checkpointId = Math.min(Helpers.getExisted(this._getCheckpointId(nextActionId)), Helpers.getExisted(this._getCheckpointId(nextActionId - 1)));
            await this.loadCheckpoint(checkpointId);
        }
        public async loadCheckpoint(checkpointId: number): Promise<void> {
            if ((this.getIsExecutingAction()) || (!this.getIsRunning())) {
                return;
            }

            this.setIsAutoReplay(false);
            while (!this._getCheckpointData(checkpointId)) {
                await Helpers.checkAndCallLater();
                await this._executeNextAction(true);
            }

            await this._loadExistingCheckpoint(checkpointId);
        }
        private async _loadExistingCheckpoint(checkpointId: number): Promise<void> {
            if ((this.getIsExecutingAction()) || (!this.getIsRunning())) {
                throw Helpers.newError(`RwWar._loadExistingCheckpoint() can't load!`);
            }

            this.setIsAutoReplay(false);
            this.stopRunning();

            const checkpointData        = Helpers.getExisted(this._getCheckpointData(checkpointId));
            const warData               = checkpointData.warData;
            const configVersion         = this.getConfigVersion();
            const playersCountUnneutral = this.getPlayerManager().getTotalPlayersCount(false);
            this.setNextActionId(checkpointData.nextActionId);
            this.getWeatherManager().fastInit(warData.weatherManager);
            this.getPlayerManager().fastInit(Helpers.getExisted(warData.playerManager), configVersion);
            this.getTurnManager().fastInit(Helpers.getExisted(warData.turnManager), playersCountUnneutral);
            this.getWarEventManager().fastInit(Helpers.getExisted(warData.warEventManager));
            this.getField().fastInit({
                data                    : Helpers.getExisted(warData.field),
                configVersion,
                playersCountUnneutral,
            });
            this.getDrawVoteManager().setRemainingVotes(warData.remainingVotesForDraw ?? null);
            this.getRandomNumberManager().init({
                isNeedSeedRandom    : this.getIsNeedSeedRandom(),
                initialState        : warData.seedRandomInitialState,
                currentState        : warData.seedRandomCurrentState,
            });
            this.setIsEnded(this.checkIsInEnd());

            await Helpers.checkAndCallLater();
            this._fastInitView();
            this.startRunning().startRunningView();
            this.updateTilesAndUnitsOnVisibilityChanged(false);
            SoundManager.playCoBgmWithWar(this, false);

            FloatText.show(`${Lang.getText(LangTextType.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(LangTextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }

        public getTotalActionsCount(): number {
            return this.getExecutedActionManager().getExecutedActionsCount();
        }
        public getNextAction(): IWarActionContainer {
            return this.getExecutedActionManager().getExecutedAction(this.getNextActionId());
        }

        private async _executeNextAction(isFastExecute: boolean): Promise<void> {
            const action = this.getNextAction();
            if ((action == null)            ||
                (!this.getIsRunning())       ||
                (this.checkIsInEnd())        ||
                (this.getIsExecutingAction())
            ) {
                FloatText.show(Lang.getText(LangTextType.B0110));
            } else {
                await this._doExecuteAction(action, isFastExecute);
            }
        }
        private async _doExecuteAction(action: IWarActionContainer, isFastExecute: boolean): Promise<void> {
            this.setNextActionId(this.getNextActionId() + 1);
            await WarActionExecutor.checkAndExecute(this, action, isFastExecute);

            const isInEnd = this.checkIsInEnd();
            if (isInEnd) {
                this.setIsAutoReplay(false);
            }

            const actionId          = this.getNextActionId();
            const turnManager       = this.getTurnManager();
            const prevCheckpointId  = Helpers.getExisted(this._getCheckpointId(actionId - 1));
            const prevTurnData      = Helpers.getExisted(Helpers.getExisted(this._getCheckpointData(prevCheckpointId)).warData.turnManager);
            const isNewCheckpoint   = (isInEnd) || (turnManager.getTurnIndex() !== prevTurnData.turnIndex) || (turnManager.getPlayerIndexInTurn() !== prevTurnData.playerIndex);
            const checkpointId      = isNewCheckpoint ? prevCheckpointId + 1 : prevCheckpointId;
            if (this._getCheckpointId(actionId) == null) {
                this._setCheckpointId(actionId, checkpointId);
            }
            if (this._getCheckpointData(checkpointId) == null) {
                this._setCheckpointData(checkpointId, this.serializeForCheckpoint());
            }

            if ((!isInEnd) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                egret.setTimeout(() => {
                    if ((!this.checkIsInEnd()) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                        this._doExecuteAction(this.getNextAction(), isFastExecute);
                    }
                }, null, this.getPauseTimeMs());
            }
        }
    }
}

// export default TwnsRwWar;
