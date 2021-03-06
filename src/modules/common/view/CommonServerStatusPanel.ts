
// import CommonProxy          from "../../common/model/CommonProxy";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonServerStatusPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class CommonServerStatusPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;

        private readonly _labelAccountsTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelAccounts!            : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTimeTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTime!          : TwnsUiLabel.UiLabel;
        private readonly _labelNewAccountsTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelNewAccounts!         : TwnsUiLabel.UiLabel;
        private readonly _labelActiveAccountsTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelActiveAccounts!      : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            CommonProxy.reqCommonGetServerStatus();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgCommonGetServerStatus(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCommonGetServerStatus.IS;

            this._labelAccounts.text        = "" + data.totalAccounts;

            const totalOnlineTime           = data.totalOnlineTime;
            this._labelOnlineTime.text      = totalOnlineTime == null ? CommonConstants.ErrorTextForUndefined : Helpers.getTimeDurationText(totalOnlineTime);

            const activeAccounts            = data.activeAccounts;
            this._labelActiveAccounts.text  = activeAccounts == null ? CommonConstants.ErrorTextForUndefined : activeAccounts.join(" / ");

            const newAccounts               = data.newAccounts;
            this._labelNewAccounts.text     = newAccounts == null ? CommonConstants.ErrorTextForUndefined : newAccounts.join(" / ");
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(LangTextType.B0327);
            this._labelAccountsTitle.text       = `${Lang.getText(LangTextType.B0328)}:`;
            this._labelOnlineTimeTitle.text     = `${Lang.getText(LangTextType.B0329)}:`;
            this._labelNewAccountsTitle.text    = `${Lang.getText(LangTextType.B0330)}:`;
            this._labelActiveAccountsTitle.text = `${Lang.getText(LangTextType.B0331)}:`;
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsCommonServerStatusPanel;
