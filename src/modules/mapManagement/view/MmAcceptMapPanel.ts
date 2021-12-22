
// import TwnsMeWar            from "../../mapEditor/model/MeWar";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import WarMapProxy          from "../../warMap/model/WarMapProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmAcceptMapPanel {
    import MeWar        = TwnsMeWar.MeWar;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import LangTextType = TwnsLangTextType.LangTextType;

    export type OpenData = {
        war: MeWar;
    };
    export class MmAcceptMapPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;
        private readonly _inputReason!  : TwnsUiTextInput.UiTextInput;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        private readonly _groupMcw!     : eui.Group;
        private readonly _labelMcw!     : TwnsUiLabel.UiLabel;
        private readonly _imgMcw!       : TwnsUiImage.UiImage;

        private readonly _groupCcw!     : eui.Group;
        private readonly _labelCcw!     : TwnsUiLabel.UiLabel;
        private readonly _imgCcw!       : TwnsUiImage.UiImage;

        private readonly _groupScw!     : eui.Group;
        private readonly _labelScw!     : TwnsUiLabel.UiLabel;
        private readonly _imgScw!       : TwnsUiImage.UiImage;

        private readonly _groupSrw!     : eui.Group;
        private readonly _labelSrw!     : TwnsUiLabel.UiLabel;
        private readonly _imgSrw!       : TwnsUiImage.UiImage;

        private readonly _groupMrwStd!  : eui.Group;
        private readonly _labelMrwStd!  : TwnsUiLabel.UiLabel;
        private readonly _imgMrwStd!    : TwnsUiImage.UiImage;

        private readonly _groupMrwFog!  : eui.Group;
        private readonly _labelMrwFog!  : TwnsUiLabel.UiLabel;
        private readonly _imgMrwFog!    : TwnsUiImage.UiImage;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupCcw,       callback: this._onTouchedGroupCcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
                { ui: this._groupMrwStd,    callback: this._onTouchedGroupMrwStd },
                { ui: this._groupMrwFog,    callback: this._onTouchedGroupMrwFog },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._inputReason.maxChars  = CommonConstants.MapReviewCommentMaxLength;
            this._imgMcw.visible        = false;
            this._imgCcw.visible        = false;
            this._imgScw.visible        = false;
            this._imgSrw.visible        = false;
            this._imgMrwStd.visible     = false;
            this._imgMrwFog.visible     = false;
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }
        private _onTouchedBtnConfirm(): void {
            const war = this._getOpenData().war;
            WarMapProxy.reqMmReviewMap({
                designerUserId  : war.getMapDesignerUserId(),
                slotIndex       : war.getMapSlotIndex(),
                modifiedTime    : war.getMapModifiedTime(),
                isAccept        : true,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : this._imgMcw.visible,
                    canCcw      : this._imgCcw.visible,
                    canScw      : this._imgScw.visible,
                    canSrw      : this._imgSrw.visible,
                    canMrwStd   : this._imgMrwStd.visible,
                    canMrwFog   : this._imgMrwFog.visible,
                },
            });
            this.close();
        }
        private _onTouchedGroupMcw(): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }
        private _onTouchedGroupCcw(): void {
            this._imgCcw.visible = !this._imgCcw.visible;
        }
        private _onTouchedGroupScw(): void {
            this._imgScw.visible = !this._imgScw.visible;
        }
        private _onTouchedGroupSrw(): void {
            this._imgSrw.visible = !this._imgSrw.visible;
        }
        private _onTouchedGroupMrwStd(): void {
            this._imgMrwStd.visible = !this._imgMrwStd.visible;
        }
        private _onTouchedGroupMrwFog(): void {
            this._imgMrwFog.visible = !this._imgMrwFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._labelTitle.text   = Lang.getText(LangTextType.B0296);
            this._labelTips.text    = Lang.getText(LangTextType.A0105);
            this._labelMcw.text     = Lang.getText(LangTextType.B0200);
            this._labelCcw.text     = Lang.getText(LangTextType.B0619);
            this._labelMrwStd.text  = Lang.getText(LangTextType.B0404);
            this._labelMrwFog.text  = Lang.getText(LangTextType.B0408);
            this._labelScw.text     = Lang.getText(LangTextType.B0409);
            this._labelSrw.text     = Lang.getText(LangTextType.B0614);
        }
    }
}

// export default TwnsMmAcceptMapPanel;
