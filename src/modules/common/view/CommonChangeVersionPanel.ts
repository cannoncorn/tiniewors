
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

namespace TwnsCommonChangeVersionPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import GameVersion  = Types.GameVersion;

    export class CommonChangeVersionPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonChangeVersionPanel;

        private readonly _group!        : eui.Group;
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!      : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;
        private readonly _listVersion!  : TwnsUiScrollList.UiScrollList<DataForVersionRenderer>;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;

        public static show(): void {
            if (!CommonChangeVersionPanel._instance) {
                CommonChangeVersionPanel._instance = new CommonChangeVersionPanel();
            }

            CommonChangeVersionPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (CommonChangeVersionPanel._instance) {
                await CommonChangeVersionPanel._instance.close();
            }
        }
        public static getInstance(): CommonChangeVersionPanel {
            return CommonChangeVersionPanel._instance;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonChangeVersionPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listVersion.setItemRenderer(VersionRenderer);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
            this._initListVersion();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _getSelectedGameVersion(): GameVersion | null {
            const selectedData = this._listVersion.getSelectedData();
            return selectedData ? selectedData.gameVersion : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnBack(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const selectedVersion = this._getSelectedGameVersion();
            if ((selectedVersion == null) || (selectedVersion === CommonConstants.GameVersion)) {
                this.close();
                return;
            }

            const url = getUrlForGameVersion(selectedVersion);
            if (url == null) {
                throw Helpers.newError(`CommonChangeVersionPanel._onTouchedBtnConfirm() empty url.`);
            } else {
                window.open(url);
            }
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0620);
            this._btnBack.label     = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._labelTips.text    = Lang.getText(LangTextType.A0219);
        }

        private _initListVersion(): void {
            const dataArray     = this._createDataForListVersion();
            const listVersion   = this._listVersion;
            listVersion.bindData(dataArray);
            listVersion.setSelectedIndex(dataArray.findIndex(v => v.gameVersion === CommonConstants.GameVersion));
        }

        private _createDataForListVersion(): DataForVersionRenderer[] {
            return [
                {
                    gameVersion : GameVersion.Legacy,
                },
                {
                    gameVersion : GameVersion.Test,
                },
                {
                    gameVersion : GameVersion.Awbw,
                },
            ];
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }

    type DataForVersionRenderer = {
        gameVersion : GameVersion;
    };
    class VersionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForVersionRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelDesc!    : TwnsUiLabel.UiLabel;
        private readonly _labelCurrent! : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            if (!this._getIsOpening()) {
                return;
            }

            const data = this.data;
            if (data == null) {
                throw Helpers.newError(`CommonChangeVersionPanel.VersionRenderer._updateView() empty data.`);
            }

            const gameVersion       = data.gameVersion;
            this._labelName.text    = Lang.getGameVersionName(gameVersion) || CommonConstants.ErrorTextForUndefined;
            this._labelDesc.text    = Lang.getGameVersionDesc(gameVersion) || CommonConstants.ErrorTextForUndefined;

            const labelCurrent      = this._labelCurrent;
            labelCurrent.text       = `(${Lang.getText(LangTextType.B0623)})`;
            labelCurrent.visible    = gameVersion === CommonConstants.GameVersion;
        }
    }

    function getUrlForGameVersion(version: GameVersion): string | null {
        switch (version) {
            case GameVersion.Legacy : return `https://www.tinywars.online`;
            case GameVersion.Test   : return `https://www.tinywars.online/test`;
            case GameVersion.Awbw   : return `https://awbw.amarriner.com/`;
            default                 : return null;
        }
    }
}

// export default TwnsCommonChangeVersionPanel;
