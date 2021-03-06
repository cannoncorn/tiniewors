
// import TwnsBwTile           from "../../baseWar/model/BwTile";
// import TwnsBwTileMap        from "../../baseWar/model/BwTileMap";
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import ConfigManager        from "../helpers/ConfigManager";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarRuleHelpers       from "./WarRuleHelpers";
// import WarVisibilityHelpers from "./WarVisibilityHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarCommonHelpers {
    import GridIndex        = Types.GridIndex;
    import MovableArea      = Types.MovableArea;
    import AttackableArea   = Types.AttackableArea;
    import MapSize          = Types.MapSize;
    import MovePathNode     = Types.MovePathNode;
    import UnitType         = Types.UnitType;
    import TileType         = Types.TileType;
    import WarType          = Types.WarType;
    import Visibility       = Types.Visibility;
    import CoSkillAreaType  = Types.CoSkillAreaType;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import ISerialWar       = WarSerialization.ISerialWar;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    type AvailableMovableGrid = {
        currGridIndex   : GridIndex;
        prevGridIndex   : GridIndex | null;
        totalMoveCost   : number;
    };

    export function createMovableArea({ origin, maxMoveCost, mapSize, moveCostGetter }: {
        origin          : GridIndex;
        maxMoveCost     : number;
        mapSize         : MapSize;
        moveCostGetter  : (g: GridIndex) => number | null;
    }): MovableArea {
        const area              = [] as MovableArea;
        const availableGrids    = [] as AvailableMovableGrid[];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : origin,
            prev            : null,
            totalMoveCost   : 0,
        });

        let index = 0;
        while (index < availableGrids.length) {
            const availableGrid                     = _sortAvailableMovableGrids(availableGrids, index);
            const { currGridIndex, totalMoveCost }  = availableGrid;
            if (_checkAndUpdateMovableArea({ area, gridIndex: currGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
                for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currGridIndex, mapSize)) {
                    const nextMoveCost = moveCostGetter(nextGridIndex);
                    if ((nextMoveCost != null) && (nextMoveCost + totalMoveCost <= maxMoveCost)) {
                        _updateAvailableGrids({ grids: availableGrids, index: index + 1, gridIndex: nextGridIndex, prev: currGridIndex, totalMoveCost: nextMoveCost + totalMoveCost });
                    }
                }
            }

            ++index;
        }

        return area;
    }

    export function createAttackableAreaForUnit({ movableArea, mapSize, minAttackRange, maxAttackRange, checkCanAttack }: {
        movableArea     : MovableArea;
        mapSize         : MapSize;
        minAttackRange  : number | null;
        maxAttackRange  : number | null;
        checkCanAttack  : (destination: GridIndex, target: GridIndex) => boolean;
    }): AttackableArea {
        const area: AttackableArea = [];
        if ((minAttackRange != null) && (maxAttackRange != null)) {
            const { width, height } = mapSize;
            for (let moveX = 0; moveX < width; ++moveX) {
                if (movableArea[moveX]) {
                    for (let moveY = 0; moveY < height; ++moveY) {
                        const movableGrid = movableArea[moveX][moveY];
                        if (movableGrid) {
                            const moveGridIndex = { x: moveX, y: moveY };
                            for (const attackGridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: moveGridIndex, minDistance: minAttackRange, maxDistance: maxAttackRange, mapSize })) {
                                const { x: attackX, y: attackY } = attackGridIndex;
                                if (checkCanAttack(moveGridIndex, attackGridIndex)) {
                                    area[attackX] = area[attackX] || [];
                                    const attackableGrid = area[attackX][attackY];
                                    if ((!attackableGrid)                                                                                                               ||
                                        (movableGrid.totalMoveCost < movableArea[attackableGrid.movePathDestination.x][attackableGrid.movePathDestination.y].totalMoveCost)
                                    ) {
                                        area[attackX][attackY] = {
                                            movePathDestination: { x: moveX, y: moveY },
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return area;
    }
    export function createAttackableAreaForTile(tile: TwnsBwTile.BwTile, mapSize: MapSize): AttackableArea {
        const area          : AttackableArea = [];
        const tileType      = tile.getType();
        const tileGridIndex = tile.getGridIndex();
        const tileGridX     = tileGridIndex.x;
        const tileGridY     = tileGridIndex.y;
        const mapWidth      = mapSize.width;
        const mapHeight     = mapSize.height;
        const addGrid       = (x: number, y: number) => {
            if (GridIndexHelpers.checkIsInsideMap({ x, y }, mapSize)) {
                if (area[x] == null) {
                    area[x] = [];
                }
                area[x][y] = {
                    movePathDestination: { x: tileGridX, y: tileGridY },
                };
            }
        };

        if ((tileType === TileType.Crystal) || (tileType === TileType.CustomCrystal)) {
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: tileGridIndex, minDistance: 0, maxDistance: Helpers.getExisted(tile.getCustomCrystalData()?.radius), mapSize })) {
                addGrid(gridIndex.x, gridIndex.y);
            }

        } else if ((tileType === TileType.CustomCannon) || (tile.checkIsNormalCannon())) {
            const { rangeForDown, rangeForLeft, rangeForRight, rangeForUp } = Helpers.getExisted(tile.getCustomCannonData());
            if (rangeForDown) {
                for (let deltaY = 1; deltaY <= rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 - deltaY; deltaX <= deltaY - 1; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForUp) {
                for (let deltaY = -rangeForUp; deltaY < 0; ++deltaY) {
                    const y = tileGridY + deltaY;
                    if (y >= mapHeight) {
                        break;
                    }
                    for (let deltaX = 1 + deltaY; deltaX <= -1 - deltaY; ++deltaX) {
                        const x = tileGridX + deltaX;
                        if (x >= mapWidth) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForRight) {
                for (let deltaX = 1; deltaX <= rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 - deltaX; deltaY <= deltaX - 1; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }
            if (rangeForLeft) {
                for (let deltaX = -rangeForLeft; deltaX < 0; ++deltaX) {
                    const x = tileGridX + deltaX;
                    if (x >= mapWidth) {
                        break;
                    }
                    for (let deltaY = 1 + deltaX; deltaY <= -1 - deltaX; ++deltaY) {
                        const y = tileGridY + deltaY;
                        if (y >= mapHeight) {
                            break;
                        }
                        addGrid(x, y);
                    }
                }
            }

        } else if ((tileType === TileType.LaserTurret) || (tileType === TileType.CustomLaserTurret)) {
            const { rangeForDown, rangeForLeft, rangeForRight, rangeForUp } = Helpers.getExisted(tile.getCustomLaserTurretData());
            if (rangeForDown) {
                for (let deltaY = 0; deltaY < rangeForDown; ++deltaY) {
                    const y = tileGridY + deltaY + 1;
                    if (y >= mapHeight) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForUp) {
                for (let deltaY = 0; deltaY < rangeForUp; ++deltaY) {
                    const y = tileGridY - deltaY - 1;
                    if (y < 0) {
                        break;
                    }
                    addGrid(tileGridX, y);
                }
            }
            if (rangeForRight) {
                for (let deltaX = 0; deltaX < rangeForRight; ++deltaX) {
                    const x = tileGridX + deltaX + 1;
                    if (x >= mapWidth) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }
            if (rangeForLeft) {
                for (let deltaX = 0; deltaX < rangeForLeft; ++deltaX) {
                    const x = tileGridX - deltaX - 1;
                    if (x < 0) {
                        break;
                    }
                    addGrid(x, tileGridY);
                }
            }

        } else {
            // TODO: handle other tile types
            throw Helpers.newError(`WarCommonHelpers.createAttackableAreaForTile() invalid tileType: ${tileType}`);
        }

        return area;
    }

    export function createShortestMovePath(area: MovableArea, destination: GridIndex): MovePathNode[] {
        const reversedPath  : MovePathNode[] = [];
        let gridIndex       : GridIndex | null = destination;
        let movableNode     = area[gridIndex.x][gridIndex.y];

        for (;;) {
            reversedPath.push({
                x               : gridIndex.x,
                y               : gridIndex.y,
                totalMoveCost   : movableNode.totalMoveCost,
            });

            gridIndex = movableNode.prevGridIndex;
            if (!gridIndex) {
                return reversedPath.reverse();
            }
            movableNode = area[gridIndex.x][gridIndex.y];
        }
    }

    export function getRevisedPath({ war, rawPath, launchUnitId }: {
        war             : TwnsBwWar.BwWar;
        rawPath         : Types.Undefinable<ProtoTypes.Structure.IMovePath>;
        launchUnitId    : Types.Undefinable<number>;
    }): Types.MovePath {
        if (rawPath == null) {
            throw Helpers.newError(`Empty rawPath.`, ClientErrorCode.BwHelpers_GetRevisedPath_00);
        }

        const rawPathNodes = rawPath.nodes;
        if ((rawPathNodes == null) || (!rawPathNodes.length)) {
            throw Helpers.newError(`Empty rawPathNodes.`, ClientErrorCode.BwHelpers_GetRevisedPath_01);
        }

        const beginningGridIndex    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(rawPathNodes[0]), ClientErrorCode.BwHelpers_GetRevisedPath_02);
        const playerInTurn          = war.getPlayerInTurn();
        const unitMap               = war.getUnitMap();
        const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
        if ((!focusUnit)                                                    ||
            (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
            (focusUnit.getActionState() !== Types.UnitActionState.Idle)     ||
            (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main)
        ) {
            throw Helpers.newError(`Invalid focusUnit.`, ClientErrorCode.BwHelpers_GetRevisedPath_03);
        }

        if (launchUnitId != null) {
            const gridIndex = focusUnit.getGridIndex();
            if (!GridIndexHelpers.checkIsEqual(gridIndex, beginningGridIndex)) {
                throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_04);
            }
        }

        const tileMap                   = war.getTileMap();
        const mapSize                   = tileMap.getMapSize();
        const teamIndexInTurn           = playerInTurn.getTeamIndex();
        const maxFuelConsumption        = focusUnit.getFinalMoveRange();
        const revisedNodes              = [GridIndexHelpers.clone(beginningGridIndex)];
        let revisedTotalFuelConsumption = 0;
        let rawTotalFuelConsumption     = 0;
        let isBlocked                   = false;
        for (let i = 1; i < rawPathNodes.length; ++i) {
            const gridIndex = GridIndexHelpers.convertGridIndex(rawPathNodes[i]);
            if ((!gridIndex)                                                                        ||
                (!GridIndexHelpers.checkIsAdjacent(gridIndex, rawPathNodes[i - 1] as GridIndex))    ||
                (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                            ||
                (revisedNodes.some(g => GridIndexHelpers.checkIsEqual(g, gridIndex)))
            ) {
                throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.BwHelpers_GetRevisedPath_05);
            }

            const tile              = tileMap.getTile(gridIndex);
            const fuelConsumption   = Helpers.getExisted(tile.getMoveCostByUnit(focusUnit), ClientErrorCode.BwHelpers_GetRevisedPath_06);
            rawTotalFuelConsumption += fuelConsumption;
            if (rawTotalFuelConsumption > maxFuelConsumption) {
                throw Helpers.newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, ClientErrorCode.BwHelpers_GetRevisedPath_07);
            }

            const existingUnit = unitMap.getUnitOnMap(gridIndex);
            if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
                const unitType          = existingUnit.getUnitType();
                const isDiving          = existingUnit.getIsDiving();
                const unitPlayerIndex   = existingUnit.getPlayerIndex();
                if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex,
                    unitType,
                    isDiving,
                    unitPlayerIndex,
                    observerTeamIndex   : teamIndexInTurn,
                })) {
                    throw Helpers.newError(`There is a blocking visible unit.`, ClientErrorCode.BwHelpers_GetRevisedPath_08);
                } else {
                    isBlocked = true;
                }
            }

            if (!isBlocked) {
                revisedTotalFuelConsumption = rawTotalFuelConsumption;
                revisedNodes.push(GridIndexHelpers.clone(gridIndex));
            }
        }

        return {
            nodes           : revisedNodes,
            isBlocked       : isBlocked,
            fuelConsumption : revisedTotalFuelConsumption,
        };
    }

    export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: TwnsBwWar.BwWar, rawPath: GridIndex[]): boolean {
        if (rawPath.length == 1) {
            return false;
        } else {
            const unitMap       = war.getUnitMap();
            const destination   = rawPath[rawPath.length - 1];
            const unit          = unitMap.getUnitOnMap(destination);
            if (unit == null) {
                return false;
            } else {
                return WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex           : destination,
                    unitType            : unit.getUnitType(),
                    isDiving            : unit.getIsDiving(),
                    unitPlayerIndex     : unit.getPlayerIndex(),
                    observerTeamIndex   : Helpers.getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
                });
            }
        }
    }

    export function createDistanceMap(tileMap: TwnsBwTileMap.BwTileMap, unit: TwnsBwUnit.BwUnit, destination: GridIndex): { distanceMap: (number | null)[][], maxDistance: number } {
        const area          : MovableArea = [];
        const availableGrids: AvailableMovableGrid[] = [];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : destination,
            prev            : null,
            totalMoveCost   : 0,
        });

        const mapSize   = tileMap.getMapSize();
        let index       = 0;
        while (index < availableGrids.length) {
            const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
            const currentGridIndex  = availableGrid.currGridIndex;
            const totalMoveCost     = availableGrid.totalMoveCost;
            if (_checkAndUpdateMovableArea({ area, gridIndex: currentGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
                const nextMoveCost = tileMap.getTile(currentGridIndex).getMoveCostByUnit(unit);
                if (nextMoveCost != null) {
                    for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                        _updateAvailableGrids({ grids: availableGrids, index, gridIndex: nextGridIndex, prev: currentGridIndex, totalMoveCost: totalMoveCost + nextMoveCost });
                    }
                }
            }

            ++index;
        }

        const distanceMap   = Helpers.createEmptyMap<number>(mapSize.width);
        let maxDistance     = 0;
        for (let x = 0; x < mapSize.width; ++x) {
            if (area[x]) {
                for (let y = 0; y < mapSize.height; ++y) {
                    if (area[x][y]) {
                        distanceMap[x][y]   = area[x][y].totalMoveCost;
                        maxDistance         = Math.max(maxDistance, distanceMap[x][y]);
                    }
                }
            }
        }
        return { distanceMap, maxDistance};
    }

    export function findNearestCapturableTile(tileMap: TwnsBwTileMap.BwTileMap, unitMap: TwnsBwUnitMap.BwUnitMap, unit: TwnsBwUnit.BwUnit): TwnsBwTile.BwTile | null {
        const area          : MovableArea = [];
        const availableGrids: AvailableMovableGrid[] = [];
        _updateAvailableGrids({
            grids           : availableGrids,
            index           : 0,
            gridIndex       : unit.getGridIndex(),
            prev            : null,
            totalMoveCost   : 0,
        });

        const teamIndex = unit.getTeamIndex();
        const mapSize   = tileMap.getMapSize();
        let index   = 0;
        while (index < availableGrids.length) {
            const availableGrid     = _sortAvailableMovableGrids(availableGrids, index);
            const currentGridIndex  = availableGrid.currGridIndex;
            const totalMoveCost     = availableGrid.totalMoveCost;
            const tile              = tileMap.getTile(currentGridIndex);
            // const existingUnit      = unitMap.getUnitOnMap(currentGridIndex);

            if ((tile.getMaxCapturePoint())                                                                 &&
                (tile.getTeamIndex() !== teamIndex)    //                                                     &&
                // ((!existingUnit) || (existingUnit === unit) || (existingUnit.getTeamIndex() !== teamIndex))
            ) {
                return tile;
            } else {
                if (_checkAndUpdateMovableArea({ area, gridIndex: currentGridIndex, prev: availableGrid.prevGridIndex, totalMoveCost })) {
                    for (const nextGridIndex of GridIndexHelpers.getAdjacentGrids(currentGridIndex, mapSize)) {
                        const nextMoveCost = tileMap.getTile(nextGridIndex).getMoveCostByUnit(unit);
                        if (nextMoveCost != null) {
                            _updateAvailableGrids({ grids: availableGrids, index, gridIndex: nextGridIndex, prev: currentGridIndex, totalMoveCost: totalMoveCost + nextMoveCost });
                        }
                    }
                }
            }

            ++index;
        }

        return null;
    }

    function _updateAvailableGrids({ grids, index, gridIndex, prev, totalMoveCost }: {
        grids           : AvailableMovableGrid[];
        index           : number;
        gridIndex       : GridIndex;
        prev            : GridIndex | null;
        totalMoveCost   : number;
    }): void {
        const newNode: AvailableMovableGrid = {
            currGridIndex: gridIndex,
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : null,
            totalMoveCost,
        };

        for (let i = index; i < grids.length; ++i) {
            if (GridIndexHelpers.checkIsEqual(grids[i].currGridIndex, gridIndex)) {
                if (grids[i].totalMoveCost > totalMoveCost) {
                    grids[i] = newNode;
                }
                return;
            }
        }

        grids.push(newNode);
    }
    function _checkAndUpdateMovableArea({ area, gridIndex, prev, totalMoveCost }: {
        area            : MovableArea;
        gridIndex       : GridIndex;
        prev            : GridIndex | null;
        totalMoveCost   : number;
    }): boolean {
        const { x, y } = gridIndex;
        area[x] = area[x] || [];

        if ((area[x][y]) && (area[x][y].totalMoveCost <= totalMoveCost)) {
            return false;
        } else {
            area[x][y] = {
                prevGridIndex: prev ? { x: prev.x, y: prev.y } : null,
                totalMoveCost,
            };
            return true;
        }
    }
    function _sortAvailableMovableGrids(list: AvailableMovableGrid[], startingIndex: number): AvailableMovableGrid {
        let indexForMinMoveCost = startingIndex;
        let minMoveCost         = list[indexForMinMoveCost].totalMoveCost;
        for (let i = startingIndex + 1; i < list.length; ++i) {
            if (list[i].totalMoveCost < minMoveCost) {
                indexForMinMoveCost = i;
                minMoveCost         = list[i].totalMoveCost;
            }
        }

        if (indexForMinMoveCost !== startingIndex) {
            [list[indexForMinMoveCost], list[startingIndex]] = [list[startingIndex], list[indexForMinMoveCost]];
        }
        return list[startingIndex];
    }

    export function checkAreaHasGrid(area: AttackableArea | MovableArea, gridIndex: GridIndex): boolean {
        const { x, y } = gridIndex;
        return (!!area[x]) && (!!area[x][y]);
    }
    export function checkIsGridIndexInsideCoSkillArea({ gridIndex, coSkillAreaType, getCoGridIndexArrayOnMap, coZoneRadius }: {
        gridIndex               : GridIndex;
        coSkillAreaType         : CoSkillAreaType;
        getCoGridIndexArrayOnMap: () => GridIndex[];
        coZoneRadius            : number;
    }): boolean {
        if (coSkillAreaType === CoSkillAreaType.Halo) {
            return true;

        } else if (coSkillAreaType === CoSkillAreaType.OnMap) {
            const coGridIndexArray = getCoGridIndexArrayOnMap();
            return coGridIndexArray.length > 0;

        } else if (coSkillAreaType === CoSkillAreaType.Zone) {
            const coGridIndexArray  = getCoGridIndexArrayOnMap();
            const distance          = GridIndexHelpers.getMinDistance(gridIndex, coGridIndexArray);
            return (distance != null) && (distance <= coZoneRadius);

        } else {
            throw Helpers.newError(`Invalid coSkillAreaType: ${coSkillAreaType}`, ClientErrorCode.WarCommonHelpers_CheckIsGridIndexInsideCoSkillArea_00);
        }
    }

    export function getNormalizedHp(hp: number): number {
        return Math.ceil(hp / CommonConstants.UnitHpNormalizer);
    }

    export function getMapSize(data: Types.Undefinable<WarSerialization.ISerialTileMap>): Types.MapSize {
        let width   = 0;
        let height  = 0;

        for (const tile of data ? data.tiles || [] : []) {
            const gridIndex = tile.gridIndex;
            width           = Math.max(width, (gridIndex ? gridIndex.x || 0 : 0) + 1);
            height          = Math.max(height, (gridIndex ? gridIndex.y || 0 : 0) + 1);
        }

        return { width, height };
    }
    export function checkIsValidMapSize(mapSize: Types.MapSize): boolean {
        const mapWidth  = mapSize.width;
        const mapHeight = mapSize.height;
        return (mapWidth > 0)
            && (mapHeight > 0)
            && (mapWidth * mapHeight <= CommonConstants.MapMaxGridsCount);
    }

    export function checkIsUnitIdCompact(unitArray: Types.Undefinable<ISerialUnit[]>): boolean {
        if ((unitArray == null) || (unitArray.length <= 0)) {
            return true;
        }

        const unitIdSet = new Set<number>();
        for (const unit of unitArray) {
            const unitId = unit.unitId;
            if ((unitId == null) || (unitId < 0) || (unitIdSet.has(unitId))) {
                return false;
            }
            unitIdSet.add(unitId);
        }

        if (!unitIdSet.has(0)) {
            return false;
        }
        for (const unitId of unitIdSet) {
            if ((unitId > 0) && (!unitIdSet.has(unitId - 1))) {
                return false;
            }
        }

        return true;
    }

    export function checkIsStateRequesting(state: Types.ActionPlannerState): boolean {
        return (state === Types.ActionPlannerState.RequestingPlayerActivateSkill)
            || (state === Types.ActionPlannerState.RequestingPlayerBeginTurn)
            || (state === Types.ActionPlannerState.RequestingPlayerDeleteUnit)
            || (state === Types.ActionPlannerState.RequestingPlayerEndTurn)
            || (state === Types.ActionPlannerState.RequestingPlayerSurrender)
            || (state === Types.ActionPlannerState.RequestingPlayerVoteForDraw)
            || (state === Types.ActionPlannerState.RequestingPlayerProduceUnit)
            || (state === Types.ActionPlannerState.RequestingPlayerUseCoSkill)
            || (state === Types.ActionPlannerState.RequestingUnitAttackUnit)
            || (state === Types.ActionPlannerState.RequestingUnitAttackTile)
            || (state === Types.ActionPlannerState.RequestingUnitBeLoaded)
            || (state === Types.ActionPlannerState.RequestingUnitBuildTile)
            || (state === Types.ActionPlannerState.RequestingUnitCaptureTile)
            || (state === Types.ActionPlannerState.RequestingUnitDive)
            || (state === Types.ActionPlannerState.RequestingUnitDrop)
            || (state === Types.ActionPlannerState.RequestingUnitJoin)
            || (state === Types.ActionPlannerState.RequestingUnitLaunchFlare)
            || (state === Types.ActionPlannerState.RequestingUnitLaunchSilo)
            || (state === Types.ActionPlannerState.RequestingUnitLoadCo)
            || (state === Types.ActionPlannerState.RequestingUnitProduceUnit)
            || (state === Types.ActionPlannerState.RequestingUnitSupply)
            || (state === Types.ActionPlannerState.RequestingUnitSurface)
            || (state === Types.ActionPlannerState.RequestingUnitUseCoPower)
            || (state === Types.ActionPlannerState.RequestingUnitUseCoSuperPower)
            || (state === Types.ActionPlannerState.RequestingUnitWait);
    }

    /**
     * The unit is dangling after moving!
     * You must call unitMap.addUnitOnMap() or unitMap.addUnitLoaded() after calling this function.
     */
    export function moveUnit({ war, pathNodes, launchUnitId, fuelConsumption }: {
        war             : TwnsBwWar.BwWar;
        pathNodes       : GridIndex[];
        launchUnitId    : Types.Undefinable<number>;
        fuelConsumption : number;
    }): void {
        const unitMap               = war.getUnitMap();
        const beginningGridIndex    = pathNodes[0];
        const focusUnit             = Helpers.getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId));
        war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, pathNodes);
        focusUnit.setCurrentFuel(focusUnit.getCurrentFuel() - fuelConsumption);
        if (launchUnitId == null) {
            unitMap.removeUnitOnMap(beginningGridIndex, false);
        } else {
            unitMap.removeUnitLoaded(launchUnitId);
        }

        if (pathNodes.length > 1) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            focusUnit.setIsCapturingTile(false);
            focusUnit.setIsBuildingTile(false);
            focusUnit.setLoaderUnitId(null);
            focusUnit.setGridIndex(endingGridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(focusUnit, true)) {
                unit.setGridIndex(endingGridIndex);
            }

            if (launchUnitId == null) {
                war.getTileMap().getTile(beginningGridIndex).updateOnUnitLeave();
            }
        }
    }
    export async function moveExtraUnit({ war, movingUnitAndPath, aiming, deleteViewAfterMoving }: {
        war                     : TwnsBwWar.BwWar;
        movingUnitAndPath       : Types.Undefinable<ProtoTypes.Structure.IMovingUnitAndPath>;
        aiming                  : GridIndex | null;
        deleteViewAfterMoving   : boolean;
    }): Promise<TwnsBwUnitView.BwUnitView | null> {
        if (movingUnitAndPath == null) {
            return null;
        }

        const movingUnitData = movingUnitAndPath.unit;
        if (movingUnitData == null) {
            return null;
        }

        const movingPath = movingUnitAndPath.path;
        if (movingPath == null) {
            throw Helpers.newError(`Empty movingPath.`, ClientErrorCode.WarCommonHelpers_MoveExtraUnit_00);
        }

        const unitMap           = war.getUnitMap();
        const unitMapView       = unitMap.getView();
        const movingUnitView    = unitMap.getUnitById(Helpers.getExisted(movingUnitData.unitId, ClientErrorCode.WarCommonHelpers_MoveExtraUnit_01))?.getView();
        (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

        const virtualUnit = new TwnsBwUnit.BwUnit();
        virtualUnit.init(movingUnitData, war.getConfigVersion());
        virtualUnit.startRunning(war);
        virtualUnit.startRunningView();

        const virtualUnitView = virtualUnit.getView();
        unitMapView.addUnit(virtualUnitView, true);
        await virtualUnitView.moveAlongExtraPath({
            path: movingPath,
            aiming,
            deleteViewAfterMoving
        });

        return virtualUnitView;
    }

    export function checkIsUnitRepaired(oldUnitData: ISerialUnit, newUnitData: ISerialUnit): boolean {
        if (oldUnitData.unitType != newUnitData.unitType) {
            return false;
        }

        return (newUnitData.currentHp ?? CommonConstants.UnitMaxHp) > (oldUnitData.currentHp ?? CommonConstants.UnitMaxHp);
    }
    export function checkIsUnitSupplied(oldUnitData: ISerialUnit, newUnitData: ISerialUnit, configVersion: string): boolean {
        const unitType = newUnitData.unitType;
        if ((unitType == null) || (oldUnitData.unitType != newUnitData.unitType)) {
            return false;
        }

        const unitCfg = Helpers.getExisted(ConfigManager.getUnitTemplateCfg(configVersion, unitType), ClientErrorCode.WarCommonHelpers_CheckIsUnitSupplied_00);
        {
            const maxFuel = unitCfg.maxFuel;
            if ((newUnitData.currentFuel ?? maxFuel) > (oldUnitData.currentFuel ?? maxFuel)) {
                return true;
            }
        }

        {
            const maxAmmo = unitCfg.primaryWeaponMaxAmmo;
            if ((maxAmmo != null)                                                                                       &&
                ((newUnitData.primaryWeaponCurrentAmmo ?? maxAmmo) > (oldUnitData.primaryWeaponCurrentAmmo ?? maxAmmo))
            ) {
                return true;
            }
        }

        {
            const maxAmmo = unitCfg.flareMaxAmmo;
            if ((maxAmmo != null)                                                                       &&
                ((newUnitData.flareCurrentAmmo ?? maxAmmo) > (oldUnitData.flareCurrentAmmo ?? maxAmmo))
            ) {
                return true;
            }
        }

        {
            const maxMaterial = unitCfg.maxProduceMaterial;
            if ((maxMaterial != null)                                                                                       &&
                ((newUnitData.currentProduceMaterial ?? maxMaterial) > (oldUnitData.currentProduceMaterial ?? maxMaterial))
            ) {
                return true;
            }
        }

        {
            const maxMaterial = unitCfg.maxBuildMaterial;
            if ((maxMaterial != null)                                                                                   &&
                ((newUnitData.currentBuildMaterial ?? maxMaterial) > (oldUnitData.currentBuildMaterial ?? maxMaterial))
            ) {
                return true;
            }
        }

        return false;
    }
    export function checkIsUnitDamaged(oldUnitData: ISerialUnit, newUnitData: ISerialUnit): boolean {
        if (oldUnitData.unitType != newUnitData.unitType) {
            return false;
        }

        return (newUnitData.currentHp ?? CommonConstants.UnitMaxHp) < (oldUnitData.currentHp ?? CommonConstants.UnitMaxHp);
    }

    // export function updateTilesAndUnits(
    //     war         : TwnsBwWar.BwWar,
    //     extraData   : Types.Undefinable<{
    //         actingTiles?        : ISerialTile[] | null;
    //         actingUnits?        : ISerialUnit[] | null;
    //         discoveredTiles?    : ISerialTile[] | null;
    //         discoveredUnits?    : ISerialUnit[] | null;
    //     }>,
    // ): void {
    //     if (extraData) {
    //         addUnitsBeforeExecutingAction(war, extraData.actingUnits, false);
    //         addUnitsBeforeExecutingAction(war, extraData.discoveredUnits, false);
    //         updateTilesBeforeExecutingAction(war, extraData.actingTiles);
    //         updateTilesBeforeExecutingAction(war, extraData.discoveredTiles);
    //     }
    // }
    // function addUnitsBeforeExecutingAction(
    //     war             : TwnsBwWar.BwWar,
    //     unitsData       : Types.Undefinable<ISerialUnit[]>,
    //     isViewVisible   : boolean
    // ): void {
    //     if ((unitsData) && (unitsData.length)) {
    //         const configVersion = war.getConfigVersion();
    //         const unitMap       = war.getUnitMap();
    //         for (const unitData of unitsData) {
    //             const unitId = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_AddUnitsBeforeExecutingAction_00);
    //             if (!unitMap.getUnitById(unitId)) {
    //                 const unit = new TwnsBwUnit.BwUnit();
    //                 unit.init(unitData, configVersion);

    //                 const isOnMap = unit.getLoaderUnitId() == null;
    //                 if (isOnMap) {
    //                     unitMap.setUnitOnMap(unit);
    //                 } else {
    //                     unitMap.setUnitLoaded(unit);
    //                 }
    //                 unit.startRunning(war);
    //                 unit.startRunningView();
    //                 unit.setViewVisible(isViewVisible);
    //             }
    //         }
    //     }
    // }
    // function updateTilesBeforeExecutingAction(war: TwnsBwWar.BwWar, tilesData: Types.Undefinable<ISerialTile[]>): void {
    //     if ((tilesData) && (tilesData.length)) {
    //         const tileMap   = war.getTileMap();
    //         for (const tileData of tilesData) {
    //             const gridIndex     = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex));
    //             const tile          = tileMap.getTile(gridIndex);
    //             const configVersion = tile.getConfigVersion();
    //             if (tile.getHasFog()) {
    //                 tile.setHasFog(false);
    //                 tile.deserialize(tileData, configVersion);
    //             }
    //         }
    //     }
    // }

    /**
     * @return the war view is vibrated or not
     */
    export function handleCommonExtraDataForWarActions({ war, commonExtraData, isFastExecute }: {
        war                 : TwnsBwWar.BwWar;
        commonExtraData     : ProtoTypes.Structure.ICommonExtraDataForWarAction;
        isFastExecute       : boolean;
    }): boolean {
        const playerIndexInTurn = war.getPlayerIndexInTurn();
        {
            const visibilityArrayFromPathsAfterAction = commonExtraData.visibilityArrayFromPathsAfterAction;
            if (visibilityArrayFromPathsAfterAction) {
                war.getFogMap().updateMapFromPathsByVisibilityArray(playerIndexInTurn, visibilityArrayFromPathsAfterAction);
            }
        }

        const configVersion             = war.getConfigVersion();
        const playerArrayAfterAction    = commonExtraData.playerArrayAfterAction ?? [];
        for (const playerData of playerArrayAfterAction) {
            const player = war.getPlayer(Helpers.getExisted(playerData.playerIndex, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_00));
            player.init(playerData, configVersion);
            player.startRunning(war);
        }

        const unitMap = war.getUnitMap();
        unitMap.setNextUnitId(Helpers.getExisted(commonExtraData.nextUnitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_01));

        const unitArrayAfterAction  = commonExtraData.unitArrayAfterAction ?? [];
        const destroyedUnitIdArray  = commonExtraData.destroyedUnitIdArray ?? [];
        if (unitArrayAfterAction.some(v => destroyedUnitIdArray.indexOf(Helpers.getExisted(v.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_02)) >= 0)) {
            throw Helpers.newError(`WarCommonHelpers.handleCommonExtraDataForWarActions() unitArrayAfterAction and destroyedUnitIdArray overlapped!`, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_03);
        }

        const movingUnitAndPath     = commonExtraData.movingUnitAndPath;
        const movingUnitId          = movingUnitAndPath ? Helpers.getExisted(movingUnitAndPath.unit?.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_04) : null;
        const movingUnit            = movingUnitId == null ? null : unitMap.getUnitById(movingUnitId);
        const gridVisualEffect      = war.getGridVisualEffect();
        let isShownExplosionEffect  = false;
        {
            const movingPath            = movingUnitAndPath?.path;
            const movingDestination     = movingPath ? movingPath[movingPath.length - 1] : null;
            const movingUnitPlayerIndex = movingUnit?.getPlayerIndex();
            const destinationGridIndex  = movingDestination?.isVisible ? GridIndexHelpers.convertGridIndex(movingDestination.gridIndex) : null;
            for (const unitId of destroyedUnitIdArray) {
                const unit = unitMap.getUnitById(unitId);
                if (unit == null) {
                    continue;
                }

                if (unit.getLoaderUnitId()) {
                    unitMap.removeUnitLoaded(unitId);

                } else {
                    const gridIndex = unit.getGridIndex();
                    unitMap.removeUnitOnMap(gridIndex, true);

                    if (!isFastExecute) {
                        if ((destinationGridIndex == null)                                      ||
                            (unit.getPlayerIndex() !== movingUnitPlayerIndex)                   ||
                            (!GridIndexHelpers.checkIsEqual(destinationGridIndex, gridIndex))
                        ) {
                            gridVisualEffect.showEffectExplosion(gridIndex);
                            isShownExplosionEffect = true;
                        }
                    }
                }
            }
        }

        const tempRemovedUnits = new Map<number, TwnsBwUnit.BwUnit>();  // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        if ((movingUnitId != null) && (movingUnit)) {
            unitMap.removeUnitById(movingUnitId, true);
            tempRemovedUnits.set(movingUnitId, movingUnit);

            for (const loadedUnit of unitMap.getUnitsLoadedByLoader(movingUnit, true)) {
                const loadedUnitId = loadedUnit.getUnitId();
                unitMap.removeUnitLoaded(loadedUnitId);
                tempRemovedUnits.set(loadedUnitId, loadedUnit);
            }
        }
        for (const unitData of unitArrayAfterAction) {
            // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????A?????????B??????????????????B?????????????????????A????????????????????????
            const unitId    = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_05);
            const unit      = unitMap.getUnitById(unitId);
            if (unit) {
                unitMap.removeUnitById(unitId, true);
                tempRemovedUnits.set(unitId, unit);
            }
        }

        const updatedViewUnits = new Set<TwnsBwUnit.BwUnit>();
        for (const unitData of unitArrayAfterAction) {
            const unitId        = Helpers.getExisted(unitData.unitId, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_06);
            // const existingUnit  = unitMap.getUnitById(unitId);
            const existingUnit  = tempRemovedUnits.get(unitId);
            if (existingUnit) {
                // if (existingUnit.getLoaderUnitId() == null) {
                //     unitMap.removeUnitOnMap(existingUnit.getGridIndex(), true);
                // } else {
                //     unitMap.removeUnitLoaded(unitId);
                // }

                const existingUnitData = existingUnit.serialize();
                existingUnit.init(unitData, configVersion);
                if (existingUnit.getLoaderUnitId() == null) {
                    unitMap.setUnitOnMap(existingUnit);
                } else {
                    unitMap.setUnitLoaded(existingUnit);
                }
                existingUnit.startRunning(war);
                existingUnit.startRunningView();
                updatedViewUnits.add(existingUnit);

                if (!isFastExecute) {
                    const gridIndex = existingUnit.getGridIndex();
                    if (checkIsUnitRepaired(existingUnitData, unitData)) {
                        gridVisualEffect.showEffectRepair(gridIndex);
                    } else if (checkIsUnitSupplied(existingUnitData, unitData, configVersion)) {
                        gridVisualEffect.showEffectSupply(gridIndex);
                    }

                    if (checkIsUnitDamaged(existingUnitData, unitData)) {
                        gridVisualEffect.showEffectDamage(gridIndex);
                    }
                }

            } else {
                const unit = new TwnsBwUnit.BwUnit();
                unit.init(unitData, configVersion);

                if (unit.getLoaderUnitId() == null) {
                    unitMap.setUnitOnMap(unit);
                } else {
                    unitMap.setUnitLoaded(unit);
                }
                unit.startRunning(war);
                unit.startRunningView();
                updatedViewUnits.add(unit);
            }
        }

        const tileMap = war.getTileMap();
        for (const tileData of commonExtraData.tileArrayAfterAction ?? []) {
            const gridIndex         = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex), ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarAction_07);
            const tile              = tileMap.getTile(gridIndex);
            const hpBeforeAction    = tile.getCurrentHp();
            tile.init(tileData, configVersion);
            tile.startRunning(war);
            tile.startRunningView();

            if (!isFastExecute) {
                if (hpBeforeAction != null) {
                    const hpAfterAction = tile.getCurrentHp();
                    if (hpAfterAction == null) {
                        gridVisualEffect.showEffectExplosion(gridIndex);
                        isShownExplosionEffect = true;
                    } else if (hpAfterAction < hpBeforeAction) {
                        gridVisualEffect.showEffectDamage(gridIndex);
                    }
                }
            }
        }

        if ((!isFastExecute) && (playerArrayAfterAction.some(v => v.playerIndex === playerIndexInTurn))) {
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if ((!updatedViewUnits.has(unit)) && (unit.getPlayerIndex() === playerIndexInTurn)) {
                    unit.updateView();
                }
            }
        }

        if ((!isFastExecute) && (isShownExplosionEffect)) {
            war.getView().showVibration();
            SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
            return true;
        } else {
            return false;
        }
    }

    export function getAdjacentPlasmas(tileMap: TwnsBwTileMap.BwTileMap, origin: GridIndex): GridIndex[] {
        const plasmas           = [origin];
        const mapSize           = tileMap.getMapSize();
        const mapHeight         = mapSize.height;
        const searchedIndexes   = new Set<number>([getIndexOfGridIndex(mapHeight, origin)]);

        let i = 0;
        while (i < plasmas.length) {
            for (const adjacentGridIndex of GridIndexHelpers.getAdjacentGrids(plasmas[i], mapSize)) {
                if (tileMap.getTile(adjacentGridIndex).getType() === TileType.Plasma) {
                    const searchIndex = getIndexOfGridIndex(mapHeight, adjacentGridIndex);
                    if (!searchedIndexes.has(searchIndex)) {
                        searchedIndexes.add(searchIndex);
                        plasmas.push(adjacentGridIndex);
                    }
                }
            }
            ++i;
        }

        plasmas.shift();
        return plasmas;
    }

    function getIndexOfGridIndex(mapHeight: number, gridIndex: GridIndex): number {
        return gridIndex.x * mapHeight + gridIndex.y;
    }

    export function getIdleBuildingGridIndex(war: TwnsBwWar.BwWar): Types.GridIndex | null {
        const playerIndex               = war.getPlayerIndexInTurn();
        const field                     = war.getField();
        const tileMap                   = field.getTileMap();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex();
        const { width, height}          = tileMap.getMapSize();
        const checkIsIdle               = (gridIndex: Types.GridIndex): boolean => {
            if (tileMap.getTile(gridIndex).checkIsUnitProducerForPlayer(playerIndex)) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((!unit)                                                                                     ||
                    ((unit.getActionState() === Types.UnitActionState.Idle) && (unit.getPlayerIndex() === playerIndex))
                ) {
                    return true;
                }
            }
            return false;
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = { x, y };
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = { x, y };
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }
    export function getIdleUnitGridIndex(war: TwnsBwWar.BwWar): Types.GridIndex | null {
        const playerIndex               = war.getPlayerIndexInTurn();
        const field                     = war.getField();
        const unitMap                   = field.getUnitMap();
        const { x: currX, y: currY }    = field.getCursor().getGridIndex();
        const { width, height}          = unitMap.getMapSize();
        const checkIsIdle               = (gridIndex: Types.GridIndex): boolean => {
            const unit = unitMap.getUnitOnMap(gridIndex);
            return (unit?.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle);
        };

        for (let y = currY; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y > currY) || (x > currX)) {
                    const gridIndex = { x, y };
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        for (let y = 0; y <= currY; ++y) {
            for (let x = 0; x < width; ++x) {
                if ((y < currY) || (x <= currX)) {
                    const gridIndex = { x, y };
                    if (checkIsIdle(gridIndex)) {
                        return gridIndex;
                    }
                }
            }
        }

        return null;
    }

    export function getVisibilityArrayWithMapFromPath(map: Visibility[][], mapSize: MapSize): Visibility[] | null {
        const { width, height } = mapSize;
        const data              = new Array(width * height);
        let needSerialize       = false;

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                data[x + y * width] = map[x][y];
                if ((!needSerialize) && (map[x][y] !== Visibility.OutsideVision)) {
                    needSerialize = true;
                }
            }
        }

        return needSerialize ? data : null;
    }

    export function getMapId(warData: ISerialWar): number | null {
        if (warData.settingsForMcw) {
            return Helpers.getExisted(warData.settingsForMcw.mapId);
        } else if (warData.settingsForMrw) {
            return Helpers.getExisted(warData.settingsForMrw.mapId);
        } else if (warData.settingsForScw) {
            return Helpers.getExisted(warData.settingsForScw.mapId);
        } else if (warData.settingsForCcw) {
            return Helpers.getExisted(warData.settingsForCcw.mapId);
        } else if (warData.settingsForSrw) {
            return Helpers.getExisted(warData.settingsForSrw.mapId);
        } else {
            return null;
        }
    }
    export function getWarType(warData: ISerialWar): WarType {
        const warRule   = warData.settingsForCommon?.warRule;
        const hasFog    = warRule ? WarRuleHelpers.getHasFogByDefault(warRule) : null;
        if (hasFog == null) {
            return WarType.Undefined;
        }

        if (warData.settingsForMcw) {
            return hasFog ? WarType.McwFog : WarType.McwStd;
        } else if (warData.settingsForMfw) {
            return hasFog ? WarType.MfwFog : WarType.MfwStd;
        } else if (warData.settingsForMrw) {
            return hasFog ? WarType.MrwFog : WarType.MrwStd;
        } else if (warData.settingsForScw) {
            return hasFog ? WarType.ScwFog : WarType.ScwStd;
        } else if (warData.settingsForSfw) {
            return hasFog ? WarType.SfwFog : WarType.SfwStd;
        } else if (warData.settingsForCcw) {
            return hasFog ? WarType.CcwFog : WarType.CcwStd;
        } else if (warData.settingsForSrw) {
            return hasFog ? WarType.SrwFog : WarType.SrwStd;
        } else {
            return WarType.Undefined;
        }
    }
    export function getWarTypeByMpwWarSettings(warInfo: ProtoTypes.MultiPlayerWar.IMpwWarSettings): WarType {
        const warRule   = warInfo.settingsForCommon?.warRule;
        const hasFog    = warRule ? WarRuleHelpers.getHasFogByDefault(warRule) : null;
        if (hasFog == null) {
            return WarType.Undefined;
        }

        if (warInfo.settingsForMcw) {
            return hasFog ? WarType.McwFog : WarType.McwStd;
        } else if (warInfo.settingsForMfw) {
            return hasFog ? WarType.MfwFog : WarType.MfwStd;
        } else if (warInfo.settingsForMrw) {
            return hasFog ? WarType.MrwFog : WarType.MrwStd;
        } else if (warInfo.settingsForCcw) {
            return hasFog ? WarType.CcwFog : WarType.CcwStd;
        } else {
            return WarType.Undefined;
        }
    }

    export function checkCanCheatInWar(warType: Types.WarType): boolean {
        return (warType === Types.WarType.ScwFog)
            || (warType === Types.WarType.ScwStd)
            || (warType === Types.WarType.SfwFog)
            || (warType === Types.WarType.SfwStd)
            || (warType === Types.WarType.Me);
    }

    export function getPlayersCountUnneutral(playerManagerData: Types.Undefinable<WarSerialization.ISerialPlayerManager>): number {
        const playerIndexSet = new Set<number>();
        for (const playerData of playerManagerData ? playerManagerData.players || [] : []) {
            const playerIndex = playerData.playerIndex;
            if ((playerIndex != null) && (playerIndex >= CommonConstants.WarFirstPlayerIndex)) {
                playerIndexSet.add(playerIndex);
            }
        }
        return playerIndexSet.size;
    }

    export function getCoMaxEnergy(coConfig: ProtoTypes.Config.ICoBasicCfg): number {
        const expansionArray = coConfig.zoneExpansionEnergyList || [];
        return Math.max(
            expansionArray[expansionArray.length - 1] || 0,
            (coConfig.powerEnergyList || [])[1] || 0,
        );
    }

    export function getImageSourceForSkinId(skinId: number, isSelected: boolean): string {
        if (skinId === 1) {
            return isSelected ? `uncompressedCircle0000` : `uncompressedCircle0001`;
        } else if (skinId === 2) {
            return isSelected ? `uncompressedCircle0002` : `uncompressedCircle0003`;
        } else if (skinId === 3) {
            return isSelected ? `uncompressedCircle0004` : `uncompressedCircle0005`;
        } else if (skinId === 4) {
            return isSelected ? `uncompressedCircle0010` : `uncompressedCircle0011`;
        } else if (skinId === 5) {
            return isSelected ? `uncompressedCircle0006` : `uncompressedCircle0007`;
        } else {
            return ``;
        }
    }
    export function getImageSourceForCoEyeFrame(skinId: number): string {
        switch (skinId) {
            case CommonConstants.WarNeutralPlayerIndex  : return ``;
            case 1                                      : return `uncompressedTriangle0001`;
            case 2                                      : return `uncompressedTriangle0002`;
            case 3                                      : return `uncompressedTriangle0003`;
            case 4                                      : return `uncompressedTriangle0004`;
            case 5                                      : return `uncompressedTriangle0005`;
            default                                     : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetImageSourceForCoEyeFrame_00);
        }
    }
    export function getImageSourceForCoHeadFrame(skinId: Types.Undefinable<number>): string {
        switch (skinId) {
            case 1  : return `uncompressedRectangle0002`;
            case 2  : return `uncompressedRectangle0003`;
            case 3  : return `uncompressedRectangle0004`;
            case 4  : return `uncompressedRectangle0008`;
            case 5  : return `uncompressedRectangle0005`;
            default : return `uncompressedRectangle0006`;
        }
    }

    export function getTextColorForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0xFFFFFF;
            case 1  : return 0xF4664F;
            case 2  : return 0x34A7DE;
            case 3  : return 0xF9D803;
            case 4  : return 0x3ADA22;
            case 5  : return 0x000000;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetTextColorForSkinId_00);
        }
    }
    export function getTextStrokeForSkinId(skinId: number): number {
        switch (skinId) {
            case 0  : return 0;
            case 1  : return 0;
            case 2  : return 0;
            case 3  : return 0;
            case 4  : return 0;
            case 5  : return 1;
            default : throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.WarCommonHelpers_GetTextStrokeForSkinId_00);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other validators.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getErrorCodeForUnitDataIgnoringUnitId({ unitData, mapSize, playersCountUnneutral, configVersion }: {
        unitData                : ProtoTypes.WarSerialization.ISerialUnit;
        configVersion           : string;
        mapSize                 : Types.Undefinable<Types.MapSize>;
        playersCountUnneutral   : Types.Undefinable<number>;
    }): ClientErrorCode {
        const gridIndex = GridIndexHelpers.convertGridIndex(unitData.gridIndex);
        if (gridIndex == null) {
            return ClientErrorCode.UnitDataValidation00;
        }
        if ((mapSize) && (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
            return ClientErrorCode.UnitDataValidation01;
        }

        const unitType = unitData.unitType as UnitType;
        if (unitType == null) {
            return ClientErrorCode.UnitDataValidation02;
        }

        const playerIndex = unitData.playerIndex;
        if ((playerIndex == null)                               ||
            (playerIndex < CommonConstants.WarFirstPlayerIndex) ||
            (playerIndex > CommonConstants.WarMaxPlayerIndex)
        ) {
            return ClientErrorCode.UnitDataValidation03;
        }
        if ((playersCountUnneutral != null) && (playerIndex > playersCountUnneutral)) {
            return ClientErrorCode.UnitDataValidation04;
        }

        const cfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
        if (cfg == null) {
            return ClientErrorCode.UnitDataValidation05;
        }

        const currBuildMaterial = unitData.currentBuildMaterial;
        const maxBuildMaterial  = cfg.maxBuildMaterial;
        if ((currBuildMaterial != null)                                         &&
            ((maxBuildMaterial == null) || (currBuildMaterial > maxBuildMaterial))
        ) {
            return ClientErrorCode.UnitDataValidation06;
        }

        const currFuel  = unitData.currentFuel;
        const maxFuel   = cfg.maxFuel;
        if ((currFuel != null)                          &&
            ((maxFuel == null) || (currFuel > maxFuel))
        ) {
            return ClientErrorCode.UnitDataValidation07;
        }

        const currHp    = unitData.currentHp;
        const maxHp     = cfg.maxHp;
        if ((currHp != null)                    &&
            ((maxHp == null) || (currHp > maxHp))
        ) {
            return ClientErrorCode.UnitDataValidation08;
        }

        const currProduceMaterial   = unitData.currentProduceMaterial;
        const maxProduceMaterial    = cfg.maxProduceMaterial;
        if ((currProduceMaterial != null)                                               &&
            ((maxProduceMaterial == null) || (currProduceMaterial > maxProduceMaterial))
        ) {
            return ClientErrorCode.UnitDataValidation09;
        }

        const currPromotion = unitData.currentPromotion;
        const maxPromotion  = ConfigManager.getUnitMaxPromotion(configVersion);
        if ((currPromotion != null)                                 &&
            ((maxPromotion == null) || (currPromotion > maxPromotion))
        ) {
            return ClientErrorCode.UnitDataValidation10;
        }

        const flareCurrentAmmo  = unitData.flareCurrentAmmo;
        const flareMaxAmmo      = cfg.flareMaxAmmo;
        if ((flareCurrentAmmo != null)                                  &&
            ((flareMaxAmmo == null) || (flareCurrentAmmo > flareMaxAmmo))
        ) {
            return ClientErrorCode.UnitDataValidation11;
        }

        if ((unitData.isDiving) && (cfg.diveCfgs == null)) {
            return ClientErrorCode.UnitDataValidation12;
        }

        const currAmmo  = unitData.primaryWeaponCurrentAmmo;
        const maxAmmo   = cfg.primaryWeaponMaxAmmo;
        if ((currAmmo != null)                          &&
            ((maxAmmo == null) || (currAmmo > maxAmmo))
        ) {
            return ClientErrorCode.UnitDataValidation13;
        }

        if ((unitData.isCapturingTile) && (!cfg.canCaptureTile)) {
            return ClientErrorCode.UnitDataValidation14;
        }

        const actionState = unitData.actionState;
        if ((actionState != null)                           &&
            (actionState !== Types.UnitActionState.Idle)    &&
            (actionState !== Types.UnitActionState.Acted)
        ) {
            return ClientErrorCode.UnitDataValidation15;
        }

        const loaderUnitId = unitData.loaderUnitId;
        if ((loaderUnitId != null) && (loaderUnitId === unitData.unitId)) {
            return ClientErrorCode.UnitDataValidation16;
        }

        return ClientErrorCode.NoError;
    }
}

// export default WarCommonHelpers;
