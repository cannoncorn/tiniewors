
namespace TinyWars.WarMap {
    import CommonModel      = Common.CommonModel;
    import UiImage          = GameUi.UiImage;
    import TimeModel        = Time.TimeModel;
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.CommonConstants;
    import MapSize          = Types.MapSize;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialWar       = WarSerialization.ISerialWar;
    import ISerialTile      = WarSerialization.ISerialTile;
    import ISerialPlayer    = WarSerialization.ISerialPlayer;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class WarMapView extends egret.DisplayObjectContainer {
        private readonly _tileMapView   = new TileMapView();
        private readonly _unitMapView   = new WarMapUnitMapView();

        public constructor() {
            super();

            this.addChild(this._tileMapView);
            this.addChild(this._unitMapView);
        }

        public showMapByMapData(mapRawData: IMapRawData): void {
            this.width  = GRID_WIDTH  * mapRawData.mapWidth;
            this.height = GRID_HEIGHT * mapRawData.mapHeight;
            this._tileMapView.showTileMap(mapRawData.tileDataArray);
            this._unitMapView.showUnitMap({
                unitDataArray   : mapRawData.unitDataArray,
                players         : null,
            });
        }
        public showMapByWarData(warData: ISerialWar, players?: ISerialPlayer[]): void {
            const field     = warData.field;
            const tileMap   = field.tileMap;
            const mapSize   = BaseWar.BwHelpers.getMapSize(tileMap);
            this.width      = GRID_WIDTH * mapSize.width;
            this.height     = GRID_HEIGHT * mapSize.height;

            players = players || warData.playerManager.players;
            this._tileMapView.showTileMap(tileMap.tiles, players);
            this._unitMapView.showUnitMap({
                unitDataArray   : field.unitMap.units,
                players,
            });
        }

        public clear(): void {
            this._tileMapView.clear();
            this._unitMapView.clear();
        }
    }

    class TileMapView extends egret.DisplayObjectContainer {
        private readonly _baseLayer             = new TileBaseLayer();
        private readonly _gridBorderLayer       = new egret.DisplayObjectContainer();
        private readonly _objectLayer           = new TileObjectLayer();

        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
            { type: Notify.Type.IsShowGridBorderChanged,    callback: this._onNotifyIsShowGridBorderChanged },
        ];

        public constructor() {
            super();

            this._gridBorderLayer.alpha = 0.3;
            this.addChild(this._baseLayer);
            this.addChild(this._gridBorderLayer);
            this.addChild(this._objectLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showTileMap(dataList: ISerialTile[], players?: ISerialPlayer[]): void {
            this._baseLayer.updateWithTileDataList(dataList, players);
            this._objectLayer.updateWithTileDataList(dataList, players);
            this._resetGridBorderLayer(dataList);
        }
        public clear(): void {
            this.showTileMap([]);
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListeners(this._notifyListenerArray, this);
        }
        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListeners(this._notifyListenerArray, this);
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._baseLayer.updateViewOnTick();
            this._objectLayer.updateViewOnTick();
        }

        private _onNotifyIsShowGridBorderChanged(e: egret.Event): void {
            this._updateGridBorderLayerVisible();
        }

        private _resetGridBorderLayer(tileDataArray: ISerialTile[]): void {
            const { width: mapWidth, height: mapHeight }    = getMapSize(tileDataArray);
            const borderWidth                               = mapWidth * GRID_WIDTH;
            const borderHeight                              = mapHeight * GRID_HEIGHT;
            const gridBorderLayer                           = this._gridBorderLayer;
            gridBorderLayer.removeChildren();
            for (let x = 0; x <= mapWidth; ++x) {
                const img   = new GameUi.UiImage(`commonColorBlack0000`);
                img.width   = 2;
                img.height  = borderHeight;
                img.x       = (x * GRID_WIDTH) - 1;
                gridBorderLayer.addChild(img);
            }
            for (let y = 0; y <= mapHeight; ++y) {
                const img   = new GameUi.UiImage(`commonColorBlack0000`);
                img.width   = borderWidth;
                img.height  = 2;
                img.y       = (y * GRID_HEIGHT) - 1;
                gridBorderLayer.addChild(img);
            }
            this._updateGridBorderLayerVisible();
        }
        private _updateGridBorderLayerVisible(): void {
            this._gridBorderLayer.visible = User.UserModel.getSelfSettingsIsShowGridBorder();
        }
    }

    abstract class TileLayerBase extends eui.Component {
        private readonly _tileDataMap   : Types.WarMapTileViewData[][] = [];
        private readonly _imageMap      : UiImage[][] = [];

        public updateWithTileDataList(tileDataArray: ISerialTile[], players?: ISerialPlayer[]): void {
            const mapSize = getMapSize(tileDataArray);
            this._resetTileDataMap(mapSize, tileDataArray, players);
            this._resetImageMap(mapSize);

            this.updateViewOnTick();
        }

        public updateViewOnTick(): void {
            const imageMap      = this._imageMap;
            const tileDataMap   = this._tileDataMap;
            const width         = tileDataMap.length;
            const height        = width > 0 ? tileDataMap[0].length : 0;
            const tickCount     = Time.TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imageMap[x][y].source = this._getImageSource(tileDataMap[x][y], tickCount);
                }
            }
        }

        private _resetTileDataMap(mapSize: MapSize, tileDataArray: ISerialTile[], players?: ISerialPlayer[]): void {
            const map       = this._tileDataMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            map.length      = width;
            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column    = map[x];
                column.length   = height;
                column.fill(undefined);
            }

            for (const rawTileData of tileDataArray) {
                const tileData                  = Helpers.deepClone(rawTileData) as Types.WarMapTileViewData;
                const gridIndex                 = tileData.gridIndex;
                tileData.skinId                 = players ? players.find(v => v.playerIndex === tileData.playerIndex).unitAndTileSkinId : null;
                map[gridIndex.x][gridIndex.y]   = tileData;
            }
        }
        private _resetImageMap(mapSize: MapSize): void {
            const map       = this._imageMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            for (let x = width; x < map.length; ++x) {
                for (const img of map[x] || []) {
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
            }
            map.length = width;

            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column = map[x];
                for (let y = height; y < column.length; ++y) {
                    const img = column[y];
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
                column.length = height;

                for (let y = 0; y < height; ++y) {
                    if (column[y] == null) {
                        const img   = new UiImage();
                        img.x       = GRID_WIDTH * x;
                        img.y       = this._getImageY(y);
                        column[y]   = img;
                        this.addChild(img);
                    }
                }
            }
        }

        protected abstract _getImageSource(tileData: Types.WarMapTileViewData, tickCount: number): string;
        protected abstract _getImageY(gridY: number): number;
    }

    class TileBaseLayer extends TileLayerBase {
        protected _getImageSource(tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? undefined
                : CommonModel.getCachedTileBaseImageSource({
                    version : User.UserModel.getSelfSettingsTextureVersion(),
                    baseType: tileData.baseType,
                    shapeId : tileData.baseShapeId || 0,
                    isDark  : false,
                    skinId  : CommonConstants.UnitAndTileNeutralSkinId,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * gridY;
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(tileData: Types.WarMapTileViewData, tickCount: number): string {
            return tileData == null
                ? undefined
                : CommonModel.getCachedTileObjectImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    objectType  : tileData.objectType,
                    shapeId     : tileData.objectShapeId || 0,
                    isDark      : false,
                    skinId      : tileData.skinId || tileData.playerIndex,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * (gridY - 1);
        }
    }

    function getMapSize(tileDataArray: ISerialTile[]): MapSize {
        let width   = 0;
        let height  = 0;
        for (const tile of tileDataArray) {
            const gridIndex = tile.gridIndex;
            width           = Math.max(gridIndex.x + 1, width);
            height          = Math.max(gridIndex.y + 1, height);
        }

        return { width, height };
    }

    class WarMapUnitMapView extends egret.DisplayObjectContainer {
        private readonly _unitViews             : WarMapUnitView[] = [];
        private readonly _airLayer              = new egret.DisplayObjectContainer();
        private readonly _groundLayer           = new egret.DisplayObjectContainer();
        private readonly _seaLayer              = new egret.DisplayObjectContainer();
        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: Notify.Type.UnitAnimationTick, callback: this._onNotifyUnitAnimationTick }
        ];

        public constructor() {
            super();

            this.addChild(this._seaLayer);
            this.addChild(this._groundLayer);
            this.addChild(this._airLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showUnitMap({ unitDataArray, players }: {
            unitDataArray   : WarSerialization.ISerialUnit[];
            players         : ISerialPlayer[] | null;
        }): void {
            this._initWithDataList(_createUnitViewDataList({ unitDataArray, players }));
        }
        private _initWithDataList(dataList: Types.WarMapUnitViewData[]): void {
            this.clear();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of dataList) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }
        public clear(): void {
            for (const view of this._unitViews) {
                (view.parent) && (view.parent.removeChild(view));
            }
            this._unitViews.length = 0;
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListeners(this._notifyListenerArray, this);
        }
        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListeners(this._notifyListenerArray, this);
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const view of this._unitViews) {
                view.updateOnAnimationTick(tickCount);
            }
        }

        private _reviseZOrderForAllUnits(): void {
            this._reviseZOrderForSingleLayer(this._airLayer);
            this._reviseZOrderForSingleLayer(this._groundLayer);
            this._reviseZOrderForSingleLayer(this._seaLayer);
        }
        private _reviseZOrderForSingleLayer(layer: egret.DisplayObjectContainer): void {
            const unitsCount    = layer.numChildren;
            const unitViews     : WarMapUnitView[] = [];
            for (let i = 0; i < unitsCount; ++i) {
                unitViews.push(layer.getChildAt(i) as WarMapUnitView);
            }
            unitViews.sort((v1, v2): number => {
                const g1 = v1.getData().gridIndex;
                const g2 = v2.getData().gridIndex;
                const y1 = g1.y;
                const y2 = g2.y;
                return y1 !== y2 ? y1 - y2 : g1.x - g2.x;
            })

            for (let i = 0; i < unitsCount; ++i) {
                layer.addChildAt(unitViews[i], i);
            }
        }

        private _addUnit(data: Types.WarMapUnitViewData, tickCount: number): void {
            const unitType = data.unitType;
            const view     = new WarMapUnitView(data, tickCount);
            this._unitViews.push(view);

            const configVersion = ConfigManager.getLatestFormalVersion();
            if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Ground)) {
                this._groundLayer.addChild(view);
            } else {
                this._seaLayer.addChild(view);
            }
        }
    }

    function _createUnitViewDataList({ unitDataArray, players }: {
        unitDataArray   : WarSerialization.ISerialUnit[];
        players         : ISerialPlayer[] | null;
    }): Types.WarMapUnitViewData[] {
        const dataArray: Types.WarMapUnitViewData[] = [];
        if (unitDataArray) {
            const loaderUnitIdSet = new Set<number>();
            for (const unitData of unitDataArray) {
                const loaderUnitId = unitData.loaderUnitId;
                if (loaderUnitId == null) {
                    dataArray.push(Helpers.deepClone(unitData));
                } else {
                    loaderUnitIdSet.add(loaderUnitId);
                }
            }

            for (const unitData of dataArray) {
                if (loaderUnitIdSet.has(unitData.unitId)) {
                    unitData.hasLoadedUnit = true;
                }

                const playerData = players ? players.find(v => v.playerIndex === unitData.playerIndex) : null;
                if (playerData) {
                    unitData.coUsingSkillType   = playerData.coUsingSkillType;
                    unitData.skinId             = playerData.unitAndTileSkinId;
                }
            }
        }

        return dataArray;
    }
}