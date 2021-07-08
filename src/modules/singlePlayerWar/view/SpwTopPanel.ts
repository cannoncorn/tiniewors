
namespace TinyWars.SinglePlayerWar {
    import BwHelpers        = BaseWar.BwHelpers;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class SpwTopPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: SpwTopPanel;

        private _groupPlayer        : eui.Group;
        private _labelPlayer        : GameUi.UiLabel;
        private _labelSinglePlayer  : GameUi.UiLabel;
        private _labelFund          : GameUi.UiLabel;
        private _groupCo            : eui.Group;
        private _labelCo            : GameUi.UiLabel;
        private _labelCurrEnergy    : GameUi.UiLabel;
        private _labelPowerEnergy   : GameUi.UiLabel;
        private _labelZoneEnergy    : GameUi.UiLabel;
        private _btnChat            : GameUi.UiButton;
        private _btnUnitList        : GameUi.UiButton;
        private _btnFindBuilding    : GameUi.UiButton;
        private _btnEndTurn         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;
        private _btnMenu            : GameUi.UiButton;

        private _war    : SpwWar;

        public static show(): void {
            if (!SpwTopPanel._instance) {
                SpwTopPanel._instance = new SpwTopPanel();
            }
            SpwTopPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (SpwTopPanel._instance) {
                await SpwTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerWar/SpwTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: Notify.Type.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: Notify.Type.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: Notify.Type.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: Notify.Type.MsgChatAddMessage,              callback: this._onMsgChatAddMessage },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ]);

            this._war = SpwModel.getWar();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._war = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }
        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoEnergyChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }
        private _onMsgChatGetAllReadProgressList(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatUpdateReadProgress(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatGetAllMessages(e: egret.Event): void {
            this._updateBtnChat();
        }
        private _onMsgChatAddMessage(e: egret.Event): void {
            this._updateBtnChat();
        }

        private _onTouchedGroupPlayer(e: egret.TouchEvent): void {
            const userId = this._war.getPlayerInTurn().getUserId();
            (userId) && (User.UserPanel.show({ userId }));
        }
        private _onTouchedGroupCo(e: egret.TouchEvent): void {
            const war = this._war;
            BaseWar.BwCoListPanel.show({
                war,
                selectedIndex: Math.max(war.getPlayerIndexInTurn() - 1, 0),
            });
            SpwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            SpwWarMenuPanel.hide();
            Chat.ChatPanel.show({});
        }
        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            const war = this._war;
            war.getField().getActionPlanner().setStateIdle();
            BaseWar.BwUnitListPanel.show({ war });
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
            const war           = this._war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = BwHelpers.getIdleBuildingGridIndex(war);
                if (!gridIndex) {
                    FloatText.show(Lang.getText(Lang.Type.A0077));
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                }
            }
        }
        private _onTouchedBtnEndTurn(e: egret.TouchEvent): void {
            const war = this._war;
            if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(Lang.Type.A0034));
            } else {
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => (this._war.getActionPlanner() as SpwActionPlanner).setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            SpwWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCoAndEnergy();
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            this._labelSinglePlayer.text = Lang.getText(Lang.Type.B0138);
        }

        private _updateLabelPlayer(): void {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            const name                  = player.getUserId() != null ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256);
            this._labelPlayer.text      = `${name} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
            this._labelPlayer.textColor = 0xFFFFFF;
        }

        private _updateLabelFund(): void {
            const war               = this._war;
            const playerInTurn      = war.getPlayerInTurn();
            if ((war.getFogMap().checkHasFogCurrently())                                                                        &&
                (!(war.getPlayerManager() as SpwPlayerManager).getAliveWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
            ) {
                this._labelFund.text = `????`;
            } else {
                this._labelFund.text = `${playerInTurn.getFund()}`;
            }
        }

        private _updateLabelCoAndEnergy(): void {
            const war = this._war;
            if ((war) && (war.getIsRunning())) {
                const player        = war.getPlayerInTurn();
                const coId          = player.getCoId();
                this._labelCo.text  = `${coId == null ? "----" : Utility.ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

                const skillType = player.getCoUsingSkillType();
                if (skillType === Types.CoSkillType.Power) {
                    this._labelCurrEnergy.text = "COP";
                } else if (skillType === Types.CoSkillType.SuperPower) {
                    this._labelCurrEnergy.text = "SCOP";
                } else {
                    const currentEnergy = player.getCoCurrentEnergy();
                    this._labelCurrEnergy.text = `${currentEnergy == null ? `--` : currentEnergy}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnFindUnit(): void {
            const war                   = this._war;
            const turnManager           = war.getTurnManager();
            this._btnUnitList.visible   = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._war;
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.visible = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting());
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(Chat.ChatModel.checkHasUnreadMessage());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getHintForEndTurn(): string {
            const war           = this._war;
            const playerIndex   = war.getPlayerIndexInTurn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

            {
                let idleUnitsCount = 0;
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle)) {
                        ++idleUnitsCount;
                    }
                }
                (idleUnitsCount) && (hints.push(Lang.getFormattedText(Lang.Type.F0006, idleUnitsCount)));
            }

            {
                const idleBuildingsDict = new Map<Types.TileType, Types.GridIndex[]>();
                for (const tile of war.getTileMap().getAllTiles()) {
                    if ((tile.checkIsUnitProducerForPlayer(playerIndex)) && (!unitMap.getUnitOnMap(tile.getGridIndex()))) {
                        const tileType  = tile.getType();
                        const gridIndex = tile.getGridIndex();
                        if (!idleBuildingsDict.has(tileType)) {
                            idleBuildingsDict.set(tileType, [gridIndex]);
                        } else {
                            idleBuildingsDict.get(tileType).push(gridIndex);
                        }
                    }
                }
                const textArrayForBuildings: string[] = [];
                for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                    textArrayForBuildings.push(Lang.getFormattedText(
                        Lang.Type.F0007, gridIndexArray.length,
                        Lang.getTileName(tileType),
                        gridIndexArray.map(v => `(${v.x}, ${v.y})`).join(`, `)),
                    );
                }
                (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
            }

            hints.push(Lang.getText(Lang.Type.A0024));
            return hints.join(`\n\n`);
        }
    }
}