
// import TwnsChangeLogPanel           from "../../changeLog/view/ChangeLogPanel";
// import TwnsChatPanel                from "../../chat/view/ChatPanel";
// import TwnsCommonChangeVersionPanel from "../../common/view/CommonChangeVersionPanel";
// import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
// import TwnsCommonRankListPanel      from "../../common/view/CommonRankListPanel";
// import TwnsCommonServerStatusPanel  from "../../common/view/CommonServerStatusPanel";
// import TwnsLobbyBackgroundPanel     from "../../lobby/view/LobbyBackgroundPanel";
// import TwnsMmMainMenuPanel          from "../../mapManagement/view/MmMainMenuPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import LocalStorage                 from "../../tools/helpers/LocalStorage";
// import StageManager                 from "../../tools/helpers/StageManager";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiRadioButton            from "../../tools/ui/UiRadioButton";
// import UserModel                    from "../../user/model/UserModel";
// import UserProxy                    from "../../user/model/UserProxy";
// import TwnsUserChangeDiscordIdPanel from "./UserChangeDiscordIdPanel";
// import TwnsUserChangeNicknamePanel  from "./UserChangeNicknamePanel";
// import TwnsUserOnlineUsersPanel     from "./UserOnlineUsersPanel";
// import TwnsUserSetPasswordPanel     from "./UserSetPasswordPanel";
// import TwnsUserSetPrivilegePanel    from "./UserSetPrivilegePanel";
// import TwnsUserSetSoundPanel        from "./UserSetSoundPanel";
// import TwnsUserSetStageScalePanel   from "./UserSetStageScalePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsChatCommandPanel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;

    export type OpenData = {
        userId      : number | null;
        messageId   : number;
    };
    export class ChatCommandPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;
        private readonly _group!                    : eui.Group;
        private readonly _scroller!                 : eui.Scroller;

        private readonly _groupButtons!             : eui.Group;
        private readonly _btnUserInfo!              : TwnsUiButton.UiButton;
        private readonly _btnPrivateChat!           : TwnsUiButton.UiButton;
        private readonly _btnDeleteMessage!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,               callback: this.close },
                { ui: this._btnUserInfo,            callback: this._onTouchedBtnUserInfo },
                { ui: this._btnPrivateChat,         callback: this._onTouchedBtnPrivateChat },
                { ui: this._btnDeleteMessage,       callback: this._onTouchedBtnDeleteMessage },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._scroller.viewport.scrollV = 0;
            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnUserInfo(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserPanel, {
                userId  : this._getOpenData().userId,
            });
            this.close();
        }
        private _onTouchedBtnPrivateChat(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.ChatPanel, {
                toUserId    : this._getOpenData().userId,
            });
            this.close();
        }
        private _onTouchedBtnDeleteMessage(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0286),
                callback: () => {
                    ChatProxy.reqChatDeleteMessage(this._getOpenData().messageId);
                    this.close();
                },
            });
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

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateGroupButtons();
        }

        private async _updateGroupButtons(): Promise<void> {
            const group = this._groupButtons;
            group.removeChildren();

            const userId = this._getOpenData().userId;
            if ((userId != null) && (userId > 1000000)) {
                group.addChild(this._btnUserInfo);

                if (userId !== UserModel.getSelfUserId()) {
                    group.addChild(this._btnPrivateChat);
                }
            }
            if ((UserModel.getIsSelfAdmin()) || (UserModel.getIsSelfChatManager())) {
                group.addChild(this._btnDeleteMessage);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0155);
            this._btnUserInfo.label         = Lang.getText(LangTextType.B0224);
            this._btnPrivateChat.label      = Lang.getText(LangTextType.B0383);
            this._btnDeleteMessage.label    = Lang.getText(LangTextType.B0838);
        }
    }
}

// export default TwnsChatCommandPanel;
