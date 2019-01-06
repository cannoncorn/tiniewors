
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import IdConverter      = Utility.IdConverter;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import SerializedMcUnit = Types.SerializedMcUnit;
    import UnitState        = Types.UnitState;
    import ArmorType        = Types.ArmorType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import MoveType         = Types.MoveType;

    export class McUnitModel {
        private _isInitialized: boolean = false;

        private _configVersion      : number;
        private _templateCfg        : Types.UnitTemplateCfg;
        private _damageChartCfg     : { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } };
        private _buildableTileCfg   : { [srcTileType: number]: Types.BuildableTileCfg };
        private _visionBonusCfg     : { [tileType: number]: Types.VisionBonusCfg };
        private _gridX              : number;
        private _gridY              : number;
        private _viewId             : number;
        private _unitId             : number;
        private _unitType           : UnitType;
        private _playerIndex        : number;

        private _state           : UnitState;
        private _currentHp       : number;
        private _currentFuel     : number;
        private _currentPromotion: number;

        private _currentBuildMaterial    : number    | undefined;
        private _currentProduceMaterial  : number    | undefined;
        private _flareCurrentAmmo        : number    | undefined;
        private _isBuildingTile          : boolean   | undefined;
        private _isCapturingTile         : boolean   | undefined;
        private _isDiving                : boolean   | undefined;
        private _loadedUnitIds           : number[]  | undefined;
        private _primaryWeaponCurrentAmmo: number    | undefined;

        public constructor(data?: SerializedMcUnit, configVersion?: number) {
            if ((data) && (configVersion != null)) {
                this.init(data, configVersion);
            }
        }

        public init(data: SerializedMcUnit, configVersion: number): void {
            const t = IdConverter.getUnitTypeAndPlayerIndex(data.viewId);
            Logger.assert(t, "UnitModel.deserialize() invalid SerializedUnit! ", data);

            this._isInitialized     = true;
            this._configVersion     = configVersion;
            this._gridX             = data.gridX;
            this._gridY             = data.gridY;
            this._viewId            = data.viewId;
            this._unitId            = data.unitId;
            this._unitType          = t!.unitType;
            this._playerIndex       = t!.playerIndex;
            this._templateCfg       = ConfigManager.getUnitTemplateCfg(this._configVersion, this._unitType);
            this._damageChartCfg    = ConfigManager.getDamageChartCfgs(this._configVersion, this._unitType);
            this._buildableTileCfg  = ConfigManager.getBuildableTileCfgs(this._configVersion, this._unitType);
            this._visionBonusCfg    = ConfigManager.getVisionBonusCfg(this._configVersion, this._unitType);
            this.setState(                   data.state                    != null ? data.state                    : UnitState.Idle);
            this.setCurrentHp(               data.currentHp                != null ? data.currentHp                : this.getMaxHp());
            this.setPrimaryWeaponCurrentAmmo(data.primaryWeaponCurrentAmmo != null ? data.primaryWeaponCurrentAmmo : this.getPrimaryWeaponMaxAmmo());
            this.setIsCapturingTile(         data.isCapturingTile          != null ? data.isCapturingTile          : false);
            this.setIsDiving(                data.isDiving                 != null ? data.isDiving                 : false);
            this.setCurrentFuel(             data.currentFuel              != null ? data.currentFuel              : this.getMaxFuel());
            this.setFlareCurrentAmmo(        data.flareCurrentAmmo         != null ? data.flareCurrentAmmo         : this.getFlareMaxAmmo());
            this.setCurrentProduceMaterial(  data.currentProduceMaterial   != null ? data.currentProduceMaterial   : this.getMaxProduceMaterial());
            this.setCurrentPromotion(        data.currentPromotion         != null ? data.currentPromotion         : 0);
            this.setIsBuildingTile(          data.isBuildingTile           != null ? data.isBuildingTile           : false);
            this.setCurrentBuildMaterial(    data.currentBuildMaterial     != null ? data.currentBuildMaterial     : this.getMaxBuildMaterial());
            this._setLoadUnitIds(            data.loadedUnitIds            != null ? data.loadedUnitIds            : undefined);
        }

        public serialize(): SerializedMcUnit {
            Logger.assert(this._isInitialized, "UnitModel.serialize() the tile hasn't been initialized!");

            const data: SerializedMcUnit = {
                gridX   : this._gridX,
                gridY   : this._gridY,
                viewId  : this._viewId,
                unitId  : this._unitId,
            };

            const state = this.getState();
            (state !== UnitState.Idle) && (data.state = state);

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            (currentAmmo !== this.getPrimaryWeaponMaxAmmo()) && (data.primaryWeaponCurrentAmmo = currentAmmo);

            const isCapturing = this.getIsCapturingTile();
            (isCapturing) && (data.isCapturingTile = isCapturing);

            const isDiving = this.getIsDiving();
            (isDiving) && (data.isDiving = isDiving);

            const currentFuel = this.getCurrentFuel();
            (currentFuel !== this.getMaxFuel()) && (data.currentFuel = currentFuel);

            const flareAmmo = this.getFlareCurrentAmmo();
            (flareAmmo !== this.getFlareMaxAmmo()) && (data.flareCurrentAmmo = flareAmmo);

            const produceMaterial = this.getCurrentProduceMaterial();
            (produceMaterial !== this.getMaxProduceMaterial()) && (data.currentProduceMaterial = produceMaterial);

            const currentPromotion = this.getCurrentPromotion();
            (currentPromotion !== 0) && (data.currentPromotion = currentPromotion);

            const isBuildingTile = this.getIsBuildingTile();
            (isBuildingTile) && (data.isBuildingTile = isBuildingTile);

            const buildMaterial = this.getCurrentBuildMaterial();
            (buildMaterial !== this.getMaxBuildMaterial()) && (data.currentBuildMaterial = buildMaterial);

            const loadedUnitIds = this.getLoadedUnitIds();
            (loadedUnitIds) && (loadedUnitIds.length > 0) && (data.loadedUnitIds = loadedUnitIds);

            return data;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getViewId(): number {
            return this._viewId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////
        public getState(): UnitState {
            return this._state;
        }

        public setState(state: UnitState): void {
            this._state = state;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this._templateCfg.maxHp;
        }

        public getNormalizedCurrentHp(): number {
            return Helpers.getNormalizedHp(this.getCurrentHp());
        }
        public getCurrentHp(): number {
            return this._currentHp;
        }
        public setCurrentHp(hp: number): void {
            Logger.assert((hp >= 0) && (hp <= this.getMaxHp()), "UnitModel.setCurrentHp() error, hp: ", hp);
            this._currentHp = hp;
        }

        public getArmorType(): ArmorType {
            return this._templateCfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._templateCfg.isAffectedByLuck === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkHasPrimaryWeapon(): boolean {
            return this._templateCfg.primaryWeaponMaxAmmo != null;
        }

        public getPrimaryWeaponMaxAmmo(): number | undefined {
            return this._templateCfg.primaryWeaponMaxAmmo;
        }

        public getPrimaryWeaponCurrentAmmo(): number | undefined{
            return this._primaryWeaponCurrentAmmo;
        }
        public setPrimaryWeaponCurrentAmmo(ammo: number | undefined): void {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                Logger.assert(ammo == null, "UnitModel.setPrimaryWeaponCurrentAmmo() error, ammo: ", ammo);
            } else {
                Logger.assert((ammo != null) && (ammo >= 0) && (ammo <= maxAmmo), "UnitModel.setPrimaryWeaponCurrentAmmo() error, ammo: ", ammo);
            }

            this._primaryWeaponCurrentAmmo = ammo;
        }

        public checkIsPrimaryWeaponAmmoInShort(): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            return maxAmmo != null ? this.getPrimaryWeaponCurrentAmmo()! <= maxAmmo * 0.4 : false;
        }

        public getPrimaryWeaponDamage(armorType: ArmorType): number | undefined | null {
            return this._damageChartCfg[armorType][Types.WeaponType.Primary].damage;
        }

        public checkHasSecondaryWeapon(): boolean {
            return ConfigManager.checkHasSecondaryWeapon(this._configVersion, this._unitType);
        }

        public getSecondaryWeaponDamage(armorType: ArmorType): number | undefined | null {
            return this._damageChartCfg[armorType][Types.WeaponType.Secondary].damage;
        }

        public getDamage(armorType: ArmorType): number | undefined {
            return this.getPrimaryWeaponDamage(armorType) || this.getSecondaryWeaponDamage(armorType);
        }

        public getMinAttackRange(): number | undefined {
            return this._templateCfg.minAttackRange;
        }
        public getMaxAttackRange(): number | undefined {
            return this._templateCfg.maxAttackRange;
        }

        public checkCanAttackAfterMove(): boolean {
            return this._templateCfg.canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this._templateCfg.canAttackDivingUnits === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsCapturingTile(): boolean {
            return this._isCapturingTile || false;
        }
        public setIsCapturingTile(isCapturing: boolean): void {
            if (!this.checkCanCaptureTile()) {
                Logger.assert(!isCapturing, "UnitModel.setIsCapturingTile() error, isCapturing: ", isCapturing);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkCanCaptureTile(): boolean {
            return this._templateCfg.canCaptureTile === 1;
        }

        public getCaptureAmount(): number | undefined {
            return this.checkCanCaptureTile() ? this.getNormalizedCurrentHp() : undefined;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for dive.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsDiving(): boolean {
            return this._isDiving || false;
        }
        public setIsDiving(isDiving: boolean): void {
            if (!this.checkCanDive()) {
                Logger.assert(!isDiving, "UnitModel.setIsDiving() error, isDiving: ", isDiving);
            }
            this._isDiving = isDiving;
        }

        public checkCanDive(): boolean {
            return this._templateCfg.fuelConsumptionInDiving != null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fuel.
        ////////////////////////////////////////////////////////////////////////////////
        public getCurrentFuel(): number {
            return this._currentFuel;
        }
        public setCurrentFuel(fuel: number): void {
            Logger.assert((fuel >= 0) && (fuel <= this.getMaxFuel()), "UnitModel.setCurrentFuel() error, fuel: ", fuel);
            this._currentFuel = fuel;
        }

        public getMaxFuel(): number {
            return this._templateCfg.maxFuel;
        }

        public getFuelConsumptionPerTurn(): number {
            return this.getIsDiving() ? this._templateCfg.fuelConsumptionInDiving! : this._templateCfg.fuelConsumptionPerTurn;
        }

        public checkIsDestroyedOnOutOfFuel(): boolean {
            return this._templateCfg.isDestroyedOnOutOfFuel === 1;
        }

        public checkIsFuelInShort(): boolean {
            return this.getCurrentFuel() <= this.getMaxFuel() * 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for flare.
        ////////////////////////////////////////////////////////////////////////////////
        public getFlareRadius(): number | undefined {
            return this._templateCfg.flareRadius;
        }

        public getFlareMaxRange(): number | undefined {
            return this._templateCfg.flareMaxRange;
        }

        public getFlareMaxAmmo(): number | undefined {
            return this._templateCfg.flareMaxAmmo;
        }

        public getFlareCurrentAmmo(): number | undefined {
            return this._flareCurrentAmmo;
        }
        public setFlareCurrentAmmo(ammo: number | undefined): void {
            const maxAmmo = this.getFlareMaxAmmo();
            if (maxAmmo == null) {
                Logger.assert(ammo == null, "UnitModel.setFlareCurrentAmmo() error, ammo: ", ammo);
            } else {
                Logger.assert((ammo != null) && (ammo >= 0) && (ammo <= maxAmmo), "UnitModel.setFlareCurrentAmmo() error, ammo:", ammo);
            }

            this._flareCurrentAmmo = ammo;
        }

        public checkIsFlareAmmoInShort(): boolean {
            const maxAmmo = this.getFlareMaxAmmo();
            return maxAmmo != null ? this.getFlareCurrentAmmo()! <= maxAmmo * 0.4 : false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        public getGridX(): number {
            return this._gridX;
        }
        public setGridX(x: number): void {
            this._gridX = x;
        }

        public getGridY(): number {
            return this._gridY;
        }
        public setGridY(y: number): void {
            this._gridY = y;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitType(): UnitType | undefined {
            return this._templateCfg.produceUnitType;
        }

        public getMaxProduceMaterial(): number | undefined {
            return this._templateCfg.maxProduceMaterial;
        }

        public getCurrentProduceMaterial(): number | undefined {
            return this._currentProduceMaterial;
        }
        public setCurrentProduceMaterial(material: number | undefined): void {
            const maxMaterial = this.getMaxProduceMaterial();
            if (maxMaterial == null) {
                Logger.assert(material == null, "UnitModel.setCurrentProduceMaterial() error, material: ", matchMedia);
            } else {
                Logger.assert((material != null) && (material >= 0) && (material <= maxMaterial), "UnitModel.setCurrentProduceMaterial() error, material: ", matchMedia);
            }

            this._currentProduceMaterial = material;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move.
        ////////////////////////////////////////////////////////////////////////////////
        public getMoveRange(): number {
            return this._templateCfg.moveRange;
        }

        public getMoveType(): MoveType {
            return this._templateCfg.moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionCost(): number {
            return this._templateCfg.productionCost;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return ConfigManager.getUnitMaxPromotion(this._configVersion);
        }

        public getCurrentPromotion(): number {
            return this._currentPromotion;
        }
        public setCurrentPromotion(promotion: number): void {
            Logger.assert((promotion >= 0) && (promotion <= this.getMaxPromotion()), "UnitModel.setCurrentPromotion() error, promotion: ", promotion);
            this._currentPromotion = promotion;
        }

        public getPromotionAttackBonus(): number {
            return ConfigManager.getUnitPromotionAttackBonus(this._configVersion, this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return ConfigManager.getUnitPromotionDefenseBonus(this._configVersion, this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSilo(): boolean {
            return this._templateCfg.canLaunchSilo === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build tile.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsBuildingTile(): boolean {
            return this._isBuildingTile || false;
        }
        public setIsBuildingTile(isBuilding: boolean): void {
            if (!this.checkCanBuildTile()) {
                Logger.assert(!isBuilding, "UnitModel.setIsBuildingTile() error, isBuilding: ", isBuilding);
            }
            this._isBuildingTile = isBuilding;
        }

        public checkCanBuildTile(): boolean {
            return this._buildableTileCfg != null;
        }

        public getBuildTargetTile(srcType: TileType): TileType | undefined | null {
            const cfgs  = this._buildableTileCfg;
            const cfg   = cfgs ? cfgs[srcType] : undefined;
            return cfg ? cfg.dstTileType : undefined;
        }

        public getBuildAmount(): number | undefined {
            return this.checkCanBuildTile() ? this.getNormalizedCurrentHp() : undefined;
        }

        public getMaxBuildMaterial(): number | undefined {
            return this._templateCfg.maxBuildMaterial;
        }

        public getCurrentBuildMaterial(): number | undefined {
            return this._currentBuildMaterial;
        }
        public setCurrentBuildMaterial(material: number | undefined): void {
            const maxMaterial = this.getMaxBuildMaterial();
            if (maxMaterial == null) {
                Logger.assert(material == null, "UnitModel.setCurrentBuildMaterial() error, material: ", material);
            } else {
                Logger.assert((material != null) && (material >= 0) && (material <= maxMaterial), "UnitModel.setCurrentBuildMaterial() error, material: ", material);
            }

            this._currentBuildMaterial = material;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxLoadUnitsCount(): number | undefined {
            return this._templateCfg.maxLoadUnitsCount;
        }

        public getLoadedUnitsCount(): number | undefined {
            return this._loadedUnitIds ? this._loadedUnitIds.length : undefined;
        }

        public getLoadedUnitIds(): number[] | undefined {
            return this._loadedUnitIds;
        }

        public checkHasLoadUnitId(id: number): boolean {
            const ids = this._loadedUnitIds;
            return ids ? ids.indexOf(id) >= 0 : false;
        }

        public checkCanDropLoadedUnit(): boolean {
            return this._templateCfg.canDropLoadedUnits === 1;
        }

        public checkCanLaunchLoadedUnit(): boolean {
            return this._templateCfg.canLaunchLoadedUnits === 1;
        }

        public checkCanSupplyLoadedUnit(): boolean {
            return this._templateCfg.canSupplyLoadedUnits === 1;
        }

        public getRepairAmountForLoadedUnit(): number | undefined {
            return this._templateCfg.repairAmountForLoadedUnits;
        }

        public addLoadUnitId(id: number): void {
            const loadedCount = this.getLoadedUnitsCount();
            const maxCount    = this.getMaxLoadUnitsCount();
            Logger.assert(
                (loadedCount != null) && (maxCount != null) && (loadedCount < maxCount) && (!this.checkHasLoadUnitId(id)),
                "UnitModel.addLoadUnitId() error, id: ", id
            );

            this._loadedUnitIds!.push(id);
        }
        public removeLoadUnitId(id: number): void {
            Logger.assert(this.checkHasLoadUnitId(id), "UnitModel.removeLoadUnitId() error, id: ", id);

            const ids = this._loadedUnitIds!;
            ids.splice(ids.indexOf(id), 1);
        }
        private _setLoadUnitIds(ids: number[] | undefined): void {
            const maxCount = this.getMaxLoadUnitsCount();
            if (maxCount == null) {
                Logger.assert(ids == null, "UnitModel._setLoadUnitIds() error, ids: ", ids);
            } else {
                Logger.assert((ids != null) && (ids.length <= maxCount), "UnitModel._setLoadUnitIds() error, ids: ", ids);
            }

            this._loadedUnitIds = ids;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanSupplyAdjacentUnit(): boolean {
            return this._templateCfg.canSupplyAdjacentUnits === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getVisionRange(): number {
            return this._templateCfg.visionRange;
        }

        public getVisionRangeOnTile(tileType: TileType): number {
            const cfgs  = this._visionBonusCfg;
            const cfg   = cfgs ? cfgs[tileType] : undefined;
            return this.getVisionRange() + (cfg ? cfg.visionBonus || 0 : 0);
        }
    }
}
