
namespace TinyWars.MultiCustomWar {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;

    export class McwTileBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwTileBriefPanel;

        private _conTileView    : eui.Group;
        private _tileView       : McwTileView;
        private _labelName      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _labelDefense   : GameUi.UiLabel;
        private _imgDefense     : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;

        private _war        : McwWar;
        private _cursor     : McwCursor;
        private _tileMap    : McwTileMap;

        public static show(): void {
            if (!McwTileBriefPanel._instance) {
                McwTileBriefPanel._instance = new McwTileBriefPanel();
            }
            McwTileBriefPanel._instance.open();
        }
        public static hide(): void {
            if (McwTileBriefPanel._instance) {
                McwTileBriefPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwTileBriefPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.McwCursorTapped,    callback: this._onNotifyMcwCursorTapped },
                { type: Notify.Type.McwCursorDragged,   callback: this._onNotifyMcwCursorDragged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ];
            this._uiListeners = [
                { ui: this, callback: this._onTouchedThis, },
            ];

            this._tileView = new McwTileView();
            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());
        }
        protected _onOpened(): void {
            this._war       = McwModel.getWar();
            this._tileMap   = this._war.getTileMap();
            this._cursor    = this._war.getField().getCursor();

            this._updateView();
        }
        protected _onClosed(): void {
            delete this._war;
        }

        private _onTouchedThis(e: egret.TouchEvent): void {
            Utility.FloatText.show("TODO");
        }
        private _onNotifyMcwCursorTapped(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwCursorDragged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._tileView.updateOnAnimationTick();
        }

        private _updateView(): void {
            const tile = this._tileMap.getTile(this._cursor.getGridIndex());
            this._tileView.init(tile).startRunningView();
            this._labelDefense.text = `${Math.floor(tile.getDefenseAmount() / 10)}`;
            this._labelName.text    = Lang.getTileName(tile.getType());

            if (tile.getCurrentHp() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_HP;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentHp()}`;
            } else if (tile.getCurrentCapturePoint() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_CAPTURE;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentCapturePoint()}`;
            } else if (tile.getCurrentBuildPoint() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_BUILD;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentBuildPoint()}`;
            } else {
                this._imgState.visible      = false;
                this._labelState.visible    = false;
            }
        }
    }
}
