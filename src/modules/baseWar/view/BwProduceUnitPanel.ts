

import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsBwActionPlanner      from "../model/BwActionPlanner";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import TwnsBwUnit               from "../model/BwUnit";
import TwnsBwWar                from "../model/BwWar";
import TwnsBwUnitDetailPanel    from "./BwUnitDetailPanel";
import TwnsBwUnitView           from "./BwUnitView";

namespace TwnsBwProduceUnitPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import BwUnitDetailPanel    = TwnsBwUnitDetailPanel.BwUnitDetailPanel;
    import BwUnitView           = TwnsBwUnitView.BwUnitView;
    import CommonInputPanel     = TwnsCommonInputPanel.CommonInputPanel;
    import UnitType             = Types.UnitType;
    import GridIndex            = Types.GridIndex;
    import BwWar                = TwnsBwWar.BwWar;

    type OpenDataForBwProduceUnitPanel = {
        gridIndex   : GridIndex;
        war         : BwWar;
    };
    export class BwProduceUnitPanel extends TwnsUiPanel.UiPanel<OpenDataForBwProduceUnitPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwProduceUnitPanel;

        private _imgMask    : TwnsUiImage.UiImage;
        private _group      : eui.Group;
        private _listUnit   : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private _btnCancel  : TwnsUiButton.UiButton;
        private _btnDetail  : TwnsUiButton.UiButton;

        private _dataForList: DataForUnitRenderer[];

        public static show(openData: OpenDataForBwProduceUnitPanel): void {
            if (!BwProduceUnitPanel._instance) {
                BwProduceUnitPanel._instance = new BwProduceUnitPanel();
            }
            BwProduceUnitPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwProduceUnitPanel._instance) {
                await BwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/baseWar/BwProduceUnitPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            this._showOpenAnimation();

            this._updateView();

            Notify.dispatch(NotifyType.BwProduceUnitPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._dataForList = null;

            Notify.dispatch(NotifyType.BwProduceUnitPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyBwPlannerStateChanged(): void {
            this.close();
        }

        private _onTouchedBtnCancel(): void {
            this._getOpenData().war.getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnDetail(): void {
            const selectedIndex = this._listUnit.getSelectedIndex();
            const data          = selectedIndex != null ? this._dataForList[selectedIndex] : null;
            if (data) {
                BwUnitDetailPanel.show({
                    unit  : data.unit,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label = Lang.getText(LangTextType.B0154);
            this._btnDetail.label = Lang.getText(LangTextType.B0267);
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList          : DataForUnitRenderer[] = [];
            const openData          = this._getOpenData();
            const war               = openData.war;
            const gridIndex         = openData.gridIndex;
            const tile              = war.getTileMap().getTile(gridIndex);
            const player            = tile.getPlayer();
            const currentFund       = player.getFund();
            const playerIndex       = player.getPlayerIndex();
            const configVersion     = war.getConfigVersion();
            const actionPlanner     = war.getActionPlanner();
            const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const unitCategory      = skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory();
            const minNormalizedHp   = skillCfg ? WarCommonHelpers.getNormalizedHp(skillCfg[3]) : WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

            for (const unitType of ConfigManager.getUnitTypesByCategory(configVersion, unitCategory)) {
                const unit = new TwnsBwUnit.BwUnit();
                unit.init({
                    gridIndex   : { x: -1, y: -1 },
                    unitId      : -1,
                    unitType,
                    playerIndex,
                }, configVersion);
                unit.startRunning(war);

                const costModifier  = player.getUnitCostModifier(gridIndex, false, unitType);
                const cfgCost       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
                dataList.push({
                    unitType,
                    currentFund,
                    actionPlanner,
                    gridIndex,
                    unit,
                    cfgCost,
                    costModifier,
                    unitProductionSkillCfg  : skillCfg,
                    minCost                 : skillCfg
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
                        : Math.floor(cfgCost * costModifier),
                    panel: this,
                });
            }

            return dataList.sort(sorterForDataForList);
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
        private _showCloseAnimation(): Promise<void> {
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

    function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForUnitRenderer = {
        unitType                : UnitType;
        unit                    : TwnsBwUnit.BwUnit;
        minCost                 : number;
        cfgCost                 : number;
        costModifier            : number;
        currentFund             : number;
        actionPlanner           : TwnsBwActionPlanner.BwActionPlanner;
        gridIndex               : GridIndex;
        unitProductionSkillCfg  : number[] | null;
        panel                   : BwProduceUnitPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private _group          : eui.Group;
        private _imgBg          : TwnsUiImage.UiImage;
        private _conUnitView    : eui.Group;
        private _labelName      : TwnsUiLabel.UiLabel;
        private _labelCost      : TwnsUiLabel.UiLabel;
        private _labelProduce   : TwnsUiLabel.UiLabel;
        private _unitView       : BwUnitView;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

            this._unitView = new BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        private _onNotifyLanguageChanged(): void {
            (this.data) && (this._updateView());
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            const data = this.data;
            if (data.currentFund < data.minCost) {
                FloatText.show(Lang.getText(LangTextType.B0053));
                return;
            }

            if (!data.panel.getIsOpening()) {
                return;
            }

            const actionPlanner = data.actionPlanner;
            if (actionPlanner.checkIsStateRequesting()) {
                return;
            }

            const skillCfg  = data.unitProductionSkillCfg;
            const unitType  = data.unitType;
            const gridIndex = data.gridIndex;
            if (!skillCfg) {
                actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, CommonConstants.UnitMaxHp);
            } else {
                const rawMinHp = skillCfg[3];
                const rawMaxHp = skillCfg[4];
                if (rawMinHp === rawMaxHp) {
                    actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, rawMinHp);
                } else {
                    const normalizer    = CommonConstants.UnitHpNormalizer;
                    const minHp         = rawMinHp;
                    const maxHp         = Math.min(
                        rawMaxHp,
                        Math.floor(data.currentFund * CommonConstants.UnitMaxHp / (data.cfgCost * data.costModifier * skillCfg[5] / 100) / normalizer) * normalizer
                    );
                    CommonInputPanel.show({
                        title           : `${Lang.getUnitName(unitType)} HP`,
                        currentValue    : "" + maxHp,
                        maxChars        : 3,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minHp}, ${maxHp}]`,
                        callback        : panel => {
                            const value = Number(panel.getInputText());
                            if ((isNaN(value)) || (value > maxHp) || (value < minHp)) {
                                FloatText.show(Lang.getText(LangTextType.A0098));
                            } else {
                                actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, value);
                            }
                        },
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data = this.data;

            const unitType                  = data.unitType;
            const isFundEnough              = data.currentFund >= data.minCost;
            this._labelCost.text            = `${Lang.getText(LangTextType.B0079)}: ${data.minCost}`;
            this._labelCost.textColor       = isFundEnough ? 0x00FF00 : 0xFF0000;
            this._labelName.text            = Lang.getUnitName(unitType);
            this._labelProduce.textColor    = isFundEnough ? 0x00FF00 : 0xFF0000;
            this._labelProduce.text         = Lang.getText(LangTextType.B0095);

            this._unitView.init(data.unit).startRunningView();
        }
    }
}

export default TwnsBwProduceUnitPanel;
