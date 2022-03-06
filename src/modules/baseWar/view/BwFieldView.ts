
// import Helpers                      from "../../tools/helpers/Helpers";
// import TwnsBwField                  from "../model/BwField";
// import TwnsBwActionPlannerView      from "./BwActionPlannerView";
// import TwnsBwCursorView             from "./BwCursorView";
// import TwnsBwGridVisualEffectView   from "./BwGridVisualEffectView";
// import TwnsBwTileMapView            from "./BwTileMapView";
// import TwnsBwUnitMapView            from "./BwUnitMapView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwFieldView {
    export class BwFieldView extends egret.DisplayObjectContainer {
        private _field?                 : TwnsBwField.BwField;

        private _tileMapView?           : TwnsBwTileMapView.BwTileMapView;
        private _actionPlannerView?     : TwnsBwActionPlannerView.BwActionPlannerView;
        private _unitMapView?           : TwnsBwUnitMapView.BwUnitMapView;
        private _cursorView?            : TwnsBwCursorView.BwCursorView;
        private _gridVisionEffectView?  : TwnsBwGridVisualEffectView.BwGridVisualEffectView;

        public init(field: TwnsBwField.BwField): void {
            if (!this._field) {
                this._field = field;

                this._tileMapView           = field.getTileMap().getView();
                this._actionPlannerView     = field.getActionPlanner().getView();
                this._unitMapView           = field.getUnitMap().getView();
                this._cursorView            = field.getCursor().getView();
                this._gridVisionEffectView  = field.getGridVisualEffect().getView();
                this.addChild(this._tileMapView);
                this.addChild(this._actionPlannerView.getContainerForGrids());
                this.addChild(this._unitMapView);
                this.addChild(this._actionPlannerView.getContainerForUnits());
                this.addChild(this._cursorView);
                this.addChild(this._gridVisionEffectView);
            }
        }
        public fastInit(field: TwnsBwField.BwField): void {
            this._field = field;
        }

        public startRunningView(): void {
            // nothing to do
        }
        public stopRunningView(): void {
            // nothing to do
        }

        private _getUnitMapView(): TwnsBwUnitMapView.BwUnitMapView {
            return Helpers.getExisted(this._unitMapView);
        }
        private _getTileMapView(): TwnsBwTileMapView.BwTileMapView {
            return Helpers.getExisted(this._tileMapView);
        }

        public setUnitsVisible(visible: boolean): void {
            this._getUnitMapView().visible = visible;
        }
        public getUnitsVisible(): boolean {
            return this._getUnitMapView().visible;
        }

        public setTileObjectsVisible(visible: boolean): void {
            this._getTileMapView().setObjectLayerVisible(visible);
        }
        public getTileObjectsVisible(): boolean {
            return this._getTileMapView().getObjectLayerVisible();
        }

        public setTileBasesVisible(visible: boolean): void {
            this._getTileMapView().setBaseLayerVisible(visible);
        }
        public getTileBasesVisible(): boolean {
            return this._getTileMapView().getBaseLayerVisible();
        }

        public setTileDecoratorsVisible(visible: boolean): void {
            this._getTileMapView().setDecoratorLayerVisible(visible);
        }
        public getTileDecoratorsVisible(): boolean {
            return this._getTileMapView().getDecoratorLayerVisible();
        }
    }
}

// export default TwnsBwFieldView;
