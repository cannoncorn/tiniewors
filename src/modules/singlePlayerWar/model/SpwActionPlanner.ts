
// import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
// import TwnsBwUnit               from "../../baseWar/model/BwUnit";
// import TwnsBwDamagePreviewPanel from "../../baseWar/view/BwDamagePreviewPanel";
// import TwnsBwUnitActionsPanel   from "../../baseWar/view/BwUnitActionsPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import FloatText                from "../../tools/helpers/FloatText";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import SpwLocalProxy            from "./SpwLocalProxy";
// import TwnsSpwWar               from "./SpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpwActionPlanner {
    import SpwWar               = TwnsSpwWar.SpwWar;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;
    import UnitType             = Types.UnitType;

    export class SpwActionPlanner extends TwnsBwActionPlanner.BwActionPlanner {
        private _getPlayerIndexInTurn(): number {
            return this._getWar().getPlayerIndexInTurn();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            this._setState(State.RequestingPlayerProduceUnit);
            this._updateView();

            SpwLocalProxy.reqPlayerProduceUnit({ war: this._getWar(), gridIndex, unitType, unitHp });
        }

        public setStateRequestingPlayerUseCoSkill(skillType: Types.CoSkillType): void {
            this._setState(State.RequestingPlayerUseCoSkill);
            this._updateView();

            SpwLocalProxy.reqPlayerUseCoSkill(this._getWar(), skillType);
        }

        private _setStateRequestingUnitProduceUnit(): void {
            this._setState(State.RequestingUnitProduceUnit);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitProduceUnit(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitBeLoaded(): void {
            this._setState(State.RequestingUnitBeLoaded);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitBeLoaded(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitJoin(): void {
            this._setState(State.RequestingUnitJoin);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitJoin(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitUseCoSuperPower(): void {
            this._setState(State.RequestingUnitUseCoSuperPower);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitUseCoSkill({ war: this._getWar(), skillType: Types.CoSkillType.SuperPower, path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null });
        }

        private _setStateRequestingUnitUseCoPower(): void {
            this._setState(State.RequestingUnitUseCoPower);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitUseCoSkill({ war: this._getWar(), skillType: Types.CoSkillType.Power, path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null });
        }

        private _setStateRequestingUnitLoadCo(): void {
            this._setState(State.RequestingUnitLoadCo);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitLoadCo(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitWait(): void {
            this._setState(State.RequestingUnitWait);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitWait(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
            this._setState(State.RequestingUnitAttackUnit);
            this._updateView();
            SoundManager.playShortSfx(Types.ShortSfxCode.CursorConfirm01);

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitAttackUnit({
                war             : this._getWar(),
                path            : this._generateIMovePath(),
                launchUnitId    : unit ? unit.getUnitId() : null,
                targetGridIndex,
            });
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            this._setState(State.RequestingUnitAttackTile);
            this._updateView();
            SoundManager.playShortSfx(Types.ShortSfxCode.CursorConfirm01);

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitAttackTile({
                war             : this._getWar(),
                path            : this._generateIMovePath(),
                launchUnitId    : unit ? unit.getUnitId() : null,
                targetGridIndex,
            });
        }

        private _setStateRequestingUnitBuildTile(): void {
            this._setState(State.RequestingUnitBuildTile);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitBuildTile(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitCaptureTile(): void {
            this._setState(State.RequestingUnitCaptureTile);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitCaptureTile(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitDive(): void {
            this._setState(State.RequestingUnitDive);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitDive(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        private _setStateRequestingUnitSurface(): void {
            this._setState(State.RequestingUnitSurface);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitSurface(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitDrop);
            this._updateView();

            this._pushBackChosenUnitForDrop({
                unit        : Helpers.getExisted(this.getChoosingUnitForDrop()),
                destination : gridIndex,
            });

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitDrop({ war: this._getWar(), path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null, dropDestinations: destinations });
        }
        private _setStateRequestingUnitDropOnChooseAction(): void {
            this._setState(State.RequestingUnitDrop);
            this._updateView();

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitDrop({ war: this._getWar(), path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null, dropDestinations: destinations });
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitLaunchFlare);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitLaunchFlare({ war: this._getWar(), path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null, targetGridIndex: gridIndex });
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            this._setState(State.RequestingUnitLaunchSilo);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitLaunchSilo({ war: this._getWar(), path: this._generateIMovePath(), launchUnitId: unit ? unit.getUnitId() : null, targetGridIndex: gridIndex });
        }

        private _setStateRequestingUnitSupply(): void {
            this._setState(State.RequestingUnitSupply);
            this._updateView();

            const unit = this.getFocusUnitLoaded();
            SpwLocalProxy.reqUnitSupply(this._getWar(), this._generateIMovePath(), unit ? unit.getUnitId() : null);
        }

        public setStateRequestingPlayerEndTurn(): void {
            this._setState(State.RequestingPlayerEndTurn);
            this._updateView();

            SpwLocalProxy.reqPlayerEndTurn(this._getWar());
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            this._setState(State.RequestingPlayerDeleteUnit);

            this._updateView();
            SpwLocalProxy.reqPlayerDeleteUnit(this._getWar(), this.getCursor().getGridIndex());
        }

        public setStateRequestingPlayerVoteForDraw(isAgree: boolean): void {
            this._setState(State.RequestingPlayerVoteForDraw);

            this._updateView();
            SpwLocalProxy.reqPlayerVoteForDraw(this._getWar(), isAgree);
        }

        public setStateRequestingPlayerSurrender(): void {
            this._setState(State.RequestingPlayerSurrender);

            this._updateView();
            SpwLocalProxy.reqPlayerSurrender(this._getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.BwUnitActionsPanel, this._getDataForUnitActionsPanel());
            } else {
                TwnsPanelManager.close(TwnsPanelConfig.Dict.BwUnitActionsPanel);
            }
            if ((currState === State.MakingMovePath) || (currState === State.ChoosingAttackTarget)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.BwDamagePreviewPanel, { war: this._getWar() });
            } else {
                TwnsPanelManager.close(TwnsPanelConfig.Dict.BwDamagePreviewPanel);
            }
        }

        protected _checkCanControlUnit(unit: TwnsBwUnit.BwUnit): boolean {
            const playerInTurn = this._getWar().getPlayerInTurn();
            return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
                && (playerInTurn.getUserId() != null);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const war               = this._getWar() as SpwWar;
            const turnManager       = this._getTurnManager();
            const playerIndexInTurn = turnManager.getPlayerIndexInTurn();

            if ((war.getHumanPlayerIndexes().indexOf(playerIndexInTurn) < 0) ||
                (turnManager.getPhaseCode() !== TurnPhaseCode.Main)
            ) {
                return State.Idle;
            } else {
                const unit = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if (tile.checkIsUnitProducerForPlayer(playerIndexInTurn)) {
                        return State.ChoosingProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return State.PreviewingTileAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                } else {
                    if ((unit.getActionState() === UnitState.Idle) && (playerIndexInTurn === unit.getPlayerIndex())) {
                        return State.MakingMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                const previousGridIndex = this.getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && (GridIndexHelpers.checkIsEqual(previousGridIndex, gridIndex))) {
                    if (this._getUnitMap().getUnitOnMap(gridIndex)) {
                        return State.RequestingUnitAttackUnit;
                    } else {
                        return State.RequestingUnitAttackTile;
                    }
                } else {
                    return State.ChoosingAttackTarget;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            if (Helpers.getExisted(this.getAvailableDropDestinations()).every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                return State.ChoosingAction;
            } else {
                const chosenUnits               = [this.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of this.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Helpers.getExisted(this.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return State.ChoosingAction;
                    }
                }

                return State.RequestingUnitDrop;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > Helpers.getExisted(Helpers.getExisted(this.getFocusUnit()).getFlareMaxRange())) {
                return State.ChoosingAction;
            } else {
                const previousGridIndex = this.getCursor().getPreviousGridIndex();
                if ((previousGridIndex != null) && GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex)) {
                    return State.RequestingUnitLaunchFlare;
                } else {
                    return State.ChoosingFlareDestination;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex != null) && (GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex))) {
                return State.RequestingUnitLaunchSilo;
            } else {
                return State.ChoosingSiloDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex != null) && (GridIndexHelpers.checkIsEqual(previousGridIndex, gridIndex))) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getPlayerIndexInTurn();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return State.PreviewingTileAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                        return State.MakingMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitMovableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingMovableArea() !== unit) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        return State.PreviewingUnitVisibleArea;
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitVisibleArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingVisibleArea() !== unit) {
                        return State.PreviewingUnitVisibleArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingTileAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getVisibleUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexInTurn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): TwnsBwActionPlanner.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._getUnitMap().getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => this._setStateRequestingUnitBeLoaded() }]
                    : [];
            }
        }
        protected _getActionUnitJoin(): TwnsBwActionPlanner.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._getUnitMap().getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => this._setStateRequestingUnitJoin() }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0058),
                                callback: () => this._setStateRequestingUnitUseCoSuperPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitUseCoPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0054),
                                callback: () => this._setStateRequestingUnitUseCoPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitLoadCo(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Helpers.getExisted(this.getFocusUnit()).checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit     = Helpers.getExisted(this.getFocusUnit());
                const playerIndex   = focusUnit.getPlayerIndex();
                const unitMap       = this._getUnitMap();
                if (focusUnit.checkIsAdjacentUnitSupplier()) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this.getMapSize())) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                            return [{ actionType: UnitActionType.Supply, callback: () => this._setStateRequestingUnitSupply() }];
                        }
                    }
                }
                return [];
            }
        }
        protected _getActionUnitProduceUnit(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit         = Helpers.getExisted(this.getFocusUnit());
                const produceUnitType   = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                    return [];
                } else {
                    const costForProduceUnit = focusUnit.getProduceUnitCost();
                    if (Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) < 1) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= Helpers.getExisted(focusUnit.getMaxLoadUnitsCount())) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if ((this._getWar()).getPlayerInTurn().getFund() < costForProduceUnit) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0053)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => this._setStateRequestingUnitProduceUnit(),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(hasOtherAction: boolean): TwnsBwActionPlanner.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getVisibleUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitDropOnChooseAction()
                            : () => TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitDropOnChooseAction(),
                            }),
                    }];
                } else {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitWait()
                            : () => TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getMoveCost(targetGridIndex: GridIndex, movingUnit: TwnsBwUnit.BwUnit): number | null {
            if (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, this.getMapSize())) {
                return null;
            } else {
                const existingUnit = this._getUnitMap().getVisibleUnitOnMap(targetGridIndex);
                if ((existingUnit)                                              &&
                    (existingUnit.getTeamIndex() !== movingUnit.getTeamIndex())
                ) {
                    return null;
                } else {
                    return this._getTileMap().getTile(targetGridIndex).getMoveCostByUnit(movingUnit);
                }
            }
        }

        protected _addUnitForPreviewAttackableArea(unit: TwnsBwUnit.BwUnit): void {
            const canAttackAfterMove    = unit.checkCanAttackAfterMove();
            const beginningGridIndex    = unit.getGridIndex();
            const hasAmmo               = (!!unit.getPrimaryWeaponCurrentAmmo()) || (unit.checkHasSecondaryWeapon());
            const mapSize               = this.getMapSize();
            const unitMap               = this._getUnitMap();
            const newArea               = WarCommonHelpers.createAttackableAreaForUnit({
                movableArea: WarCommonHelpers.createMovableArea({
                    origin          : unit.getGridIndex(),
                    maxMoveCost     : unit.getFinalMoveRange(),
                    mapSize,
                    moveCostGetter  : gridIndex => this._getMoveCost(gridIndex, unit),
                }),
                mapSize,
                minAttackRange: unit.getMinAttackRange(),
                maxAttackRange: unit.getFinalMaxAttackRange(),
                checkCanAttack: (moveGridIndex) => {
                    const existingUnit = unitMap.getVisibleUnitOnMap(moveGridIndex);
                    return ((!existingUnit) || (existingUnit === unit))
                        && (hasAmmo)
                        && ((canAttackAfterMove) || (GridIndexHelpers.checkIsEqual(moveGridIndex, beginningGridIndex)));
                },
            });

            const unitsForPreviewAttack = this.getUnitsForPreviewingAttackableArea();
            unitsForPreviewAttack.set(unit.getUnitId(), unit);

            const areaForPreviewAttack = this.getAreaForPreviewingAttack();
            if (!areaForPreviewAttack.length) {
                this._setAreaForPreviewingAttack(newArea);
            } else {
                const { width, height } = mapSize;
                for (let x = 0; x < width; ++x) {
                    if (newArea[x]) {
                        if (!areaForPreviewAttack[x]) {
                            areaForPreviewAttack[x] = newArea[x];
                        } else {
                            for (let y = 0; y < height; ++y) {
                                areaForPreviewAttack[x][y] = areaForPreviewAttack[x][y] || newArea[x][y];
                            }
                        }
                    }
                }
            }
        }

        private _generateIMovePath(): ProtoTypes.Structure.IMovePath {
            const movePath = this.getMovePath();
            return {
                nodes           : movePath,
                isBlocked       : false,
                fuelConsumption : movePath[movePath.length - 1].totalMoveCost,
            };
        }
    }
}

// export default TwnsSpwActionPlanner;
