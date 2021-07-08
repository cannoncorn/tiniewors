
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiCustomRoom {
    import Tween        = egret.Tween;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;
    import MpwModel     = MultiPlayerWar.MpwModel;

    export class McrMainMenuPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        // @ts-ignore
        private readonly _group             : eui.Group;
        // @ts-ignore
        private readonly _btnMultiPlayer    : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnRanking        : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnSinglePlayer   : GameUi.UiButton;

        // @ts-ignore
        private readonly _groupLeft         : eui.Group;
        // @ts-ignore
        private readonly _btnCreateRoom     : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnJoinRoom       : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnMyRoom         : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnContinueWar    : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnWatchWar       : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnReplayWar      : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnCoopMode       : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnFreeMode       : GameUi.UiButton;

        public static show(): void {
            if (!McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance = new McrMainMenuPanel();
            }
            McrMainMenuPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (McrMainMenuPanel._instance) {
                await McrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
                { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
                { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
                { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
                { ui: this._btnWatchWar,        callback: this._onTouchedBtnWatchWar },
                { ui: this._btnReplayWar,       callback: this._onTouchedBtnReplayWar },
                { ui: this._btnCoopMode,        callback: this._onTouchedBtnCoopMode },
                { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);

            this._showOpenAnimation();

            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnRanking(): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
        }
        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            SinglePlayerMode.SpmMainMenuPanel.show();
        }
        private _onTouchedBtnCreateRoom(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            McrCreateMapListPanel.show({});
        }
        private _onTouchedBtnJoinRoom(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            McrJoinRoomListPanel.show();
        }
        private _onTouchedBtnMyRoom(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            McrMyRoomListPanel.show();
        }
        private _onTouchedBtnContinueWar(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            MultiCustomWar.McwMyWarListPanel.show();
        }
        private _onTouchedBtnWatchWar(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            McrWatchMainMenuPanel.show();
        }
        private _onTouchedBtnReplayWar(): void {
            this.close();
            Lobby.LobbyTopPanel.hide();
            Lobby.LobbyBottomPanel.hide();
            ReplayWar.RwReplayListPanel.show();
        }
        private _onTouchedBtnCoopMode(): void {
            this.close();
            CoopCustomRoom.CcrMainMenuPanel.show();
        }
        private _onTouchedBtnFreeMode(): void {
            this.close();
            MultiFreeRoom.MfrMainMenuPanel.show();
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
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
                obj         : this._btnCreateRoom,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnJoinRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 1,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnMyRoom,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 2,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnContinueWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 3,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnWatchWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 4,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnReplayWar,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 5,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnCoopMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200 / 7 * 6,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnFreeMode,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, right: 60 },
                    endProps    : { alpha: 0, right: 20 },
                });
                Helpers.resetTween({
                    obj         : this._groupLeft,
                    beginProps  : { alpha: 1, left: 0 },
                    endProps    : { alpha: 0, left: -40 },
                    callback    : resolve,
                });
            });
        }

        private async _updateView(): Promise<void> {
            const watchInfos = MpwModel.getWatchRequestedWarInfos();
            this._btnMyRoom.setRedVisible(await McrModel.checkIsRed());
            this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMcwWars());
            this._btnWatchWar.setRedVisible((!!watchInfos) && (watchInfos.length > 0));
            this._btnCoopMode.setRedVisible(MpwModel.checkIsRedForMyCcwWars() || await CoopCustomRoom.CcrModel.checkIsRed());
            this._btnFreeMode.setRedVisible(MpwModel.checkIsRedForMyMfwWars() || await MultiFreeRoom.MfrModel.checkIsRed());
        }
    }
}
