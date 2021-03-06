
// import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                from "../../user/model/UserModel";
// import MfrCreateModel           from "../model/MfrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMfrCreatePlayerInfoPage {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class MfrCreatePlayerInfoPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _groupInfo!    : eui.Group;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreatePlayerInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }
        private _updateComponentsForRoomInfo(): void {
            const dataArray         : DataForPlayerRenderer[] = [];
            const maxPlayerIndex    = Helpers.getExisted(MfrCreateModel.getInitialWarData().playerManager?.players).length - 1;
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= maxPlayerIndex; ++playerIndex) {
                dataArray.push({
                    playerIndex,
                });
            }
            this._listPlayer.bindData(dataArray);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCoHead!            : TwnsUiImage.UiImage;
        private readonly _imgCoInfo!            : TwnsUiImage.UiImage;
        private readonly _labelNickname!        : TwnsUiLabel.UiLabel;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex!     : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex!       : TwnsUiLabel.UiLabel;
        private readonly _labelRankStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankStd!         : TwnsUiLabel.UiLabel;
        private readonly _labelRankFogTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankFog!         : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const playerIndex       = this._getData().playerIndex;
            const initialWarData    = MfrCreateModel.getInitialWarData();
            const coId              = initialWarData.playerManager?.players?.find(v => v.playerIndex === playerIndex)?.coId;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonCoInfoPanel, {
                    configVersion   : Helpers.getExisted(initialWarData.settingsForCommon?.configVersion),
                    coId,
                });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
            this._updateComponentsForSettings();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelRankFogTitle.text    = Lang.getText(LangTextType.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const playerIndex           = this._getData().playerIndex;
            const initialWarData        = MfrCreateModel.getInitialWarData();
            const settingsForCommon     = Helpers.getExisted(initialWarData.settingsForCommon);
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarRuleHelpers.getTeamIndex(Helpers.getExisted(settingsForCommon.warRule), playerIndex)) || CommonConstants.ErrorTextForUndefined;

            const playerData            = Helpers.getExisted(initialWarData.playerManager?.players?.find(v => v.playerIndex === playerIndex));
            this._imgSkin.source        = WarCommonHelpers.getImageSourceForCoHeadFrame(playerData.unitAndTileSkinId);

            const coId                  = Helpers.getExisted(playerData.coId);
            const configVersion         = Helpers.getExisted(settingsForCommon.configVersion);
            const coCfg                 = ConfigManager.getCoBasicCfg(Helpers.getExisted(configVersion), coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(configVersion, coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userInfo              = MfrCreateModel.getSelfPlayerIndex() === playerIndex ? await UserModel.getUserPublicInfo(Helpers.getExisted(UserModel.getSelfUserId())) : null;
            const labelNickname         = this._labelNickname;
            if (userInfo) {
                labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;
            } else {
                labelNickname.text = playerData.userId == null ? Lang.getText(LangTextType.B0607) : `??`;
            }

            const rankScoreArray        = userInfo?.userMrwRankInfoArray;
            const stdRankInfo           = rankScoreArray ? rankScoreArray.find(v => v.warType === Types.WarType.MrwStd) : null;
            const fogRankInfo           = rankScoreArray ? rankScoreArray.find(v => v.warType === Types.WarType.MrwFog) : null;
            const stdScore              = stdRankInfo ? stdRankInfo.currentScore : null;
            const fogScore              = fogRankInfo ? fogRankInfo.currentScore : null;
            const stdRank               = stdRankInfo ? stdRankInfo.currentRank : null;
            const fogRank               = fogRankInfo ? fogRankInfo.currentRank : null;
            this._labelRankStd.text     = stdRankInfo
                ? `${stdScore == null ? CommonConstants.RankInitialScore : stdScore} (${stdRank == null ? `--` : `${stdRank}${Helpers.getSuffixForRank(stdRank)}`})`
                : `??`;
            this._labelRankFog.text     = fogRankInfo
                ? `${fogScore == null ? CommonConstants.RankInitialScore : fogScore} (${fogRank == null ? `--` : `${fogRank}${Helpers.getSuffixForRank(fogRank)}`})`
                : `??`;
        }
    }
}

// export default TwnsMfrCreatePlayerInfoPage;
