
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
import MeModel                  from "../model/MeModel";

namespace TwnsMeAddWarEventToRulePanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenDataForMeAddWarEventId = {
        warRule     : ProtoTypes.WarRule.IWarRule;
    };
    export class MeAddWarEventToRulePanel extends TwnsUiPanel.UiPanel<OpenDataForMeAddWarEventId>{
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeAddWarEventToRulePanel;

        private _listWarEvent   : TwnsUiScrollList.UiScrollList<DataForWarEventRenderer>;
        private _labelTitle     : TwnsUiLabel.UiLabel;
        private _labelNoWarEvent: TwnsUiLabel.UiLabel;
        private _btnClose       : TwnsUiButton.UiButton;

        public static show(openData: OpenDataForMeAddWarEventId): void {
            if (!MeAddWarEventToRulePanel._instance) {
                MeAddWarEventToRulePanel._instance = new MeAddWarEventToRulePanel();
            }
            MeAddWarEventToRulePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MeAddWarEventToRulePanel._instance) {
                await MeAddWarEventToRulePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeAddWarEventToRulePanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._listWarEvent.setItemRenderer(WarEventRenderer);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListMessageAndLabelNoMessage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0468);
            this._labelNoWarEvent.text  = Lang.getText(LangTextType.B0278);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListMessageAndLabelNoMessage(): void {
            const dataArray : DataForWarEventRenderer[] = [];
            const warRule   = this._getOpenData().warRule;
            for (const warEvent of MeModel.getWar().getWarEventManager().getWarEventFullData().eventArray || []) {
                dataArray.push({
                    warEventId  : warEvent.eventId,
                    warRule,
                });
            }

            this._labelNoWarEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray.sort((v1, v2) => v1.warEventId - v2.warEventId));
        }
    }

    type DataForWarEventRenderer = {
        warEventId  : number;
        warRule     : ProtoTypes.WarRule.IWarRule;
    };
    class WarEventRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarEventRenderer> {
        private _labelId    : TwnsUiLabel.UiLabel;
        private _btnDelete  : TwnsUiButton.UiButton;
        private _labelName  : TwnsUiLabel.UiLabel;
        private _btnAdd     : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnAdd,     callback: this._onTouchedBtnAdd },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MeWarEventIdArrayChanged,   callback: this._onNotifyMeWarEventIdArrayChanged },
            ]);
            this._updateComponentsForLanguage();
            this._btnDelete.setTextColor(0xFF0000);
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMeWarEventIdArrayChanged(e: egret.Event): void {
            this._updateBtnAddAndBtnDelete();
        }
        private _onTouchedBtnAdd(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                WarRuleHelpers.addWarEventId(data.warRule, data.warEventId);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }
        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                WarRuleHelpers.deleteWarEventId(data.warRule, data.warEventId);
                Notify.dispatch(NotifyType.MeWarEventIdArrayChanged);
            }
        }

        protected async _onDataChanged(): Promise<void> {
            const data          = this.data;
            this._labelId.text  = `#${data.warEventId}`;
            this._updateLabelName();
            this._updateBtnAddAndBtnDelete();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label   = Lang.getText(LangTextType.B0220);
            this._btnAdd.label      = Lang.getText(LangTextType.B0467);

            this._updateLabelName();
        }

        private _updateLabelName(): void {
            const data              = this.data;
            this._labelName.text    = data
                ? Lang.getLanguageText({ textArray: MeModel.getWar().getWarEventManager().getWarEvent(data.warEventId).eventNameArray })
                : undefined;
        }

        private _updateBtnAddAndBtnDelete(): void {
            const data = this.data;
            if (data) {
                const isAdded               = (data.warRule.warEventIdArray || []).indexOf(data.warEventId) >= 0;
                this._btnAdd.visible        = !isAdded;
                this._btnDelete.visible     = isAdded;
            }
        }
    }
}

export default TwnsMeAddWarEventToRulePanel;
