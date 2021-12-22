
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import TwnsMcrMainMenuPanel                 from "../../multiCustomRoom/view/McrMainMenuPanel";
// import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
// import TwnsMrwMyWarListPanel                from "../../multiRankWar/view/MrwMyWarListPanel";
// import TwnsSpmMainMenuPanel                 from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import MrrModel                             from "../model/MrrModel";
// import TwnsMrrMyRoomListPanel               from "./MrrMyRoomListPanel";
// import TwnsMrrPreviewMapListPanel           from "./MrrPreviewMapListPanel";
// import TwnsMrrSetMaxConcurrentCountPanel    from "./MrrSetMaxConcurrentCountPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMrrMainMenuPanel {
    import NotifyType                       = TwnsNotifyType.NotifyType;
    import Tween                            = egret.Tween;

    export type OpenData = void;
    export class MrrMainMenuPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!                : eui.Group;
        private readonly _btnMultiPlayer!       : TwnsUiButton.UiButton;
        private readonly _btnRanking!           : TwnsUiButton.UiButton;
        private readonly _btnSinglePlayer!      : TwnsUiButton.UiButton;

        private readonly _groupLeft!            : eui.Group;
        private readonly _btnSetGameNumber!     : TwnsUiButton.UiButton;
        private readonly _btnMyRoom!            : TwnsUiButton.UiButton;
        private readonly _btnContinueWar!       : TwnsUiButton.UiButton;
        private readonly _btnPreviewStdMaps!    : TwnsUiButton.UiButton;
        private readonly _btnPreviewFogMaps!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnSetGameNumber,   callback: this._onTouchedBtnSetGameNumber },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnPreviewStdMaps,  callback: this._onTouchedBtnPreviewStdMaps },
                { ui: this._btnPreviewFogMaps,  callback: this._onTouchedBtnPreviewFogMaps },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserLogout,                   callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,         callback: this._onMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrGetMyRoomPublicInfoList,   callback: this._onMsgMrrGetMyRoomPublicInfoList },
                { type: NotifyType.MsgMcrGetJoinedRoomInfoList,     callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: NotifyType.MsgMfrGetJoinedRoomInfoList,     callback: this._onMsgMfrGetJoinedRoomInfoList },
                { type: NotifyType.MsgCcrGetJoinedRoomInfoList,     callback: this._onMsgCcrGetJoinedRoomInfoList },
            ]);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrMainMenuPanel, void 0);
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmMainMenuPanel, void 0);
        }
        private _onTouchedBtnSetGameNumber(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrSetMaxConcurrentCountPanel, void 0);
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrMyRoomListPanel, void 0);
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrwMyWarListPanel, void 0);
        }
        private _onTouchedBtnPreviewStdMaps(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrPreviewMapListPanel, { hasFog: false });
        }
        private _onTouchedBtnPreviewFogMaps(): void {
            this.close();
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyTopPanel);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.LobbyBottomPanel);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrPreviewMapListPanel, { hasFog: true });
        }

        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgMrrGetRoomPublicInfo(): void {
            this._updateComponentsForRed();
        }
        private _onMsgMrrGetMyRoomPublicInfoList(): void {
            this._updateComponentsForRed();
        }
        private _onMsgMcrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }
        private _onMsgMfrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }
        private _onMsgCcrGetJoinedRoomInfoList(): void {
            this._updateBtnMultiPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForRed();
        }

        private async _updateComponentsForRed(): Promise<void> {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();

            this._btnMyRoom.setRedVisible(await MrrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMrwWars());
        }

        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(
                (MpwModel.checkIsRedForMyMcwWars()) ||
                (MpwModel.checkIsRedForMyMfwWars()) ||
                (MpwModel.checkIsRedForMyCcwWars()) ||
                (await McrModel.checkIsRed())       ||
                (await MfrModel.checkIsRed())       ||
                (await CcrModel.checkIsRed())
            );
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (MpwModel.checkIsRedForMyMrwWars()) ||
                (await MrrModel.checkIsRed())
            );
        }

        protected async _showOpenAnimation(): Promise<void> {
            const group = this._group;
            Tween.removeTweens(group);
            group.right = 60;
            group.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
            });

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            groupLeft.left  = 0;
            groupLeft.alpha = 1;

            Helpers.resetTween({
                obj         : this._btnSetGameNumber,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 50,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnPreviewStdMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 150,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnPreviewFogMaps,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });

            await Helpers.wait(200 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, right: 60 },
                endProps    : { alpha: 0, right: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupLeft,
                beginProps  : { alpha: 1, left: 0 },
                endProps    : { alpha: 0, left: -40},
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsMrrMainMenuPanel;
