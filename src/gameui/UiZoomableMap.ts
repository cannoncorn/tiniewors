
namespace TinyWars.GameUi {
    import ProtoTypes = Utility.ProtoTypes;

    export class UiZoomableMap extends UiComponent {
        private _zoomableComponent  = new UiZoomableComponent();
        private _mapView            = new WarMap.WarMapView();

        public constructor() {
            super();

            const zoom  = this._zoomableComponent;
            zoom.left   = 0;
            zoom.right  = 0;
            zoom.top    = 0;
            zoom.bottom = 0;
            zoom.addContent(this._mapView);
            this.addChild(zoom);

            this.dispatchEventWith(egret.Event.COMPLETE);
        }

        protected _onOpened(): void {
            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(true);
            zoom.setTouchListenerEnabled(true);
        }
        protected async _onClosed(): Promise<void> {
            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(false);
            zoom.setTouchListenerEnabled(false);

            this.clearMap();
        }

        public showMapByMapData(map: ProtoTypes.Map.IMapRawData): void {
            const mapView = this._mapView;
            mapView.showMapByMapData(map);

            const zoom = this._zoomableComponent;
            zoom.setContentWidth(mapView.width);
            zoom.setContentHeight(mapView.height);
            zoom.setContentScale(0, true);
        }
        public showMapByWarData(data: ProtoTypes.WarSerialization.ISerialWar): void {
            const mapView = this._mapView;
            mapView.showMapByWarData(data);

            const zoom = this._zoomableComponent;
            zoom.setContentWidth(mapView.width);
            zoom.setContentHeight(mapView.height);
            zoom.setContentScale(0, true);
        }

        public clearMap(): void {
            this._mapView.clear();
        }
    }
}
