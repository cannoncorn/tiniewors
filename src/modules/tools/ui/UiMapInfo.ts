
import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
import TwnsMeTileSimpleView     from "../../mapEditor/view/MeTileSimpleView";
import UserModel                from "../../user/model/UserModel";
import UserProxy                from "../../user/model/UserProxy";
import WarMapModel              from "../../warMap/model/WarMapModel";
import CommonConstants          from "../helpers/CommonConstants";
import ConfigManager            from "../helpers/ConfigManager";
import FloatText                from "../helpers/FloatText";
import SoundManager from "../helpers/SoundManager";
import Types                    from "../helpers/Types";
import Lang                     from "../lang/Lang";
import TwnsLangTextType         from "../lang/LangTextType";
import TwnsNotifyType           from "../notify/NotifyType";
import ProtoTypes               from "../proto/ProtoTypes";
import WarCommonHelpers         from "../warHelpers/WarCommonHelpers";
import TwnsUiComponent          from "./UiComponent";
import TwnsUiImage              from "./UiImage";
import TwnsUiLabel              from "./UiLabel";
import TwnsUiListItemRenderer   from "./UiListItemRenderer";
import TwnsUiScrollList         from "./UiScrollList";

namespace TwnsUiMapInfo {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import TileType         = Types.TileType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    type DataForUiMapInfo = {
        mapInfo?    : {
            mapId           : number;
        };
        warData?    : ProtoTypes.WarSerialization.ISerialWar;
    };

    export class UiMapInfo extends TwnsUiComponent.UiComponent {
        private readonly _groupTile             : eui.Group;
        private readonly _listTile              : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

        private readonly _groupMapInfo          : eui.Group;
        private readonly _labelMapName          : TwnsUiLabel.UiLabel;
        private readonly _labelDesignerTitle    : TwnsUiLabel.UiLabel;
        private readonly _labelDesigner         : TwnsUiLabel.UiLabel;
        private readonly _labelRatingTitle      : TwnsUiLabel.UiLabel;
        private readonly _labelRating           : TwnsUiLabel.UiLabel;
        private readonly _groupMyRating         : eui.Group;
        private readonly _labelMyRatingTitle    : TwnsUiLabel.UiLabel;
        private readonly _labelMyRating         : TwnsUiLabel.UiLabel;
        private readonly _imgSetMyRating        : TwnsUiImage.UiImage;
        private readonly _labelPlayedTimesTitle : TwnsUiLabel.UiLabel;
        private readonly _labelPlayedTimes      : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCountTitle: TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCount     : TwnsUiLabel.UiLabel;
        private readonly _labelMapSizeTitle     : TwnsUiLabel.UiLabel;
        private readonly _labelMapSize          : TwnsUiLabel.UiLabel;

        private _data: DataForUiMapInfo | null;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetMapRating, callback: this._onNotifyMsgUserSetMapRating },
                { type: NotifyType.MsgMapGetBriefData,  callback: this._onNotifyMsgMapGetBriefData },
            ]);
            this._setUiListenerArray([
                { ui: this._groupMyRating,              callback: this._onTouchedBtnSetMyRating },
            ]);
            this._listTile.setItemRenderer(TileRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForMapInfo();
        }

        public setData(data: DataForUiMapInfo | null): void {
            this._data = data;
            if (this.getIsOpening()) {
                this._updateComponentsForMapInfo();
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgUserSetMapRating(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserSetMapRating.IS;
            if (data.mapId === this._data?.mapInfo?.mapId) {
                this._updateComponentsForMapInfo();
            }
        }
        private _onNotifyMsgMapGetBriefData(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMapGetBriefData.IS;
            if (data.mapId === this._data?.mapInfo?.mapId) {
                this._updateComponentsForMapInfo();
            }
        }
        private _onTouchedBtnSetMyRating(): void {
            const mapId = this._data?.mapInfo?.mapId;
            if (mapId != null) {
                const minValue = CommonConstants.MapMinRating;
                const maxValue = CommonConstants.MapMaxRating;
                TwnsCommonInputPanel.CommonInputPanel.show({
                    title           : Lang.getText(LangTextType.B0363),
                    currentValue    : `${UserModel.getMapRating(mapId) || 0}`,
                    maxChars        : 2,
                    charRestrict    : "0-9",
                    tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const text  = panel.getInputText();
                        const value = text ? Number(text) : NaN;
                        if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                            FloatText.show(Lang.getText(LangTextType.A0098));
                        } else {
                            UserProxy.reqUserSetMapRating(mapId, value);
                        }
                    },
                });
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelDesignerTitle.text       = `${Lang.getText(LangTextType.B0163)}:`;
            this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
            this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0565);
            this._labelMapSizeTitle.text        = Lang.getText(LangTextType.B0300);
            this._labelRatingTitle.text         = Lang.getText(LangTextType.B0364);
            this._labelMyRatingTitle.text       = Lang.getText(LangTextType.B0363);
        }

        private async _updateComponentsForMapInfo(): Promise<void> {
            const data              = this._data;
            const labelMapName      = this._labelMapName;
            const labelDesigner     = this._labelDesigner;
            const labelPlayersCount = this._labelPlayersCount;
            const labelRating       = this._labelRating;
            const labelMyRating     = this._labelMyRating;
            const labelPlayedTimes  = this._labelPlayedTimes;
            const labelMapSize      = this._labelMapSize;
            const btnSetMyRating    = this._imgSetMyRating;

            if (data == null) {
                labelMapName.text       = `--`;
                labelDesigner.text      = `--`;
                labelPlayersCount.text  = `--`;
                labelRating.text        = `--`;
                labelMyRating.text      = `--`;
                labelPlayedTimes.text   = `--`;
                labelMapSize.text       = `--`;
                btnSetMyRating.visible  = false;

                return;
            }

            const mapInfo = data.mapInfo;
            if (mapInfo) {
                const mapId             = mapInfo.mapId;
                const mapRawData        = await WarMapModel.getRawData(mapId);
                const rating            = await WarMapModel.getAverageRating(mapId);
                const myRating          = UserModel.getMapRating(mapId);
                labelMapName.text       = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                labelDesigner.text      = mapRawData.designerName;
                labelPlayersCount.text  = `${mapRawData.playersCountUnneutral}`;
                labelRating.text        = rating != null ? rating.toFixed(2) : Lang.getText(LangTextType.B0001);
                labelMyRating.text      = myRating != null ? `${myRating}` : Lang.getText(LangTextType.B0001);
                labelPlayedTimes.text   = `${await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId)}`;
                labelMapSize.text       = `${mapRawData.mapWidth} x ${mapRawData.mapHeight}`;
                btnSetMyRating.visible  = true;
                this._listTile.bindData(generateDataForListTile(mapRawData.tileDataArray));

                return;
            }

            const warData = data.warData;
            if (warData) {
                const tileMapData       = warData.field.tileMap;
                const mapSize           = WarCommonHelpers.getMapSize(tileMapData);
                labelMapName.text       = `--`;
                labelDesigner.text      = `--`;
                labelPlayersCount.text  = `${warData.playerManager.players.length - 1}`;
                labelRating.text        = `--`;
                labelPlayedTimes.text   = `--`;
                labelMapSize.text       = `${mapSize.width} x ${mapSize.height}`;
                btnSetMyRating.visible  = false;
                this._listTile.bindData(generateDataForListTile(tileMapData.tiles));

                return;
            }
        }
    }

    function generateDataForListTile(tileDataArray: ProtoTypes.WarSerialization.ISerialTile[]): DataForTileRenderer[] {
        const tileCountDict = new Map<TileType, number>();
        for (const tile of tileDataArray || []) {
            const tileType = ConfigManager.getTileType(tile.baseType, tile.objectType);
            if (tileType != null) {
                tileCountDict.set(tileType, (tileCountDict.get(tileType) || 0) + 1);
            }
        }

        const dataArray: DataForTileRenderer[] = [];
        for (const tileType of TileTypes) {
            dataArray.push({
                tileType,
                num     : tileCountDict.get(tileType) || 0,
            });
        }
        return dataArray;
    }

    const TileTypes: TileType[] = [
        TileType.Factory,
        TileType.City,
        TileType.Airport,
        TileType.TempAirport,
        TileType.Seaport,
        TileType.TempSeaport,
        TileType.CommandTower,
        TileType.Radar,
    ];
    type DataForTileRenderer = {
        tileType        : Types.TileType;
        num             : number;
    };
    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _labelNum       : TwnsUiLabel.UiLabel;

        private _tileView       = new TwnsMeTileSimpleView.MeTileSimpleView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);

            const tileView = this._tileView;
            this._conTileView.addChild(tileView.getImgBase());
            this._conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();

        }
        protected async _onClosed(): Promise<void> {
            this._conTileView.removeChildren();
        }

        protected _onDataChanged(): void {
            const data          = this.data;
            this._labelNum.text = `x${data.num}`;

            const tileObjectType = ConfigManager.getTileObjectTypeByTileType(data.tileType);
            this._tileView.init({
                tileBaseType        : null,
                tileBaseShapeId     : null,
                tileObjectType      : tileObjectType,
                tileObjectShapeId   : 0,
                playerIndex         : tileObjectType === Types.TileObjectType.Headquarters
                    ? CommonConstants.WarFirstPlayerIndex
                    : CommonConstants.WarNeutralPlayerIndex,
            });
            this._tileView.updateView();
        }

        public _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }
    }
}

export default TwnsUiMapInfo;
