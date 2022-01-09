
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import TwnsClientErrorCode                  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import FloatText                            from "../../tools/helpers/FloatText";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import WwModel                              from "../model/WwModel";
// import WwProxy                              from "../model/WwProxy";
// import TwnsWwMainMenuPanel                  from "./WwMainMenuPanel";
// import TwnsWwMakeRequestDetailPanel         from "./WwMakeRequestDetailPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWwMakeRequestWarsPanel {
    import OpenDataForWarCommonMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import ClientErrorCode                          = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    type WarFilter = {
        warId?                  : number | null;
        coName?                 : string | null;
        mapName?                : string | null;
        userNickname?           : string | null;
        playersCountUnneutral?  : number | null;
    };
    export type OpenData = WarFilter | null;
    export class WwMakeRequestWarsPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForWarCommonMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelWatchWar!        : TwnsUiLabel.UiLabel;
        private readonly _labelMakeRequest!     : TwnsUiLabel.UiLabel;
        private readonly _labelChooseWar!       : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupWarList!         : eui.Group;
        private readonly _listWar!              : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar!           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _warFilter          : WarFilter = {};
        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwWatchGetUnwatchedWarInfos, callback: this._onNotifyMsgMpwWatchGetUnwatchedWarInfos },
                { type: NotifyType.MsgMpwWatchMakeRequest,          callback: this._onNotifyMsgMpwWatchMakeRequest },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForTargetWarInfo();

            this.setWarFilter(this._getOpenData() ?? this._warFilter);
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setWarFilter(filter: WarFilter): void {
            this._warFilter = filter;

            reqDataArray(filter);
        }

        public async setAndReviseSelectedWarId(warId: number, needScroll: boolean): Promise<void> {
            const listMap   = this._listWar;
            const index     = Helpers.getExisted(listMap.getRandomIndex(v => v.info.warInfo?.warId === warId));
            listMap.setSelectedIndex(index);
            this._updateComponentsForTargetWarInfo();

            if (needScroll) {
                listMap.scrollVerticalToIndex(index);
            }
        }
        private _getSelectedWarId(): number | null {
            return this._listWar.getSelectedData()?.info.warInfo?.warId ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMpwWatchGetUnwatchedWarInfos(): void {
            this._hasReceivedData = true;
            this._updateGroupWarList();
            this.setAndReviseSelectedWarId(-1, true);
        }

        private _onNotifyMsgMpwWatchMakeRequest(): void {
            FloatText.show(Lang.getText(LangTextType.A0060));
            reqDataArray(this._warFilter);
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwMainMenuPanel, void 0);
        }

        private _onTouchTapBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WwSearchWarPanel, void 0);
        }

        private _onTouchedBtnNextStep(): void {
            const data = this._listWar.getSelectedData();
            if (data) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.WwMakeRequestDetailPanel, {
                    watchInfo: data.info,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const info of WwModel.getUnwatchedWarInfos() || []) {
                dataArray.push({
                    info,
                    panel   : this,
                });
            }

            return dataArray;
        }

        private async _initTabSettings(): Promise<void> {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : TwnsCommonWarPlayerInfoPage.CommonWarPlayerInfoPage,
                    pageData    : this._createDataForCommonWarPlayerInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : TwnsCommonWarAdvancedSettingsPage.CommonWarAdvancedSettingsPage,
                    pageData    : this._createDataForCommonWarAdvancedSettingsPage(),
                },
            ]);
            this._isTabInitialized = true;
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelWatchWar.text        = Lang.getText(LangTextType.B0206);
            this._labelMakeRequest.text     = Lang.getText(LangTextType.B0207);
            this._labelChooseWar.text       = Lang.getText(LangTextType.B0589);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
            this._btnSearch.label           = Lang.getText(LangTextType.B0228);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0566);
        }

        private _updateGroupWarList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoWar.visible      = false;
                listWar.clear();

            } else {
                const dataArray         = this._createDataForListWar();
                labelLoading.visible    = false;
                labelNoWar.visible      = !dataArray.length;
                listWar.bindData(dataArray);
            }
        }

        private async _updateComponentsForTargetWarInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            if ((!this._hasReceivedData) || (this._getSelectedWarId() == null)) {
                btnNextStep.visible = false;
                groupTab.visible    = false;
            } else {
                btnNextStep.visible = true;

                if (!this._isTabInitialized) {
                    groupTab.visible = false;
                } else {
                    groupTab.visible = true;

                    this._tabSettings.updatePageData(0, this._createDataForCommonWarMapInfoPage());
                    this._tabSettings.updatePageData(1, this._createDataForCommonWarPlayerInfoPage());
                    this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
                    this._tabSettings.updatePageData(3, this._createDataForCommonWarAdvancedSettingsPage());
                }
            }
        }

        private _createDataForCommonWarMapInfoPage(): OpenDataForWarCommonMapInfoPage {
            return WwModel.createDataForCommonWarMapInfoPage(this._getSelectedWarId());
        }

        private _createDataForCommonWarPlayerInfoPage(): OpenDataForCommonWarPlayerInfoPage {
            return WwModel.createDataForCommonWarPlayerInfoPage(this._getSelectedWarId());
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await WwModel.createDataForCommonWarBasicSettingsPage(this._getSelectedWarId());
        }

        private _createDataForCommonWarAdvancedSettingsPage(): OpenDataForCommonWarAdvancedSettingsPage {
            return WwModel.createDataForCommonWarAdvancedSettingsPage(this._getSelectedWarId());
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 1, y: 80 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    };
    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this._getData().name;
        }
    }

    type DataForWarRenderer = {
        info    : ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
        panel   : WwMakeRequestWarsPanel;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedWarId(Helpers.getExisted(data.info.warInfo?.warId, ClientErrorCode.WwMakeRequestWarsPanel_WarRenderer_OnTouchTapBtnChoose_00), false);
        }

        private _updateView(): void {
            this._updateLabelId();
            this._updateLabelType();
            this._updateLabelName();
        }

        private _updateLabelId(): void {
            this._labelId.text = `#${this._getData().info.warInfo?.warId}`;
        }

        private _updateLabelType(): void {
            const warInfo   = this._getData().info.warInfo;
            const label     = this._labelType;
            if (warInfo == null) {
                label.text = CommonConstants.ErrorTextForUndefined;
            } else {
                label.text = Lang.getWarTypeName(WarCommonHelpers.getWarTypeByMpwWarInfo(warInfo)) ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private async _updateLabelName(): Promise<void> {
            const labelName = this._labelName;
            labelName.text  = ``;

            const warInfo = this._getData().info.warInfo;
            if (warInfo != null) {
                const { settingsForMfw, settingsForCcw, settingsForMcw, settingsForMrw } = warInfo;
                if (settingsForMfw) {
                    labelName.text = settingsForMfw.warName || `----`;

                } else if (settingsForMcw) {
                    const warName = settingsForMcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId     = settingsForMcw.mapId;
                        labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId)) || CommonConstants.ErrorTextForUndefined;
                    }

                } else if (settingsForCcw) {
                    const warName = settingsForCcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId     = settingsForCcw.mapId;
                        labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId)) || CommonConstants.ErrorTextForUndefined;
                    }

                } else if (settingsForMrw) {
                    const mapId     = settingsForMrw.mapId;
                    labelName.text  = (mapId == null ? null : await WarMapModel.getMapNameInCurrentLanguage(mapId)) || CommonConstants.ErrorTextForUndefined;
                }
            }
        }
    }

    function reqDataArray(filter: WarFilter): void {
        WwProxy.reqUnwatchedWarInfos({
            warId                   : filter.warId,
            coName                  : filter.coName,
            mapName                 : filter.mapName,
            userNickname            : filter.userNickname,
            playersCountUnneutral   : filter.playersCountUnneutral,
        });
    }
}

// export default TwnsWwMakeRequestWarsPanel;
