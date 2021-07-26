
import CommonConstants  from "../../tools/helpers/CommonConstants";
import FloatText        from "../../tools/helpers/FloatText";
import Types            from "../../tools/helpers/Types";
import Lang             from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import Notify           from "../../tools/notify/Notify";
import TwnsNotifyType   from "../../tools/notify/NotifyType";
import ProtoTypes       from "../../tools/proto/ProtoTypes";
import TwnsUiButton     from "../../tools/ui/UiButton";
import TwnsUiLabel      from "../../tools/ui/UiLabel";
import TwnsUiPanel      from "../../tools/ui/UiPanel";
import TwnsUiTextInput  from "../../tools/ui/UiTextInput";
import MeModel          from "../model/MeModel";

namespace TwnsMeModifyRuleNamePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;

    type OpenDataForModifyRuleNamePanel = {
        ruleId  : number;
    };
    export class MeModifyRuleNamePanel extends TwnsUiPanel.UiPanel<OpenDataForModifyRuleNamePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeModifyRuleNamePanel;

        private _inputChinese   : TwnsUiTextInput.UiTextInput;
        private _inputEnglish   : TwnsUiTextInput.UiTextInput;
        private _labelTip       : TwnsUiLabel.UiLabel;
        private _labelTitle     : TwnsUiLabel.UiLabel;
        private _labelChinese   : TwnsUiLabel.UiLabel;
        private _labelEnglish   : TwnsUiLabel.UiLabel;
        private _btnModify      : TwnsUiButton.UiButton;
        private _btnClose       : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForModifyRuleNamePanel): void {
            if (!MeModifyRuleNamePanel._instance) {
                MeModifyRuleNamePanel._instance = new MeModifyRuleNamePanel();
            }

            MeModifyRuleNamePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MeModifyRuleNamePanel._instance) {
                await MeModifyRuleNamePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName               = "resource/skins/mapEditor/MeModifyRuleNamePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
            ]);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            const chineseText   = this._inputChinese.text || ``;
            const englishText   = this._inputEnglish.text || ``;
            const textList      : ILanguageText[] = [
                { languageType: Types.LanguageType.Chinese, text: chineseText || englishText },
                { languageType: Types.LanguageType.English, text: englishText || chineseText },
            ];
            if (textList.every(v => v.text.length <= 0)) {
                FloatText.show(Lang.getText(LangTextType.A0155));
            } else if (textList.some(v => v.text.length > CommonConstants.WarRuleNameMaxLength)) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.WarRuleNameMaxLength));
            } else {
                MeModel.getWar().setWarRuleNameList(this._getOpenData().ruleId, textList);
                Notify.dispatch(NotifyType.MeWarRuleNameChanged);
                this.close();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            const textList          = MeModel.getWar().getWarRuleByRuleId(this._getOpenData().ruleId).ruleNameArray;
            this._inputChinese.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.Chinese });
            this._inputEnglish.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.English });
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label    = Lang.getText(LangTextType.B0146);
            this._btnModify.label   = Lang.getText(LangTextType.B0317);
            this._labelChinese.text = Lang.getText(LangTextType.B0455);
            this._labelEnglish.text = Lang.getText(LangTextType.B0456);
            this._labelTip.text     = Lang.getText(LangTextType.A0156);
            this._labelTitle.text   = `${Lang.getText(LangTextType.B0459)} #${this._getOpenData().ruleId}`;
        }
    }
}

export default TwnsMeModifyRuleNamePanel;
