
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;

    type OpenDataForBwCoListPanel = {
        war             : BwWar;
        selectedIndex   : number;
    }
    export class BwCoListPanel extends GameUi.UiPanel<OpenDataForBwCoListPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwCoListPanel;

        private _groupList  : eui.Group;
        private _listCo     : GameUi.UiScrollList<DataForCoRenderer>;
        private _btnBack    : GameUi.UiButton;

        private _groupInfo                      : eui.Group;
        private _scrCoInfo                      : eui.Scroller;
        private _imgCoPortrait                  : GameUi.UiImage;
        private _labelCommanderInfo             : GameUi.UiLabel;
        private _labelNameTitle                 : GameUi.UiLabel;
        private _labelName                      : GameUi.UiLabel;
        private _labelForceTitle                : GameUi.UiLabel;
        private _labelForce                     : GameUi.UiLabel;
        private _labelDesignerTitle             : GameUi.UiLabel;
        private _labelDesigner                  : GameUi.UiLabel;
        private _labelBoardCostPercentageTitle  : GameUi.UiLabel;
        private _labelBoardCostPercentage       : GameUi.UiLabel;
        private _labelZoneRadiusTitle           : GameUi.UiLabel;
        private _labelZoneRadius                : GameUi.UiLabel;
        private _labelEnergyBarTitle            : GameUi.UiLabel;
        private _labelEnergyBar                 : GameUi.UiLabel;

        private _listPassiveSkill   : GameUi.UiScrollList<DataForSkillRenderer>;
        private _labelNoPassiveSkill: GameUi.UiLabel;

        private _listCop            : GameUi.UiScrollList<DataForSkillRenderer>;
        private _labelNoCop         : GameUi.UiLabel;
        private _labelCopEnergyTitle: GameUi.UiLabel;
        private _labelCopEnergy     : GameUi.UiLabel;

        private _listScop               : GameUi.UiScrollList<DataForSkillRenderer>;
        private _labelNoScop            : GameUi.UiLabel;
        private _labelScopEnergyTitle   : GameUi.UiLabel;
        private _labelScopEnergy        : GameUi.UiLabel;

        private _scrHelp    : eui.Scroller;
        private _labelHelp  : GameUi.UiLabel;

        private _dataForListCo      : DataForCoRenderer[] = [];
        private _selectedIndex      : number;

        public static show(openData: OpenDataForBwCoListPanel): void {
            if (!BwCoListPanel._instance) {
                BwCoListPanel._instance = new BwCoListPanel();
            }

            BwCoListPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwCoListPanel._instance) {
                await BwCoListPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwCoListPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/baseWar/BwCoListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listCo.setItemRenderer(CoNameRenderer);
            this._listPassiveSkill.setItemRenderer(SkillRenderer);
            this._listCop.setItemRenderer(SkillRenderer);
            this._listScop.setItemRenderer(SkillRenderer);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();

            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this.setSelectedIndex(this._getOpenData().selectedIndex);

            Notify.dispatch(Notify.Type.BwCoListPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            Notify.dispatch(Notify.Type.BwCoListPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (!dataList[newIndex]) {
                this._selectedIndex = undefined;
                this._updateScrCoInfo(null);
                this._updateScrHelp(true);

            } else {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));

                const data = dataList[newIndex];
                this._updateScrCoInfo(data);
                this._updateScrHelp(!data.player);
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const group = this._groupList;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const _groupInfo = this._groupInfo;
            egret.Tween.removeTweens(_groupInfo);
            egret.Tween.get(_groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                const group = this._groupList;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200);

                const _groupInfo = this._groupInfo;
                egret.Tween.removeTweens(_groupInfo);
                egret.Tween.get(_groupInfo)
                    .set({ alpha: 1, right: 0 })
                    .to({ alpha: 0, right: -40 }, 200)
                    .call(resolve);
            });
        }

        private _createDataForListCo(): DataForCoRenderer[] {
            const data          : DataForCoRenderer[] = [];
            const war           = this._getOpenData().war;
            const playerManager = war.getPlayerManager();
            const configVersion = war.getConfigVersion();

            for (let i = 1; i <= playerManager.getTotalPlayersCount(false); ++i) {
                const player = playerManager.getPlayer(i);
                data.push({
                    configVersion,
                    player,
                    index   : i - 1,
                    panel   : this,
                });
            }
            data.push({
                configVersion   : null,
                player          : null,
                index           : data.length,
                panel           : this,
            });

            return data;
        }

        private _updateScrCoInfo(data: DataForCoRenderer): void {
            if ((!data) || (!data.player)) {
                this._scrCoInfo.visible = false;
            } else {
                this._scrCoInfo.visible = true;

                this._labelNameTitle.text                   = `${Lang.getText(Lang.Type.B0162)}: `;
                this._labelForceTitle.text                  = `${Lang.getText(Lang.Type.B0168)}: `;
                this._labelDesignerTitle.text               = `${Lang.getText(Lang.Type.B0163)}: `;
                this._labelBoardCostPercentageTitle.text    = `${Lang.getText(Lang.Type.B0164)}: `;
                this._labelZoneRadiusTitle.text             = `${Lang.getText(Lang.Type.B0165)}: `;
                this._labelEnergyBarTitle.text              = `${Lang.getText(Lang.Type.B0166)}: `;
                this._labelCopEnergyTitle.text              = `${Lang.getText(Lang.Type.B0167)}: `;
                this._labelScopEnergyTitle.text             = `${Lang.getText(Lang.Type.B0167)}: `;

                const player    = data.player;
                const coId      = player.getCoId();
                const cfg       = coId != null ? Utility.ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
                if (!cfg) {
                    this._imgCoPortrait.source          = "";
                    this._labelName.text                = "--";
                    this._labelDesigner.text            = "--";
                    this._labelForce.text               = "--";
                    this._labelBoardCostPercentage.text = "--";
                    this._labelZoneRadius.text          = "--";
                    this._labelEnergyBar.text           = "--";
                    this._labelNoPassiveSkill.text      = Lang.getText(Lang.Type.B0001);
                    this._labelNoCop.text               = Lang.getText(Lang.Type.B0001);
                    this._labelCopEnergy.text           = "--";
                    this._labelNoScop.text              = Lang.getText(Lang.Type.B0001);
                    this._labelScopEnergy.text          = "--";
                    this._listPassiveSkill.clear();
                    this._listCop.clear();
                    this._listScop.clear();

                } else {
                    this._imgCoPortrait.source          = ConfigManager.getCoBustImageSource(coId);
                    this._labelName.text                = cfg.name;
                    this._labelDesigner.text            = cfg.designer;
                    this._labelForce.text               = Lang.getPlayerForceName(player.getPlayerIndex());
                    this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
                    this._labelZoneRadius.text          = `${player.getCoZoneBaseRadius()}`;
                    this._labelEnergyBar.text           = (player.getCoZoneExpansionEnergyList() || []).join(` / `) || `--`;

                    const passiveSkills = cfg.passiveSkills || [];
                    if (!passiveSkills.length) {
                        this._labelNoPassiveSkill.text = Lang.getText(Lang.Type.B0001);
                        this._listPassiveSkill.clear();
                    } else {
                        this._labelNoPassiveSkill.text = "";
                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < passiveSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : passiveSkills[i],
                            });
                        }
                        this._listPassiveSkill.bindData(data);
                    }

                    const copSkills = player.getCoSkills(Types.CoSkillType.Power) || [];
                    if (!copSkills.length) {
                        this._labelNoCop.text       = Lang.getText(Lang.Type.B0001);
                        this._labelCopEnergy.text   = "--";
                        this._listCop.clear();
                    } else {
                        this._labelNoCop.text       = "";
                        this._labelCopEnergy.text   = `${player.getCoPowerEnergy()}`;

                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < copSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : copSkills[i],
                            });
                        }
                        this._listCop.bindData(data);
                    }

                    const scopSkills = player.getCoSkills(Types.CoSkillType.SuperPower) || [];
                    if (!scopSkills.length) {
                        this._labelNoScop.text      = Lang.getText(Lang.Type.B0001);
                        this._labelScopEnergy.text  = "--";
                        this._listScop.clear();
                    } else {
                        this._labelNoScop.text      = "";
                        this._labelScopEnergy.text  = `${player.getCoSuperPowerEnergy()}`;

                        const data: DataForSkillRenderer[] = [];
                        for (let i = 0; i < scopSkills.length; ++i) {
                            data.push({
                                index   : i + 1,
                                skillId : scopSkills[i],
                            });
                        }
                        this._listScop.bindData(data);
                    }
                }
            }
        }

        private _updateScrHelp(visible: boolean): void {
            if (!visible) {
                this._scrHelp.visible = false;
            } else {
                this._scrHelp.visible = true;
                this._labelHelp.setRichText(Lang.getText(Lang.Type.R0004));
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelCommanderInfo.text   = Lang.getText(Lang.Type.B0240);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForCoRenderer = {
        configVersion   : string;
        player          : BaseWar.BwPlayer;
        index           : number;
        panel           : BwCoListPanel;
    }

    class CoNameRenderer extends GameUi.UiListItemRenderer<DataForCoRenderer> {
        private _btnChoose: GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose, callback: this._onTouchTapBtnChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data          = this.data;
            const player        = data.player;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;

            if (!player) {
                this._labelName.text    = Lang.getText(Lang.Type.B0143);
            } else {
                const coId              = player.getCoId();
                const cfg               = coId != null ? Utility.ConfigManager.getCoBasicCfg(data.configVersion, coId) : null;
                this._labelName.text    = cfg
                    ? `${cfg.name}`
                    : `(${Lang.getText(Lang.Type.B0001)}CO)`;
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForSkillRenderer = {
        index   : number;
        skillId : number;
    }

    class SkillRenderer extends GameUi.UiListItemRenderer<DataForSkillRenderer> {
        private _labelIndex : GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;

        protected _onDataChanged(): void {
            const data              = this.data;
            this._labelIndex.text   = `${data.index}.`;
            this._labelDesc.text    = Utility.ConfigManager.getCoSkillCfg(Utility.ConfigManager.getLatestFormalVersion(), data.skillId).desc[Lang.getCurrentLanguageType()];
        }
    }
}