
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapEditor {
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;

    export class MeMfwAdvancedSettingsPage extends GameUi.UiTabPage<void> {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelPlayerList        : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeMfwAdvancedSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelPlayerList.text          = Lang.getText(Lang.Type.B0395);
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = Lang.getLanguageText({ textArray: MeModel.Mfw.getMapRawData().mapNameArray });
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + MeModel.Mfw.getMapRawData().playersCountUnneutral;
        }

        private _updateListPlayer(): void {
            const playersCount  = MeModel.Mfw.getMapRawData().playersCountUnneutral;
            const dataList      : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataList.push({ playerIndex });
            }
            this._listPlayer.bindData(dataList);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
    };
    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _listInfo   : GameUi.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            this._listInfo.visible  = true;
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data;
            const playerIndex   = data.playerIndex;
            return [
                this._createDataController(playerIndex),
                this._createDataTeamIndex(playerIndex),
                this._createDataCo(playerIndex),
                this._createDataSkinId(playerIndex),
                this._createDataInitialFund(playerIndex),
                this._createDataIncomeMultiplier(playerIndex),
                this._createDataEnergyAddPctOnLoadCo(playerIndex),
                this._createDataEnergyGrowthMultiplier(playerIndex),
                this._createDataMoveRangeModifier(playerIndex),
                this._createDataAttackPowerModifier(playerIndex),
                this._createDataVisionRangeModifier(playerIndex),
                this._createDataLuckLowerLimit(playerIndex),
                this._createDataLuckUpperLimit(playerIndex),
            ];
        }
        private _createDataController(playerIndex: number): DataForInfoRenderer {
            const isControlledByPlayer = MeModel.Mfw.getIsControlledByHuman(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0424),
                infoText                : isControlledByPlayer ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        MeModel.Mfw.setIsControlledByPlayer(playerIndex, !isControlledByPlayer);
                        MeModel.Mfw.setCoId(playerIndex, CommonConstants.CoEmptyId);
                        this._updateView();
                    });
                },
            };
        }
        private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0019),
                infoText                : Lang.getPlayerTeamName(MeModel.Mfw.getTeamIndex(playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        MeModel.Mfw.tickTeamIndex(playerIndex);
                        this._updateView();
                    });
                },
            };
        }
        private _createDataCo(playerIndex: number): DataForInfoRenderer {
            const coId          = MeModel.Mfw.getCoId(playerIndex);
            const configVersion = MeModel.Mfw.getWarData().settingsForCommon.configVersion;
            return {
                titleText               : Lang.getText(Lang.Type.B0425),
                infoText                : ConfigManager.getCoNameAndTierText(configVersion, coId),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    Common.CommonChooseCoPanel.show({
                        currentCoId         : coId,
                        availableCoIdArray  : MeModel.Mfw.getIsControlledByHuman(playerIndex)
                            ? BwWarRuleHelper.getAvailableCoIdArrayForPlayer(MeModel.Mfw.getWarRule(), playerIndex, configVersion)
                            : ConfigManager.getEnabledCoArray(configVersion).map(v => v.coId),
                        callbackOnConfirm   : newCoId => {
                            if (newCoId !== coId) {
                                MeModel.Mfw.setCoId(playerIndex, newCoId);
                                this._updateView();
                            }
                        },
                    });
                },
            };
        }
        private _createDataSkinId(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0397),
                infoText                : Lang.getUnitAndTileSkinName(MeModel.Mfw.getUnitAndTileSkinId(playerIndex)),
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : () => {
                    MeModel.Mfw.tickUnitAndTileSkinId(playerIndex);
                    this._updateView();
                },
            };
        }
        private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
            const currValue = MeModel.Mfw.getInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                        const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0178),
                            currentValue    : "" + currValue,
                            maxChars        : 7,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setInitialFund(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                }
            };
        }
        private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue = MeModel.Mfw.getIncomeMultiplier(playerIndex);
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0179),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setIncomeMultiplier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getEnergyAddPctOnLoadCo(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0180),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setEnergyAddPctOnLoadCo(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0181),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setEnergyGrowthMultiplier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0182),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setMoveRangeModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0183),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setAttackPowerModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0184),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    MeModel.Mfw.setVisionRangeModifier(playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0189),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    const upperLimit = MeModel.Mfw.getLuckUpperLimit(playerIndex);
                                    if (value <= upperLimit) {
                                        MeModel.Mfw.setLuckLowerLimit(playerIndex, value);
                                    } else {
                                        MeModel.Mfw.setLuckUpperLimit(playerIndex, value);
                                        MeModel.Mfw.setLuckLowerLimit(playerIndex, upperLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }
        private _createDataLuckUpperLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = MeModel.Mfw.getLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : () => {
                    this._confirmUseCustomRule(() => {
                        Common.CommonInputPanel.show({
                            title           : Lang.getText(Lang.Type.B0190),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    const lowerLimit = MeModel.Mfw.getLuckLowerLimit(playerIndex);
                                    if (value >= lowerLimit) {
                                        MeModel.Mfw.setLuckUpperLimit(playerIndex, value);
                                    } else {
                                        MeModel.Mfw.setLuckLowerLimit(playerIndex, value);
                                        MeModel.Mfw.setLuckUpperLimit(playerIndex, lowerLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                    });
                },
            };
        }

        private _confirmUseCustomRule(callback: () => void): void {
            // if (MeModel.Mfw.getPresetWarRuleId() == null) {
            //     callback();
            // } else {
            //     Common.CommonConfirmPanel.show({
            //         content : Lang.getText(Lang.Type.A0129),
            //         callback: () => {
            //             MeModel.Mfw.setPresetWarRuleId(null);
            //             callback();
            //         },
            //     });
            // }
            callback();
        }
    }

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
        callbackOnTouchedTitle  : (() => void) | null;
    };

    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnTitle,   callback: this._onTouchedBtnTitle },
            ]);
        }

        protected _onDataChanged(): void {
            const data                  = this.data;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
            this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
        }

        private _onTouchedBtnTitle(): void {
            const data      = this.data;
            const callback  = data ? data.callbackOnTouchedTitle : null;
            (callback) && (callback());
        }
    }

    function getTextColor(value: number, defaultValue: number): number {
        if (value > defaultValue) {
            return 0x00FF00;
        } else if (value < defaultValue) {
            return 0xFF0000;
        } else {
            return 0xFFFFFF;
        }
    }
}
