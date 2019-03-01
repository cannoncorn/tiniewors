
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import StageManager     = Utility.StageManager;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import TemplateMapModel = WarMap.WarMapModel;
    import TemplateMapProxy = WarMap.WarMapProxy;

    export class McrExitMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrExitMapListPanel;

        private _listWar   : GameUi.UiScrollList;
        private _labelNoWar: GameUi.UiLabel;
        private _zoomMap   : GameUi.UiZoomableComponent;
        private _btnBack   : GameUi.UiButton;

        private _groupInfo      : eui.Group;
        private _labelMapName   : GameUi.UiLabel;
        private _labelDesigner  : GameUi.UiLabel;
        private _labelHasFog    : GameUi.UiLabel;
        private _labelWarComment: GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList;

        private _currentTouchPoints : Types.TouchPoints = {};
        private _previousTouchPoints: Types.TouchPoints = {};
        private _dataForListWar     : DataForWarRenderer[] = [];
        private _dataForListPlayer  : DataForPlayerRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrExitMapListPanel._instance) {
                McrExitMapListPanel._instance = new McrExitMapListPanel();
            }
            McrExitMapListPanel._instance.open();
        }
        public static hide(): void {
            if (McrExitMapListPanel._instance) {
                McrExitMapListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrExitMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.SMcrGetJoinedWaitingInfos,  callback: this._onNotifySMcrGetJoinedWaitingInfos },
                { type: Notify.Type.SMcrExitWar,                callback: this._onNotifySMcrExitWar },
            ];
            this._uiListeners = [
                { ui: this._zoomMap,   callback: this._onTouchBeginZoomMap, eventType: egret.TouchEvent.TOUCH_BEGIN },
                { ui: this._zoomMap,   callback: this._onTouchEndZoomMap,   eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._zoomMap.setMaskEnabled(true);
        }

        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            McrProxy.reqJoinedWaitingCustomOnlineWarInfos();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._listWar.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const datas            = this._dataForListWar;
            this._selectedWarIndex = datas[newIndex] ? newIndex : undefined;

            if (datas[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, datas[oldIndex])
            };

            if (datas[newIndex]) {
                this._listWar.updateSingleData(newIndex, datas[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.removeAllContents();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySMcrGetJoinedWaitingInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(McrModel.getJoinedWaitingInfos());
            this._dataForListWar = newData;

            if (newData.length > 0) {
                this._labelNoWar.visible = false;
                this._listWar.bindData(newData);
            } else {
                this._labelNoWar.visible = true;
                this._listWar.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onNotifySMcrExitWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0016));
        }

        private _onTouchBeginZoomMap(e: egret.TouchEvent): void {
            const touchesCount = Helpers.getObjectKeysCount(this._currentTouchPoints);
            if (touchesCount <= 0) {
                this._zoomMap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }

            const touchId = e.touchPointID;
            if (touchesCount <= 1) {
                this._currentTouchPoints[touchId]  = { x: e.stageX, y: e.stageY };
                this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
            }
        }

        private _onTouchEndZoomMap(e: egret.TouchEvent): void {
            delete this._currentTouchPoints[e.touchPointID];
            delete this._previousTouchPoints[e.touchPointID];

            if (Helpers.checkIsEmptyObject(this._currentTouchPoints)) {
                this._zoomMap.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }
        }

        private _onTouchMoveZoomMap(e: egret.TouchEvent): void {
            const touchId = e.touchPointID;
            this._currentTouchPoints[touchId] = { x: e.stageX, y: e.stageY };

            if (Helpers.getObjectKeysCount(this._currentTouchPoints) > 1) {
                this._zoomMap.setZoomByTouches(this._currentTouchPoints, this._previousTouchPoints);
            } else {
                const zoomMap = this._zoomMap;
                zoomMap.setContentX(zoomMap.getContentX() + e.stageX - this._previousTouchPoints[touchId].x, true);
                zoomMap.setContentY(zoomMap.getContentY() + e.stageY - this._previousTouchPoints[touchId].y, true);
            }

            this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrExitMapListPanel.hide();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.IMcrWaitingInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    data.push({
                        warInfo : infos[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(warInfo: ProtoTypes.IMcrWaitingInfo, mapInfo: ProtoTypes.IMapDynamicInfo): DataForPlayerRenderer[] {
            const data: DataForPlayerRenderer[] = [
                {
                    playerIndex: 1,
                    playerName : warInfo.p1UserNickname,
                    teamIndex  : warInfo.p1TeamIndex,
                },
                {
                    playerIndex: 2,
                    playerName : warInfo.p2UserNickname,
                    teamIndex  : warInfo.p2TeamIndex,
                },
            ];
            if (mapInfo.playersCount >= 3) {
                data.push({
                    playerIndex: 3,
                    playerName : warInfo.p3UserNickname,
                    teamIndex  : warInfo.p3TeamIndex,
                });
            }
            if (mapInfo.playersCount >= 4) {
                data.push({
                    playerIndex: 4,
                    playerName : warInfo.p4UserNickname,
                    teamIndex  : warInfo.p4TeamIndex,
                });
            }

            return data;
        }

        private _createUnitViewDatas(unitViewIds: number[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
            const configVersion = ConfigManager.getNewestConfigVersion();
            const datas: Types.UnitViewData[] = [];

            let index  = 0;
            let unitId = 0;
            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const viewId = unitViewIds[index];
                    ++index;
                    if (viewId > 0) {
                        datas.push({
                            configVersion: configVersion,
                            gridX        : x,
                            gridY        : y,
                            viewId       : viewId,
                            unitId       : unitId,
                        });
                        ++unitId;
                    }
                }
            }
            return datas;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].warInfo;
            const [mapData, mapInfo]    = await Promise.all([TemplateMapModel.getMapData(warInfo as Types.MapIndexKey), TemplateMapModel.getMapDynamicInfoAsync(warInfo as Types.MapIndexKey)]);
            this._labelMapName.text     = Lang.getFormatedText(Lang.Type.F0000, mapInfo.mapName);
            this._labelDesigner.text    = Lang.getFormatedText(Lang.Type.F0001, mapInfo.mapDesigner);
            this._labelHasFog.text      = Lang.getFormatedText(Lang.Type.F0005, Lang.getText(warInfo.hasFog ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = warInfo.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapInfo));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapData.mapWidth, mapData.mapHeight);
            tileMapView.updateWithBaseViewIdArray(mapData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapData.tileObjects);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithDatas(this._createUnitViewDatas(mapData.units, mapData.mapWidth, mapData.mapHeight));

            const gridSize = ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForWarRenderer = {
        warInfo : ProtoTypes.IMcrWaitingInfo;
        index   : number;
        panel   : McrExitMapListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForWarRenderer;
            this.currentState    = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text = data.warInfo.warName || data.warInfo.mapName;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            McrExitDetailPanel.show(data.warInfo);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex: number;
        playerName : string;
        teamIndex  : number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForPlayerRenderer;
            this._labelIndex.text = Helpers.getColorTextForPlayerIndex(data.playerIndex);
            this._labelName.text  = data.playerName || "????";
            this._labelTeam.text  = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
        }
    }
}
