
// import TwnsBwPlayer     from "../../baseWar/model/BwPlayer";
// import TwnsBwUnit       from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap    from "../../baseWar/model/BwUnitMap";
// import TwnsBwWar        from "../../baseWar/model/BwWar";
// import CommonConstants  from "../helpers/CommonConstants";
// import ConfigManager    from "../helpers/ConfigManager";
// import GridIndexHelpers from "../helpers/GridIndexHelpers";
// import Helpers          from "../helpers/Helpers";
// import Types            from "../helpers/Types";
// import ProtoTypes       from "../proto/ProtoTypes";
// import WarCommonHelpers from "./WarCommonHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarCoSkillHelpers {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwPlayer             = TwnsBwPlayer.BwPlayer;
    import GridIndex            = Types.GridIndex;
    import Structure            = ProtoTypes.Structure;
    import IDataForUseCoSkill   = Structure.IDataForUseCoSkill;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;
    import BwWar                = TwnsBwWar.BwWar;
    import ICoSkillCfg          = ProtoTypes.Config.ICoSkillCfg;

    type DamageMaps = {
        hpMap               : number[][];
        fundMap             : number[][];
        unitCountMap        : number[][];
        capturerValueMap    : number[][];
    };
    type ValueMaps = {
        hpMap       : number[][];
        fundMap     : number[][];
        capturerMap : boolean[][];
        sameTeamMap : boolean[][];
    };

    export function exeInstantSkill({ war, player, skillId, skillData, hasExtraData, isFastExecute }: {
        war             : BwWar;
        player          : BwPlayer;
        skillId         : number;
        skillData       : IDataForUseCoSkill;
        hasExtraData    : boolean;
        isFastExecute   : boolean;
    }): void {
        const configVersion     = war.getConfigVersion();
        const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skillId);
        const coGridIndexList   = player.getCoGridIndexListOnMap();
        const unitMap           = war.getUnitMap();

        if (hasExtraData) {
            exeSelfFundWithExtraData({ isFastExecute });
            exeEnemyEnergyWithExtraData({ isFastExecute });
            exeSelfAddUnitWithExtraData({ isFastExecute });
            exeSelfHpGainWithExtraData({ isFastExecute });
            exeEnemyHpGainWithExtraData({ isFastExecute });
            exeSelfFuelGainWithExtraData({ isFastExecute });
            exeEnemyFuelGainWithExtraData({ isFastExecute });
            exeSelfMaterialGainWithExtraData({ isFastExecute });
            exeEnemyMaterialGainWithExtraData({ isFastExecute });
            exeSelfPrimaryAmmoGainWithExtraData({ isFastExecute });
            exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute });
            exeFixedAreaDamageWithExtraData({ war, skillCfg, unitMap, skillData, isFastExecute });
            exeSelfPromotionGainWithExtraData({ isFastExecute });
            exeSelfUnitActionStateWithExtraData({ isFastExecute });
            exeSelfFlareAmmoGainWithExtraData({ isFastExecute });
            exeChangeWeatherWithExtraData({ skillCfg, war, player, skillData, isFastExecute });
        } else {
            exeSelfFundWithoutExtraData({ skillCfg, player, isFastExecute });
            exeEnemyEnergyWithoutExtraData({ skillCfg, player, war, isFastExecute });
            exeSelfAddUnitWithoutExtraData({ skillCfg, player, war, coGridIndexList, isFastExecute });
            exeSelfHpGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeEnemyHpGainWithoutExtraData({ configVersion, skillCfg, war, player, coGridIndexList, isFastExecute });
            exeSelfFuelGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeEnemyFuelGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeSelfMaterialGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeEnemyMaterialGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeSelfPrimaryAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeEnemyPrimaryAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeFixedAreaDamageWithoutExtraData({ war, skillCfg, unitMap, player, skillData, isFastExecute });
            exeSelfPromotionGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeSelfUnitActionStateWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeSelfFlareAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute });
            exeChangeWeatherWithoutExtraData({ skillCfg, war, player, skillData, isFastExecute });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfFundWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfFundWithoutExtraData({ skillCfg, player, isFastExecute }: {
        skillCfg        : ICoSkillCfg;
        player          : BwPlayer;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfFund;
        if (cfg == null) {
            return;
        }

        const currFund = player.getFund();
        player.setFund(Math.floor(currFund * cfg[0] / 100 + cfg[1]));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyEnergyWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyEnergyWithoutExtraData({ skillCfg, player, war, isFastExecute }: {
        skillCfg        : ICoSkillCfg;
        player          : BwPlayer;
        war             : BwWar;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.enemyEnergy;
        if (cfg == null) {
            return;
        }

        const selfFund      = player.getFund();
        const selfTeamIndex = player.getTeamIndex();
        const modifier      = cfg[0] * selfFund / 10000 + cfg[1];
        for (const p of war.getPlayerManager().getAllPlayers()) {
            const teamIndex = p.getTeamIndex();
            if ((teamIndex === selfTeamIndex) || (teamIndex === CommonConstants.WarNeutralTeamIndex)) {
                continue;
            }

            const currentEnergy = p.getCoCurrentEnergy();
            const maxEnergy     = p.getCoMaxEnergy();
            p.setCoCurrentEnergy(Math.max(
                0,
                Math.min(
                    maxEnergy,
                    Math.floor(currentEnergy + currentEnergy * modifier / 100),
                ),
            ));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfAddUnitWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfAddUnitWithoutExtraData({ skillCfg, player, war, coGridIndexList, isFastExecute }: {
        skillCfg        : Types.CoSkillCfg;
        player          : BwPlayer;
        war             : BwWar;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfAddUnit;
        if (cfg == null) {
            return;
        }

        const selfPlayerIndex = player.getPlayerIndex();
        if ((selfPlayerIndex == null) || (selfPlayerIndex === CommonConstants.WarNeutralPlayerIndex)) {
            throw Helpers.newError(`Invalid selfPlayerIndex: ${selfPlayerIndex}.`, ClientErrorCode.WarCoSkillHelpers_ExeSelfAddUnit_00);
        }

        const configVersion = war.getConfigVersion();
        const coZoneRadius  = player.getCoZoneRadius();
        const unitMap       = war.getUnitMap();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getPlayerIndex() !== selfPlayerIndex) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex)) {
                continue;
            }

            const tileType = tile.getType();
            if ((!ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, cfg[1]))                                 ||
                (!WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                    gridIndex,
                    coSkillAreaType         : cfg[0],
                    getCoGridIndexArrayOnMap: () => coGridIndexList,
                    coZoneRadius,
                }))
            ) {
                continue;
            }

            // cfg:????????????????????????????????????????????????hp????????????0=????????????1=???????????????
            const unitId = unitMap.getNextUnitId();
            const unit = new TwnsBwUnit.BwUnit();
            unit.init({
                gridIndex,
                unitId,
                playerIndex     : selfPlayerIndex,
                unitType        : cfg[2],
                currentHp       : cfg[3],
                actionState     : cfg[4],
            }, configVersion);

            unit.startRunning(war);
            unitMap.setNextUnitId(unitId + 1);
            unitMap.setUnitOnMap(unit);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfHpGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfHpGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfHpGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2] * CommonConstants.UnitHpNormalizer;
            for (const unit of unitMap.getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                const maxHp     = unit.getMaxHp();
                const currentHp = unit.getCurrentHp();
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyHpGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeEnemyHpGainWithoutExtraData({ configVersion, skillCfg, war, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        war             : BwWar;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.enemyHpGain;
        if (cfg) {
            const teamIndex     = player.getTeamIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const tileMap       = war.getTileMap();
            const unitCategory  = cfg[1];
            const tileCategory  = cfg[2];
            const modifier      = cfg[3] * CommonConstants.UnitHpNormalizer;
            for (const unit of war.getUnitMap().getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                const maxHp     = unit.getMaxHp();
                const currentHp = unit.getCurrentHp();
                const tileType  = tileMap.getTile(gridIndex)?.getType();
                if ((unit.getTeamIndex() !== teamIndex)                                                 &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, unitCategory))    &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory))    &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    unit.setCurrentHp(Math.max(
                        1,
                        Math.min(
                            maxHp,
                            currentHp + modifier
                        ),
                    ));
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfFuelGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfFuelGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfFuelGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    const maxFuel       = unit.getMaxFuel();
                    const currentFuel   = unit.getCurrentFuel();
                    if (modifier > 0) {
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            currentFuel + Math.floor(maxFuel * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(currentFuel * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyFuelGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeEnemyFuelGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.enemyFuelGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius
                    }))
                ) {
                    const maxFuel       = unit.getMaxFuel();
                    const currentFuel   = unit.getCurrentFuel();
                    if (modifier > 0) {
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            currentFuel + Math.floor(maxFuel * modifier / 100)
                        ));
                    } else {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(currentFuel * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfMaterialGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfMaterialGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfMaterialGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    continue;
                }

                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = Helpers.getExisted(unit.getCurrentBuildMaterial());
                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                            ));
                        }
                        (!isFastExecute) && (unit.updateView());
                    }

                    if (maxProduceMaterial != null) {
                        const currentProduceMaterial = Helpers.getExisted(unit.getCurrentProduceMaterial());
                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                currentProduceMaterial + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(currentProduceMaterial * (100 + modifier) / 100)
                            ));
                        }
                        (!isFastExecute) && (unit.updateView());
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyMaterialGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeEnemyMaterialGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.enemyMaterialGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxBuildMaterial      = unit.getMaxBuildMaterial();
                const maxProduceMaterial    = unit.getMaxProduceMaterial();
                if ((maxBuildMaterial == null) && (maxProduceMaterial == null)) {
                    continue;
                }

                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    if (maxBuildMaterial != null) {
                        const currentBuildMaterial = Helpers.getExisted(unit.getCurrentBuildMaterial());
                        if (modifier > 0) {
                            unit.setCurrentBuildMaterial(Math.min(
                                maxBuildMaterial,
                                currentBuildMaterial + Math.floor(maxBuildMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentBuildMaterial(Math.max(
                                0,
                                Math.floor(currentBuildMaterial * (100 + modifier) / 100)
                            ));
                        }
                        (!isFastExecute) && (unit.updateView());
                    }

                    if (maxProduceMaterial != null) {
                        const currentProduceMaterial = Helpers.getExisted(unit.getCurrentProduceMaterial());
                        if (modifier > 0) {
                            unit.setCurrentProduceMaterial(Math.min(
                                maxProduceMaterial,
                                currentProduceMaterial + Math.floor(maxProduceMaterial * modifier / 100)
                            ));
                        } else {
                            unit.setCurrentProduceMaterial(Math.max(
                                0,
                                Math.floor(currentProduceMaterial * (100 + modifier) / 100)
                            ));
                        }
                        (!isFastExecute) && (unit.updateView());
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfPrimaryAmmoGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfPrimaryAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfPrimaryAmmoGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    continue;
                }

                const unitType      = unit.getUnitType();
                const gridIndex     = unit.getGridIndex();
                const currentAmmo   = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo());
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    if (modifier > 0) {
                        unit.setPrimaryWeaponCurrentAmmo(Math.min(
                            maxAmmo,
                            currentAmmo + Math.floor(maxAmmo * modifier / 100)
                        ));
                    } else {
                        unit.setPrimaryWeaponCurrentAmmo(Math.max(
                            0,
                            Math.floor(currentAmmo * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeEnemyPrimaryAmmoGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeEnemyPrimaryAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.enemyPrimaryAmmoGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo == null) {
                    continue;
                }

                const unitType      = unit.getUnitType();
                const gridIndex     = unit.getGridIndex();
                const currentAmmo   = Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo());
                if ((unit.getPlayerIndex() !== playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    if (modifier > 0) {
                        unit.setPrimaryWeaponCurrentAmmo(Math.min(
                            maxAmmo,
                            currentAmmo + Math.floor(maxAmmo * modifier / 100)
                        ));
                    } else {
                        unit.setPrimaryWeaponCurrentAmmo(Math.max(
                            0,
                            Math.floor(currentAmmo * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    function exeFixedAreaDamageWithExtraData({ war, skillCfg, unitMap, skillData, isFastExecute }: {
        war             : BwWar;
        skillCfg        : ICoSkillCfg;
        unitMap         : BwUnitMap;
        skillData       : IDataForUseCoSkill;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.fixedAreaDamage;
        if (cfg == null) {
            return;
        }

        if (isFastExecute) {
            return;
        }

        const center            = Helpers.getExisted(skillData.fixedAreaDamageCenter);
        const gridVisualEffect  = war.getGridVisualEffect();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: center as GridIndex, minDistance: 0, maxDistance: cfg[1], mapSize: unitMap.getMapSize() })) {
            gridVisualEffect.showEffectExplosion(gridIndex);
        }
    }
    function exeFixedAreaDamageWithoutExtraData({ war, skillCfg, unitMap, player, skillData, isFastExecute }: {
        war             : BwWar;
        skillCfg        : ICoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        skillData       : IDataForUseCoSkill;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.fixedAreaDamage;
        if (cfg == null) {
            return;
        }

        const center            = Helpers.getExisted(skillData.fixedAreaDamageCenter);
        const mapSize           = unitMap.getMapSize();
        const hpDamage          = cfg[2] * CommonConstants.UnitHpNormalizer;
        const isIndiscriminate  = !!cfg[3];
        const actionState       = cfg[4];
        const teamIndex         = player.getTeamIndex();
        const gridVisualEffect  = war.getGridVisualEffect();
        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: center as GridIndex, minDistance: 0, maxDistance: cfg[1], mapSize })) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit)                                                      &&
                ((isIndiscriminate) || (unit.getTeamIndex() !== teamIndex))
            ) {
                unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - hpDamage));
                if (actionState !== -1) {
                    unit.setActionState(actionState);
                }

                (!isFastExecute) && (unit.updateView());
            }

            if (!isFastExecute) {
                gridVisualEffect.showEffectExplosion(gridIndex);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfPromotionGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfPromotionGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfPromotionGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const maxPromotion  = ConfigManager.getUnitMaxPromotion(configVersion);
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius
                    }))
                ) {
                    const currentPromotion = Helpers.getExisted(unit.getCurrentPromotion());
                    unit.setCurrentPromotion(Math.max(
                        0,
                        Math.min(
                            maxPromotion,
                            currentPromotion + modifier
                        ),
                    ));
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfUnitActionStateWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfUnitActionStateWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfUnitActionState;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const actionState   : Types.UnitActionState = cfg[2];
            if ((actionState !== Types.UnitActionState.Acted) && (actionState !== Types.UnitActionState.Idle)) {
                throw Helpers.newError(`Invalid actionState: ${actionState}`, ClientErrorCode.WarCoSkillHelpers_ExeSelfUnitActionState_00);
            }

            for (const unit of unitMap.getAllUnits()) {
                const unitType  = unit.getUnitType();
                const gridIndex = unit.getGridIndex();
                if ((unit.getPlayerIndex() === playerIndex)                                                     &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))                &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius
                    }))
                ) {
                    unit.setActionState(actionState);
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeSelfFlareAmmoGainWithExtraData({ isFastExecute }: {
        isFastExecute   : boolean;
    }): void {
        // nothing to do
    }
    function exeSelfFlareAmmoGainWithoutExtraData({ configVersion, skillCfg, unitMap, player, coGridIndexList, isFastExecute }: {
        configVersion   : string;
        skillCfg        : Types.CoSkillCfg;
        unitMap         : BwUnitMap;
        player          : BwPlayer;
        coGridIndexList : GridIndex[];
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.selfFlareAmmoGain;
        if (cfg) {
            const playerIndex   = player.getPlayerIndex();
            const zoneRadius    = player.getCoZoneRadius();
            const category      = cfg[1];
            const modifier      = cfg[2];
            for (const unit of unitMap.getAllUnits()) {
                const maxAmmo = unit.getFlareMaxAmmo();
                if (maxAmmo == null) {
                    continue;
                }

                const unitType      = unit.getUnitType();
                const gridIndex     = unit.getGridIndex();
                const currentAmmo   = Helpers.getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.WarCoSkillHelpers_ExeSelfFlareAmmoGain_00);
                if ((unit.getPlayerIndex() === playerIndex)                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category))    &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => coGridIndexList,
                        coZoneRadius            : zoneRadius,
                    }))
                ) {
                    if (modifier > 0) {
                        unit.setFlareCurrentAmmo(Math.min(
                            maxAmmo,
                            currentAmmo + Math.floor(maxAmmo * modifier / 100)
                        ));
                    } else {
                        unit.setFlareCurrentAmmo(Math.max(
                            0,
                            Math.floor(currentAmmo * (100 + modifier) / 100)
                        ));
                    }
                    (!isFastExecute) && (unit.updateView());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeChangeWeatherWithExtraData({ skillCfg, war, player, skillData, isFastExecute }: {
        skillCfg        : Types.CoSkillCfg;
        war             : BwWar;
        player          : BwPlayer;
        skillData       : IDataForUseCoSkill;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.changeWeather;
        if (cfg) {
            const weatherManager    = war.getWeatherManager();
            const playerIndex       = player.getPlayerIndex();
            const fogMap            = war.getFogMap();
            const hasFog            = fogMap.checkHasFogCurrently();
            weatherManager.setForceWeatherType(Helpers.getExisted(skillData.newWeatherType, ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithExtraData_00));
            weatherManager.setExpirePlayerIndex(playerIndex);
            weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + cfg[0]);
            // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
            if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg[1])) {
                const mapSize           = fogMap.getMapSize();
                const visibilityArray   : Types.Visibility[] = new Array(mapSize.width * mapSize.height);
                visibilityArray.fill(Types.Visibility.TrueVision);
                fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
            }

            if (!isFastExecute) {
                weatherManager.getView().resetView(false);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function exeChangeWeatherWithoutExtraData({ skillCfg, war, player, skillData, isFastExecute }: {
        skillCfg        : Types.CoSkillCfg;
        war             : BwWar;
        player          : BwPlayer;
        skillData       : IDataForUseCoSkill;
        isFastExecute   : boolean;
    }): void {
        const cfg = skillCfg.changeWeather;
        if (cfg) {
            const weatherManager    = war.getWeatherManager();
            const playerIndex       = player.getPlayerIndex();
            const fogMap            = war.getFogMap();
            const hasFog            = fogMap.checkHasFogCurrently();
            weatherManager.setForceWeatherType(Helpers.getExisted(skillData.newWeatherType, ClientErrorCode.WarCoSkillHelpers_ExeChangeWeatherWithoutExtraData_00));
            weatherManager.setExpirePlayerIndex(playerIndex);
            weatherManager.setExpireTurnIndex(war.getTurnManager().getTurnIndex() + cfg[0]);
            // war.getFogMap().resetMapFromPathsForPlayer(playerIndex);
            if ((!hasFog) && (fogMap.checkHasFogCurrently()) && (cfg[1])) {
                const mapSize           = fogMap.getMapSize();
                const visibilityArray   : Types.Visibility[] = new Array(mapSize.width * mapSize.height);
                visibilityArray.fill(Types.Visibility.TrueVision);
                fogMap.resetMapFromPathsForPlayer(playerIndex, visibilityArray);
            }

            if (!isFastExecute) {
                weatherManager.getView().resetView(false);
            }
        }
    }

    export function getDataForUseCoSkill(
        war         : BwWar,
        player      : BwPlayer,
        skillIndex  : number,
    ): IDataForUseCoSkill {
        const configVersion = war.getConfigVersion();
        const skillId       = (player.getCoCurrentSkills() || [])[skillIndex];
        const skillCfg      = ConfigManager.getCoSkillCfg(configVersion, skillId);
        const dataForUseCoSkill: IDataForUseCoSkill = {
            skillIndex,
        };

        {
            const cfg = skillCfg.fixedAreaDamage;
            if (cfg) {
                const unitMap   = war.getUnitMap();
                const teamIndex = player.getTeamIndex();
                const valueMap  = Helpers.getExisted(getValueMap(unitMap, teamIndex));
                const center    = Helpers.getExisted(getFixedAreaDamageCenter(war, valueMap, cfg));
                dataForUseCoSkill.fixedAreaDamageCenter = center;
            }
        }

        {
            const cfg = skillCfg.changeWeather;
            if (cfg) {
                dataForUseCoSkill.newWeatherType = Helpers.pickRandomElement(cfg.slice(2), war.getRandomNumberManager().getRandomNumber());
            }
        }

        return dataForUseCoSkill;
    }

    function getFixedAreaDamageCenter(war: BwWar, valueMaps: ValueMaps, cfg: number[]): GridIndex {
        const targetType        = cfg[0];
        const radius            = cfg[1];
        const hpDamage          = cfg[2];
        const isIndiscriminate  = !!cfg[3];
        if (targetType === 1) { // HP
            return getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate });

        } else if (targetType === 2) {  // fund
            return getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });

        } else if (targetType === 3) {  // random: HP or fund
            return getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate });

        } else if (targetType === 4) {  // HP of inf/mech/bike
            return getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate });

        } else if (targetType === 5) {  // number of units
            return getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate });

        } else {
            throw Helpers.newError(`Invalid targetType: ${targetType}`, ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenter_00);
        }
    }

    function getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
        war                 : BwWar;
        valueMaps           : ValueMaps;
        radius              : number;
        hpDamage            : number;
        isIndiscriminate    : boolean;
    }): GridIndex {
        const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
        const centers   = getCentersOfHighestDamage(damageMap.hpMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return Helpers.getExisted(Helpers.pickRandomElement(centers, war.getRandomNumberManager().getRandomNumber()), ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType1_00);
        }
    }

    function getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
        war                 : BwWar;
        valueMaps           : ValueMaps;
        radius              : number;
        hpDamage            : number;
        isIndiscriminate    : boolean;
    }): GridIndex {
        const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
        const centers   = getCentersOfHighestDamage(damageMap.fundMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return Helpers.getExisted(Helpers.pickRandomElement(centers, war.getRandomNumberManager().getRandomNumber()), ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType2_00);
        }
    }

    function getFixedAreaDamageCenterForType3({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
        war                 : BwWar;
        valueMaps           : ValueMaps;
        radius              : number;
        hpDamage            : number;
        isIndiscriminate    : boolean;
    }): GridIndex {
        return war.getRandomNumberManager().getRandomNumber() < 0.5
            ? getFixedAreaDamageCenterForType1({ war, valueMaps, radius, hpDamage, isIndiscriminate })
            : getFixedAreaDamageCenterForType2({ war, valueMaps, radius, hpDamage, isIndiscriminate });
    }

    function getFixedAreaDamageCenterForType4({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
        war                 : BwWar;
        valueMaps           : ValueMaps;
        radius              : number;
        hpDamage            : number;
        isIndiscriminate    : boolean;
    }): GridIndex {
        const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
        const centers   = getCentersOfHighestDamage(damageMap.capturerValueMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return Helpers.getExisted(Helpers.pickRandomElement(centers, war.getRandomNumberManager().getRandomNumber()), ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType4_00);
        }
    }

    function getFixedAreaDamageCenterForType5({ war, valueMaps, radius, hpDamage, isIndiscriminate }: {
        war                 : BwWar;
        valueMaps           : ValueMaps;
        radius              : number;
        hpDamage            : number;
        isIndiscriminate    : boolean;
    }): GridIndex {
        const damageMap = getDamageMap({ valueMaps, hpDamage, isIndiscriminate });
        const centers   = getCentersOfHighestDamage(damageMap.unitCountMap, radius);
        if (centers.length === 1) {
            return centers[0];
        } else {
            return Helpers.getExisted(Helpers.pickRandomElement(centers, war.getRandomNumberManager().getRandomNumber()), ClientErrorCode.WarCoSkillHelpers_GetFixedAreaDamageCenterForType5_00);
        }
    }

    function getValueMap(unitMap: BwUnitMap, teamIndex: number): ValueMaps {
        const { width, height } = unitMap.getMapSize();
        const hpMap             = Helpers.createEmptyMap(width, height, 0);
        const fundMap           = Helpers.createEmptyMap(width, height, 0);
        const capturerMap       = Helpers.createEmptyMap(width, height, false);
        const sameTeamMap       = Helpers.createEmptyMap(width, height, false);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const unit = unitMap.getUnitOnMap({ x, y });
                if (unit) {
                    hpMap[x][y]         = unit.getNormalizedCurrentHp();
                    fundMap[x][y]       = unit.getProductionFinalCost();
                    capturerMap[x][y]   = unit.checkIsCapturer();
                    sameTeamMap[x][y]   = unit.getTeamIndex() === teamIndex;
                }
            }
        }

        return { hpMap, fundMap, capturerMap, sameTeamMap };
    }

    function getDamageMap({ valueMaps, hpDamage, isIndiscriminate }: {
        valueMaps       : ValueMaps;
        hpDamage        : number;
        isIndiscriminate: boolean;
    }): DamageMaps {
        const srcHpMap          = valueMaps.hpMap;
        const srcFundMap        = valueMaps.fundMap;
        const srcSameTeamMap    = valueMaps.sameTeamMap;
        const srcCapturerMap    = valueMaps.capturerMap;
        const width             = srcHpMap.length;
        const height            = srcHpMap[0].length;

        const hpMap             = Helpers.createEmptyMap(width, height, 0);
        const fundMap           = Helpers.createEmptyMap(width, height, 0);
        const unitCountMap      = Helpers.createEmptyMap(width, height, 0);
        const capturerValueMap  = Helpers.createEmptyMap(width, height, 0);
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                if (srcHpMap[x][y] > 0) {
                    const realHpDamage      = Math.min(hpDamage, srcHpMap[x][y] - 1);
                    const realFundDamage    = Math.floor(srcFundMap[x][y] * realHpDamage / CommonConstants.UnitHpNormalizer);
                    const isSameTeam        = srcSameTeamMap[x][y];
                    if (isIndiscriminate) {
                        hpMap[x][y]             = isSameTeam ? -realHpDamage * 2 : realHpDamage;
                        fundMap[x][y]           = isSameTeam ? -realFundDamage * 2 : realFundDamage;
                        unitCountMap[x][y]      = isSameTeam ? -2 : 1;
                        capturerValueMap[x][y]  = isSameTeam
                            ? (-realHpDamage * 2)
                            : (srcCapturerMap[x][y] ? realHpDamage * 100000 : realHpDamage);
                    } else {
                        hpMap[x][y]             = isSameTeam ? 0 : realHpDamage;
                        fundMap[x][y]           = isSameTeam ? 0 : realFundDamage;
                        unitCountMap[x][y]      = isSameTeam ? 0 : 1;
                        capturerValueMap[x][y]  = isSameTeam
                            ? (0)
                            : (srcCapturerMap[x][y] ? realHpDamage * 100000 : realHpDamage);
                    }
                }
            }
        }
        return { hpMap, fundMap, unitCountMap, capturerValueMap };
    }

    function getCentersOfHighestDamage(map: number[][], radius: number): GridIndex[] {
        const centers   : GridIndex[] = [];
        const width     = map.length;
        const height    = map[0].length;
        const mapSize   = { width, height };

        let maxDamage: number | null = null;
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const center        = { x, y };
                let totalDamage     = 0;
                for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: center, minDistance: 0, maxDistance: radius, mapSize })) {
                    totalDamage += map[gridIndex.x][gridIndex.y];
                }

                if ((maxDamage == null) || (totalDamage > maxDamage)) {
                    maxDamage = totalDamage;
                    centers.length = 0;
                    centers.push(center);
                } else if (maxDamage === totalDamage) {
                    centers.push(center);
                }
            }
        }

        return centers;
    }
}

// export default WarCoSkillHelpers;
