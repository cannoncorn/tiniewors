
// import TwnsBwUnit               from "../../baseWar/model/BwUnit";
// import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
// import Types                    from "../../tools/helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsTwActionPlanner {
    import GridIndex    = Types.GridIndex;
    import State        = Types.ActionPlannerState;
    export class TwActionPlanner extends TwnsBwActionPlanner.BwActionPlanner {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
            // nothing to do
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            // nothing to do
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            // nothing to do
        }

        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void {
            // nothing to do
        }

        public setStateRequestingPlayerEndTurn(): void {
            // nothing to do
        }

        public setStateRequestingPlayerUseCoSkill(): void {
            // nothing to do
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            // nothing to do
        }

        public setStateRequestingPlayerVoteForDraw(): void {
            // nothing to do
        }

        public setStateRequestingPlayerSurrender(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            // nothing to do
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
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingUnitAttackableArea(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingUnitMovableArea(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingUnitVisibleArea(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingTileAttackableArea(gridIndex: GridIndex): State {
            return State.Idle;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitJoin(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitUseCoSuperPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitUseCoPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitLoadCo(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitCapture(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitDive(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitSurface(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitBuildTile(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitSupply(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitProduceUnit(): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitWait(hasOtherAction: boolean): TwnsBwActionPlanner.DataForUnitAction[] {
            return [];
        }
    }

}

// export default TwnsTwActionPlanner;
