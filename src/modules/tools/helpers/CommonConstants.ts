
// import Types    from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CommonConstants {
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;
    import TileObjectType       = Types.TileObjectType;
    import TileType             = Types.TileType;
    import UnitType             = Types.UnitType;

    type FrameCfg = {
        framesCount     : number;
        ticksPerFrame   : number;
    };
    type TileObjectShapeCfg = {
        minPlayerIndex      : number;
        maxPlayerIndex      : number;
        shapesCount         : number;
        shapesCountForV0    : number;
    };
    type TileBaseShapeCfg = {
        shapesCount     : number;
    };
    type TileDecoratorShapeCfg = {
        shapesCount     : number;
    };

    export const DiscordUrl                             = `https://discord.gg/jdtRpY9`;
    export const GithubUrl                              = `https://github.com/Babygogogo/TinyWarsClient`;
    export const LegacyVersionUrl                       = `https://tinywars.online/game/legacy`;
    export const TestVersionUrl                         = `https://tinywars.online/game/test`;

    export const ErrorTextForLang                       = `LangErr`;
    export const ErrorTextForUndefined                  = `UndefErr`;
    export const GameVersion                            = Types.GameVersion.Legacy;
    export const AdminUserId                            = 1000001;
    export const NameListMaxLength                      = 5;

    export const BroadcastTextMaxLength                 = 150;
    export const ChangeLogTextMaxLength                 = 200;
    export const ChangeLogTextListMaxLength             = 2;
    export const ChangeLogMessageListMaxLength          = 100;

    export const MapMaxGridsCount                       = 1000;
    export const MapMaxNameLength                       = 30;
    export const MapMaxDesignerLength                   = 30;
    export const MapMaxRating                           = 10;
    export const MapMinRating                           = 0;
    export const MapMaxFileSize                         = 50000;
    export const MapMinLocationId                       = 1;
    export const MapMaxLocationId                       = 30;

    export const WarEventNameMaxLength                                  = 150;
    export const WarEventMaxEventsPerMap                                = 30;
    export const WarEventMaxConditionNodesPerMap                        = 50;
    export const WarEventMaxConditionsPerMap                            = 100;
    export const WarEventMaxActionsPerMap                               = 100;
    export const WarEventMaxActionsPerEvent                             = 10;
    export const WarEventMaxCallCountTotal                              = 100;
    export const WarEventMaxCallCountInPlayerTurn                       = 10;
    export const WarEventActionAddUnitMaxCount                          = 50;
    export const WarEventActionDialogueTextMaxLength                    = 300;
    export const WarEventActionDialogueMaxCount                         = 100;
    export const WarEventActionDialogueNameMaxLength                    = 30;
    export const WarEventActionSetCustomCounterMaxDeltaValue            = 10000000;
    export const WarEventActionSetCustomCounterMaxMultiplierPercentage  = 10000;
    export const WarEventActionSetPlayerFundMaxDeltaValue               = 10000000;
    export const WarEventActionSetPlayerFundMaxMultiplierPercentage     = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxMultiplierPercentage = 10000;
    export const WarEventActionSetPlayerCoEnergyMaxDeltaPercentage      = 100;

    export const MapEditorSlotMaxCountForNormal         = 5;
    export const MapEditorSlotMaxCountForCommittee      = 100;
    export const MapEditorAutoSaveMinTime               = 180;
    export const MapEditorAutoSaveMaxTime               = 1800;
    export const MapReviewCommentMaxLength              = 5000;
    export const SpwSaveSlotMaxCount                    = 10;
    export const SpmSaveSlotCommentMaxLength            = 15;

    export const RankInitialScore                       = 1200;
    export const RankMaxConcurrentCount                 = 10;
    export const RankMinConcurrentCount                 = 0;
    export const RankRoomPhaseTime                      = 3600 * 24;

    export const ChatMessageMaxLength                   = 200;
    export const ChatErrorMaxLength                     = 2000;
    export const ChatTeamDivider                        = 100;

    export const SiloRadius                             = 2;
    export const SiloDamage                             = 30;

    export const UnitHpNormalizer                       = 10;
    export const UnitMaxHp                              = 100;
    export const UnitAndTileMinSkinId                   = 1;
    export const UnitAndTileMaxSkinId                   = 5;
    export const UnitAndTileNeutralSkinId               = 0;

    export const CoEmptyId                              = 0;

    export const WarNeutralPlayerIndex                  = 0;
    export const WarFirstPlayerIndex                    = 1;
    export const WarMaxPlayerIndex                      = 5;
    export const WarNeutralTeamIndex                    = 0;
    export const WarFirstTeamIndex                      = 1;
    export const WarFirstTurnIndex                      = 1;
    export const WarPlayerMaxFund                       = 1_000_000_000;
    export const WarCustomCounterMaxValue               = 1_000_000_000;

    export const ReplayMaxRating                        = 10;
    export const ReplayMinRating                        = 0;

    export const WarNameMaxLength                       = 20;
    export const WarCommentMaxLength                    = 50;
    export const WarPasswordMaxLength                   = 4;
    export const WarCustomCounterMinId                  = 1;
    export const WarCustomCounterMaxId                  = 30;
    export const WarBootTimerRegularMaxLimit            = 3600 * 24 * 7;
    export const WarBootTimerRegularDefaultValue        = 3600 * 24 * 3;
    export const WarBootTimerIncrementalMaxLimit        = 3600 * 24;
    export const WarBootTimerDefaultParams              = [Types.BootTimerType.Regular, WarBootTimerRegularDefaultValue];
    export const WarMaxTurnsLimit                       = 80;
    export const WarMinTurnsLimit                       = 20;

    export const WarRuleFirstId                             = 0;
    export const WarRuleNameMaxLength                       = 15;
    export const WarRuleOffenseBonusMinLimit                = -100;
    export const WarRuleOffenseBonusMaxLimit                = 10000;
    export const WarRuleOffenseBonusDefault                 = 0;
    export const WarRuleEnergyGrowthMultiplierMinLimit      = 0;
    export const WarRuleEnergyGrowthMultiplierMaxLimit      = 10000;
    export const WarRuleEnergyGrowthMultiplierDefault       = 100;
    export const WarRuleIncomeMultiplierMinLimit            = 0;
    export const WarRuleIncomeMultiplierMaxLimit            = 10000;
    export const WarRuleIncomeMultiplierDefault             = 100;
    export const WarRuleEnergyAddPctOnLoadCoMinLimit        = 0;
    export const WarRuleEnergyAddPctOnLoadCoMaxLimit        = 100;
    export const WarRuleEnergyAddPctOnLoadCoDefault         = 0;
    export const WarRuleInitialFundMinLimit                 = 0;
    export const WarRuleInitialFundMaxLimit                 = 1000000;
    export const WarRuleInitialFundDefault                  = 0;
    export const WarRuleLuckMinLimit                        = -100;
    export const WarRuleLuckMaxLimit                        = 100;
    export const WarRuleLuckDefaultLowerLimit               = 0;
    export const WarRuleLuckDefaultUpperLimit               = 10;
    export const WarRuleMoveRangeModifierMinLimit           = -10;
    export const WarRuleMoveRangeModifierMaxLimit           = 10;
    export const WarRuleMoveRangeModifierDefault            = 0;
    export const WarRuleVisionRangeModifierMinLimit         = -10;
    export const WarRuleVisionRangeModifierMaxLimit         = 10;
    export const WarRuleVisionRangeModifierDefault          = 0;
    export const WarRuleMaxCount                            = 5;

    export const GridSize: Types.Size = {
        width   : 24,
        height  : 24,
    };
    export const StageMinScale      = 100;
    export const StageMaxScale      = 300;
    export const DefaultTweenTime   = 200;

    export const TileTypeMapping = new Map<TileBaseType, Map<TileObjectType, TileType>>([
        [TileBaseType.Beach, new Map([
            [TileObjectType.Empty,              TileType.Beach],
            [TileObjectType.Road,               TileType.Road],
            [TileObjectType.Bridge,             TileType.BridgeOnBeach],
            [TileObjectType.Wood,               TileType.Wood],
            [TileObjectType.Mountain,           TileType.Mountain],
            [TileObjectType.Wasteland,          TileType.Wasteland],
            [TileObjectType.Ruins,              TileType.Ruins],
            [TileObjectType.Fire,               TileType.Fire],
            [TileObjectType.Rough,              TileType.Rough],
            [TileObjectType.Mist,               TileType.MistOnBeach],
            [TileObjectType.Reef,               TileType.Reef],
            [TileObjectType.Plasma,             TileType.Plasma],
            [TileObjectType.Meteor,             TileType.Meteor],
            [TileObjectType.Silo,               TileType.Silo],
            [TileObjectType.EmptySilo,          TileType.EmptySilo],
            [TileObjectType.Headquarters,       TileType.Headquarters],
            [TileObjectType.City,               TileType.City],
            [TileObjectType.CommandTower,       TileType.CommandTower],
            [TileObjectType.Radar,              TileType.Radar],
            [TileObjectType.Factory,            TileType.Factory],
            [TileObjectType.Airport,            TileType.Airport],
            [TileObjectType.Seaport,            TileType.Seaport],
            [TileObjectType.TempAirport,        TileType.TempAirport],
            [TileObjectType.TempSeaport,        TileType.TempSeaport],
            [TileObjectType.Pipe,               TileType.Pipe],
            [TileObjectType.Crystal,            TileType.Crystal],
            [TileObjectType.CustomCrystal,      TileType.CustomCrystal],
            [TileObjectType.CannonUp,           TileType.CannonUp],
            [TileObjectType.CannonDown,         TileType.CannonDown],
            [TileObjectType.CannonLeft,         TileType.CannonLeft],
            [TileObjectType.CannonRight,        TileType.CannonRight],
            [TileObjectType.CustomCannon,       TileType.CustomCannon],
            [TileObjectType.LaserTurret,        TileType.LaserTurret],
            [TileObjectType.CustomLaserTurret,  TileType.CustomLaserTurret],
            [TileObjectType.PipeJoint,          TileType.PipeJoint],
        ])],
        [TileBaseType.Plain, new Map([
            [TileObjectType.Empty,              TileType.Plain],
            [TileObjectType.Road,               TileType.Road],
            [TileObjectType.Bridge,             TileType.BridgeOnPlain],
            [TileObjectType.Wood,               TileType.Wood],
            [TileObjectType.Mountain,           TileType.Mountain],
            [TileObjectType.Wasteland,          TileType.Wasteland],
            [TileObjectType.Ruins,              TileType.Ruins],
            [TileObjectType.Fire,               TileType.Fire],
            [TileObjectType.Rough,              TileType.Rough],
            [TileObjectType.Mist,               TileType.MistOnPlain],
            [TileObjectType.Reef,               TileType.Reef],
            [TileObjectType.Plasma,             TileType.Plasma],
            [TileObjectType.Meteor,             TileType.Meteor],
            [TileObjectType.Silo,               TileType.Silo],
            [TileObjectType.EmptySilo,          TileType.EmptySilo],
            [TileObjectType.Headquarters,       TileType.Headquarters],
            [TileObjectType.City,               TileType.City],
            [TileObjectType.CommandTower,       TileType.CommandTower],
            [TileObjectType.Radar,              TileType.Radar],
            [TileObjectType.Factory,            TileType.Factory],
            [TileObjectType.Airport,            TileType.Airport],
            [TileObjectType.Seaport,            TileType.Seaport],
            [TileObjectType.TempAirport,        TileType.TempAirport],
            [TileObjectType.TempSeaport,        TileType.TempSeaport],
            [TileObjectType.Pipe,               TileType.Pipe],
            [TileObjectType.Crystal,            TileType.Crystal],
            [TileObjectType.CustomCrystal,      TileType.CustomCrystal],
            [TileObjectType.CannonUp,           TileType.CannonUp],
            [TileObjectType.CannonDown,         TileType.CannonDown],
            [TileObjectType.CannonLeft,         TileType.CannonLeft],
            [TileObjectType.CannonRight,        TileType.CannonRight],
            [TileObjectType.CustomCannon,       TileType.CustomCannon],
            [TileObjectType.LaserTurret,        TileType.LaserTurret],
            [TileObjectType.CustomLaserTurret,  TileType.CustomLaserTurret],
            [TileObjectType.PipeJoint,          TileType.PipeJoint],
        ])],
        [TileBaseType.River, new Map([
            [TileObjectType.Empty,              TileType.River],
            [TileObjectType.Road,               TileType.Road],
            [TileObjectType.Bridge,             TileType.BridgeOnRiver],
            [TileObjectType.Wood,               TileType.Wood],
            [TileObjectType.Mountain,           TileType.Mountain],
            [TileObjectType.Wasteland,          TileType.Wasteland],
            [TileObjectType.Ruins,              TileType.Ruins],
            [TileObjectType.Fire,               TileType.Fire],
            [TileObjectType.Rough,              TileType.Rough],
            [TileObjectType.Mist,               TileType.MistOnRiver],
            [TileObjectType.Reef,               TileType.Reef],
            [TileObjectType.Plasma,             TileType.Plasma],
            [TileObjectType.Meteor,             TileType.Meteor],
            [TileObjectType.Silo,               TileType.Silo],
            [TileObjectType.EmptySilo,          TileType.EmptySilo],
            [TileObjectType.Headquarters,       TileType.Headquarters],
            [TileObjectType.City,               TileType.City],
            [TileObjectType.CommandTower,       TileType.CommandTower],
            [TileObjectType.Radar,              TileType.Radar],
            [TileObjectType.Factory,            TileType.Factory],
            [TileObjectType.Airport,            TileType.Airport],
            [TileObjectType.Seaport,            TileType.Seaport],
            [TileObjectType.TempAirport,        TileType.TempAirport],
            [TileObjectType.TempSeaport,        TileType.TempSeaport],
            [TileObjectType.Pipe,               TileType.Pipe],
            [TileObjectType.Crystal,            TileType.Crystal],
            [TileObjectType.CustomCrystal,      TileType.CustomCrystal],
            [TileObjectType.CannonUp,           TileType.CannonUp],
            [TileObjectType.CannonDown,         TileType.CannonDown],
            [TileObjectType.CannonLeft,         TileType.CannonLeft],
            [TileObjectType.CannonRight,        TileType.CannonRight],
            [TileObjectType.CustomCannon,       TileType.CustomCannon],
            [TileObjectType.LaserTurret,        TileType.LaserTurret],
            [TileObjectType.CustomLaserTurret,  TileType.CustomLaserTurret],
            [TileObjectType.PipeJoint,          TileType.PipeJoint],
        ])],
        [TileBaseType.Sea, new Map([
            [TileObjectType.Empty,              TileType.Sea],
            [TileObjectType.Road,               TileType.Road],
            [TileObjectType.Bridge,             TileType.BridgeOnSea],
            [TileObjectType.Wood,               TileType.Wood],
            [TileObjectType.Mountain,           TileType.Mountain],
            [TileObjectType.Wasteland,          TileType.Wasteland],
            [TileObjectType.Ruins,              TileType.Ruins],
            [TileObjectType.Fire,               TileType.Fire],
            [TileObjectType.Rough,              TileType.Rough],
            [TileObjectType.Mist,               TileType.MistOnSea],
            [TileObjectType.Reef,               TileType.Reef],
            [TileObjectType.Plasma,             TileType.Plasma],
            [TileObjectType.Meteor,             TileType.Meteor],
            [TileObjectType.Silo,               TileType.Silo],
            [TileObjectType.EmptySilo,          TileType.EmptySilo],
            [TileObjectType.Headquarters,       TileType.Headquarters],
            [TileObjectType.City,               TileType.City],
            [TileObjectType.CommandTower,       TileType.CommandTower],
            [TileObjectType.Radar,              TileType.Radar],
            [TileObjectType.Factory,            TileType.Factory],
            [TileObjectType.Airport,            TileType.Airport],
            [TileObjectType.Seaport,            TileType.Seaport],
            [TileObjectType.TempAirport,        TileType.TempAirport],
            [TileObjectType.TempSeaport,        TileType.TempSeaport],
            [TileObjectType.Pipe,               TileType.Pipe],
            [TileObjectType.Crystal,            TileType.Crystal],
            [TileObjectType.CustomCrystal,      TileType.CustomCrystal],
            [TileObjectType.CannonUp,           TileType.CannonUp],
            [TileObjectType.CannonDown,         TileType.CannonDown],
            [TileObjectType.CannonLeft,         TileType.CannonLeft],
            [TileObjectType.CannonRight,        TileType.CannonRight],
            [TileObjectType.CustomCannon,       TileType.CustomCannon],
            [TileObjectType.LaserTurret,        TileType.LaserTurret],
            [TileObjectType.CustomLaserTurret,  TileType.CustomLaserTurret],
            [TileObjectType.PipeJoint,          TileType.PipeJoint],
        ])],
    ]);

    export const TileTypeToTileBaseType = new Map<TileType, TileBaseType>([
        [TileType.Airport,              TileBaseType.Plain],
        [TileType.Beach,                TileBaseType.Beach],
        [TileType.BridgeOnBeach,        TileBaseType.Beach],
        [TileType.BridgeOnPlain,        TileBaseType.Plain],
        [TileType.BridgeOnRiver,        TileBaseType.River],
        [TileType.BridgeOnSea,          TileBaseType.Sea],
        [TileType.City,                 TileBaseType.Plain],
        [TileType.CommandTower,         TileBaseType.Plain],
        [TileType.EmptySilo,            TileBaseType.Plain],
        [TileType.Factory,              TileBaseType.Plain],
        [TileType.Fire,                 TileBaseType.Plain],
        [TileType.Pipe,                 TileBaseType.Plain],
        [TileType.Headquarters,         TileBaseType.Plain],
        [TileType.Meteor,               TileBaseType.Plain],
        [TileType.MistOnBeach,          TileBaseType.Beach],
        [TileType.MistOnPlain,          TileBaseType.Plain],
        [TileType.MistOnRiver,          TileBaseType.River],
        [TileType.MistOnSea,            TileBaseType.Sea],
        [TileType.Mountain,             TileBaseType.Plain],
        [TileType.Plain,                TileBaseType.Plain],
        [TileType.Plasma,               TileBaseType.Plain],
        [TileType.Radar,                TileBaseType.Plain],
        [TileType.Reef,                 TileBaseType.Sea],
        [TileType.River,                TileBaseType.River],
        [TileType.Road,                 TileBaseType.Plain],
        [TileType.Rough,                TileBaseType.Sea],
        [TileType.Ruins,                TileBaseType.Plain],
        [TileType.Sea,                  TileBaseType.Sea],
        [TileType.Seaport,              TileBaseType.Sea],
        [TileType.Silo,                 TileBaseType.Plain],
        [TileType.TempAirport,          TileBaseType.Plain],
        [TileType.TempSeaport,          TileBaseType.Plain],
        [TileType.Wasteland,            TileBaseType.Plain],
        [TileType.Wood,                 TileBaseType.Plain],
        [TileType.Crystal,              TileBaseType.Plain],
        [TileType.CustomCrystal,        TileBaseType.Plain],
        [TileType.CannonUp,             TileBaseType.Plain],
        [TileType.CannonDown,           TileBaseType.Plain],
        [TileType.CannonLeft,           TileBaseType.Plain],
        [TileType.CannonRight,          TileBaseType.Plain],
        [TileType.CustomCannon,         TileBaseType.Plain],
        [TileType.LaserTurret,          TileBaseType.Plain],
        [TileType.CustomLaserTurret,    TileBaseType.Plain],
        [TileType.PipeJoint,            TileBaseType.Plain],
    ]);
    export const TileTypeToTileObjectType = new Map<TileType, TileObjectType>([
        [TileType.Airport,              TileObjectType.Airport],
        [TileType.Beach,                TileObjectType.Empty],
        [TileType.BridgeOnBeach,        TileObjectType.Bridge],
        [TileType.BridgeOnPlain,        TileObjectType.Bridge],
        [TileType.BridgeOnRiver,        TileObjectType.Bridge],
        [TileType.BridgeOnSea,          TileObjectType.Bridge],
        [TileType.City,                 TileObjectType.City],
        [TileType.CommandTower,         TileObjectType.CommandTower],
        [TileType.EmptySilo,            TileObjectType.EmptySilo],
        [TileType.Factory,              TileObjectType.Factory],
        [TileType.Fire,                 TileObjectType.Fire],
        [TileType.Pipe,                 TileObjectType.Pipe],
        [TileType.Headquarters,         TileObjectType.Headquarters],
        [TileType.Meteor,               TileObjectType.Meteor],
        [TileType.MistOnBeach,          TileObjectType.Mist],
        [TileType.MistOnPlain,          TileObjectType.Mist],
        [TileType.MistOnRiver,          TileObjectType.Mist],
        [TileType.MistOnSea,            TileObjectType.Mist],
        [TileType.Mountain,             TileObjectType.Mountain],
        [TileType.Plain,                TileObjectType.Empty],
        [TileType.Plasma,               TileObjectType.Plasma],
        [TileType.Radar,                TileObjectType.Radar],
        [TileType.Reef,                 TileObjectType.Reef],
        [TileType.River,                TileObjectType.Empty],
        [TileType.Road,                 TileObjectType.Road],
        [TileType.Rough,                TileObjectType.Rough],
        [TileType.Ruins,                TileObjectType.Ruins],
        [TileType.Sea,                  TileObjectType.Empty],
        [TileType.Seaport,              TileObjectType.Seaport],
        [TileType.Silo,                 TileObjectType.Silo],
        [TileType.TempAirport,          TileObjectType.TempAirport],
        [TileType.TempSeaport,          TileObjectType.TempSeaport],
        [TileType.Wasteland,            TileObjectType.Wasteland],
        [TileType.Wood,                 TileObjectType.Wood],
        [TileType.Crystal,              TileObjectType.Crystal],
        [TileType.CustomCrystal,        TileObjectType.CustomCrystal],
        [TileType.CannonUp,             TileObjectType.CannonUp],
        [TileType.CannonDown,           TileObjectType.CannonDown],
        [TileType.CannonLeft,           TileObjectType.CannonLeft],
        [TileType.CannonRight,          TileObjectType.CannonRight],
        [TileType.CustomCannon,         TileObjectType.CustomCannon],
        [TileType.LaserTurret,          TileObjectType.LaserTurret],
        [TileType.CustomLaserTurret,    TileObjectType.CustomLaserTurret],
        [TileType.PipeJoint,            TileObjectType.PipeJoint],
    ]);

    export const TileBaseFrameConfigs = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileBaseType, FrameCfg >([
                [ TileBaseType.Beach,   { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileBaseType.Plain,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.River,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.Sea,     { framesCount: 6,   ticksPerFrame: 1                }],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileBaseType, FrameCfg >([
                [ TileBaseType.Beach,   { framesCount: 6,   ticksPerFrame: 1                }],
                [ TileBaseType.Plain,   { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE }],
                [ TileBaseType.River,   { framesCount: 4,   ticksPerFrame: 2                }],
                [ TileBaseType.Sea,     { framesCount: 6,   ticksPerFrame: 1                }],
            ]),
        ],
    ]);
    export const TileBaseShapeConfigs = new Map<TileBaseType, TileBaseShapeCfg>([
        [ TileBaseType.Beach,   { shapesCount: 37,  }],
        [ TileBaseType.Plain,   { shapesCount: 1,   }],
        [ TileBaseType.River,   { shapesCount: 16,  }],
        [ TileBaseType.Sea,     { shapesCount: 1,   }],
    ]);
    export const TileDecoratorFrameConfigs = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileDecoratorType, FrameCfg>([
                [ TileDecoratorType.Shore, { framesCount: 6, ticksPerFrame: 1 } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileDecoratorType, FrameCfg>([
                [ TileDecoratorType.Shore, { framesCount: 6, ticksPerFrame: 1 } ],
            ]),
        ],
    ]);
    export const TileDecoratorShapeConfigs = new Map<TileDecoratorType, TileDecoratorShapeCfg>([
        [ TileDecoratorType.Shore, { shapesCount: 47 } ],
    ]);
    export const TileObjectFrameConfigs = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<TileObjectType, FrameCfg>([
                [ TileObjectType.Empty,             { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Airport,           { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Bridge,            { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.City,              { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.CommandTower,      { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.EmptySilo,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Factory,           { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Fire,              { framesCount: 5,   ticksPerFrame: 1                } ],
                [ TileObjectType.Pipe,              { framesCount: 3,   ticksPerFrame: 1                } ],
                [ TileObjectType.Headquarters,      { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Meteor,            { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Mist,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Mountain,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Plasma,            { framesCount: 3,   ticksPerFrame: 1                } ],
                [ TileObjectType.Radar,             { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Reef,              { framesCount: 6,   ticksPerFrame: 1                } ],
                [ TileObjectType.Road,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Rough,             { framesCount: 6,   ticksPerFrame: 1                } ],
                [ TileObjectType.Ruins,             { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Seaport,           { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Silo,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.TempAirport,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.TempSeaport,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Wasteland,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Wood,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Crystal,           { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomCrystal,     { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.CannonUp,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonDown,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonLeft,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonRight,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomCannon,      { framesCount: 8,   ticksPerFrame: 1                } ],
                [ TileObjectType.LaserTurret,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomLaserTurret, { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.PipeJoint,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<TileObjectType, FrameCfg >([
                [ TileObjectType.Empty,             { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Airport,           { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Bridge,            { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.City,              { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.CommandTower,      { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.EmptySilo,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Factory,           { framesCount: 4,   ticksPerFrame: 3                } ],
                [ TileObjectType.Fire,              { framesCount: 5,   ticksPerFrame: 1                } ],
                [ TileObjectType.Pipe,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Headquarters,      { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Meteor,            { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Mist,              { framesCount: 5,   ticksPerFrame: 1                } ],
                [ TileObjectType.Mountain,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Plasma,            { framesCount: 4,   ticksPerFrame: 1                } ],
                [ TileObjectType.Radar,             { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Reef,              { framesCount: 6,   ticksPerFrame: 1                } ],
                [ TileObjectType.Road,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Rough,             { framesCount: 6,   ticksPerFrame: 1                } ],
                [ TileObjectType.Ruins,             { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Seaport,           { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.Silo,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.TempAirport,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.TempSeaport,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Wasteland,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Wood,              { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.Crystal,           { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomCrystal,     { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.CannonUp,          { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonDown,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonLeft,        { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CannonRight,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomCannon,      { framesCount: 4,   ticksPerFrame: 3                } ],
                [ TileObjectType.LaserTurret,       { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
                [ TileObjectType.CustomLaserTurret, { framesCount: 2,   ticksPerFrame: 3                } ],
                [ TileObjectType.PipeJoint,         { framesCount: 1,   ticksPerFrame: Number.MAX_VALUE } ],
            ]),
        ],
    ]);
    export const TileObjectShapeConfigs = new Map<TileObjectType, TileObjectShapeCfg>([ // ????????????????????????????????????
        [ TileObjectType.Road,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 11,    shapesCountForV0: 11,   } ],
        [ TileObjectType.Bridge,            { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 11,    shapesCountForV0: 11,   } ],
        [ TileObjectType.Wood,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Mountain,          { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 2,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Ruins,             { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Wasteland,         { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Mist,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Fire,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Silo,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.EmptySilo,         { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Reef,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Rough,             { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Meteor,            { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Plasma,            { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 30,    shapesCountForV0: 16,   } ],
        [ TileObjectType.Pipe,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 16,    shapesCountForV0: 16,   } ],
        [ TileObjectType.PipeJoint,         { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 2,     shapesCountForV0: 0,    } ],
        [ TileObjectType.Empty,             { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarNeutralPlayerIndex,  shapesCount: 4,     shapesCountForV0: 0,    } ],

        [ TileObjectType.Headquarters,      { minPlayerIndex: WarFirstPlayerIndex,      maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.City,              { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Factory,           { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Airport,           { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.TempAirport,       { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Seaport,           { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.TempSeaport,       { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CommandTower,      { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Radar,             { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.Crystal,           { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CustomCrystal,     { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CannonUp,          { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CannonDown,        { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CannonLeft,        { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CannonRight,       { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CustomCannon,      { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.LaserTurret,       { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
        [ TileObjectType.CustomLaserTurret, { minPlayerIndex: WarNeutralPlayerIndex,    maxPlayerIndex: WarMaxPlayerIndex,      shapesCount: 1,     shapesCountForV0: 1,    } ],
    ]);

    export const TileBaseSymmetry = new Map<TileBaseType, Map<number, number[]>>([
        //          ???????????? ???????????? ???????????? ???????????? ????????????    // ????????????
        // ??????     ???????????? ???????????? ???????????? ???????????? ?????????180  // ????????????
        ////////// plain: 1 (1 total) //////////
        [TileBaseType.Plain, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileBaseType.River, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   1,      3,      2,      4,      2,  ]],
            [   2,  [   2,      4,      1,      3,      1,  ]],
            [   3,  [   4,      1,      3,      2,      4,  ]],
            [   4,  [   3,      2,      4,      1,      3,  ]],
            [   5,  [   5,      10,     5,      10,     5,  ]],
            [   6,  [   8,      6,      7,      9,      9,  ]],
            [   7,  [   9,      8,      6,      7,      8,  ]],
            [   8,  [   6,      7,      9,      8,      7,  ]],
            [   9,  [   7,      9,      8,      6,      6,  ]],
            [   10, [   10,     5,      10,     5,      10, ]],
            [   11, [   12,     13,     11,     14,     12, ]],
            [   12, [   11,     14,     12,     13,     11, ]],
            [   13, [   13,     11,     14,     12,     14, ]],
            [   14, [   14,     12,     13,     11,     13, ]],
            [   15, [   15,     15,     15,     15,     15, ]],
        ])],
        [TileBaseType.Sea, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   2,      1,      4,      8,      8,  ]],
            [   2,  [   1,      4,      8,      2,      4,  ]],
            [   3,  [   3,      5,      12,     10,     12, ]],
            [   4,  [   8,      2,      1,      4,      2,  ]],
            [   5,  [   10,     3,      5,      12,     10, ]],
            [   6,  [   9,      6,      9,      6,      6,  ]],
            [   7,  [   11,     7,      13,     14,     14, ]],
            [   8,  [   4,      8,      2,      1,      1,  ]],
            [   9,  [   6,      9,      6,      9,      9,  ]],
            [   10, [   5,      12,     10,     3,      5,  ]],
            [   11, [   7,      13,     14,     11,     13, ]],
            [   12, [   12,     10,     3,      5,      3,  ]],
            [   13, [   14,     11,     7,      13,     11, ]],
            [   14, [   13,     14,     11,     7,      7,  ]],
            [   15, [   15,     15,     15,     15,     15, ]],
            [   16, [   16,     25,     20,     34,     20, ]],
            [   17, [   18,     26,     21,     36,     22, ]],
            [   18, [   17,     27,     22,     35,     21, ]],
            [   19, [   19,     28,     23,     37,     23, ]],
            [   20, [   20,     34,     16,     25,     16, ]],
            [   21, [   22,     35,     17,     27,     18, ]],
            [   22, [   21,     36,     18,     26,     17, ]],
            [   23, [   23,     37,     19,     28,     19, ]],
            [   24, [   24,     43,     24,     43,     24, ]],
            [   25, [   34,     16,     25,     20,     34, ]],
            [   26, [   35,     17,     27,     22,     36, ]],
            [   27, [   36,     18,     26,     21,     35, ]],
            [   28, [   37,     19,     28,     23,     37, ]],
            [   29, [   38,     29,     31,     40,     40, ]],
            [   30, [   39,     30,     32,     41,     41, ]],
            [   31, [   40,     38,     29,     31,     38, ]],
            [   32, [   41,     39,     30,     32,     39, ]],
            [   33, [   42,     44,     33,     45,     42, ]],
            [   34, [   25,     20,     34,     16,     25, ]],
            [   35, [   26,     21,     36,     18,     27, ]],
            [   36, [   27,     22,     35,     17,     26, ]],
            [   37, [   28,     23,     37,     19,     28, ]],
            [   38, [   29,     31,     40,     38,     31, ]],
            [   39, [   30,     32,     41,     39,     32, ]],
            [   40, [   31,     40,     38,     29,     29, ]],
            [   41, [   32,     41,     39,     30,     30, ]],
            [   42, [   33,     45,     42,     44,     33, ]],
            [   43, [   43,     24,     43,     24,     43, ]],
            [   44, [   44,     33,     45,     42,     45, ]],
            [   45, [   45,     42,     44,     33,     44, ]],
            [   46, [   46,     46,     46,     46,     46, ]],
        ])],
        [TileBaseType.Beach, new Map([
            [   0,  [   1,      2,      0,      3,      1,  ]],
            [   1,  [   0,      3,      1,      2,      0,  ]],
            [   2,  [   2,      0,      3,      1,      3,  ]],
            [   3,  [   3,      1,      2,      0,      2,  ]],
            [   4,  [   5,      6,      4,      7,      5,  ]],
            [   5,  [   4,      7,      5,      6,      4,  ]],
            [   6,  [   6,      4,      7,      5,      7,  ]],
            [   7,  [   7,      5,      6,      4,      6,  ]],
            [   8,  [   13,     14,     12,     15,     9,  ]],
            [   9,  [   12,     15,     13,     14,     8,  ]],
            [   10, [   14,     12,     15,     13,     11, ]],
            [   11, [   15,     13,     14,     12,     10, ]],
            [   12, [   9,      10,     8,      11,     13, ]],
            [   13, [   8,      11,     9,      10,     12, ]],
            [   14, [   10,     8,      11,     9,      15, ]],
            [   15, [   11,     9,      10,     8,      14, ]],
            [   16, [   19,     16,     17,     18,     18, ]],
            [   17, [   18,     19,     16,     17,     19, ]],
            [   18, [   17,     18,     19,     16,     16, ]],
            [   19, [   16,     17,     18,     19,     17, ]],
            [   20, [   23,     20,     21,     22,     22, ]],
            [   21, [   22,     23,     20,     21,     23, ]],
            [   22, [   21,     22,     23,     20,     20, ]],
            [   23, [   20,     21,     22,     23,     21, ]],
            [   24, [   31,     28,     29,     30,     26, ]],
            [   25, [   30,     31,     28,     29,     27, ]],
            [   26, [   29,     30,     31,     28,     24, ]],
            [   27, [   28,     29,     30,     31,     25, ]],
            [   28, [   27,     24,     25,     26,     30, ]],
            [   29, [   26,     27,     24,     25,     31, ]],
            [   30, [   25,     26,     27,     24,     28, ]],
            [   31, [   24,     25,     26,     27,     29, ]],
            [   32, [   33,     34,     32,     35,     33, ]],
            [   33, [   32,     35,     33,     34,     32, ]],
            [   34, [   34,     32,     35,     33,     35, ]],
            [   35, [   35,     33,     34,     32,     34, ]],
            [   36, [   36,     36,     36,     36,     36, ]],
        ])],
    ]);
    export const TileDecoratorSymmetry = new Map<TileDecoratorType, Map<number, number[]>>([
        //          ???????????? ???????????? ???????????? ???????????? ????????????    // ????????????
        // ??????     ???????????? ???????????? ???????????? ???????????? ?????????180  // ????????????
        [TileDecoratorType.Empty, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileDecoratorType.Shore, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   2,      1,      4,      8,      8,  ]],
            [   2,  [   1,      4,      8,      2,      4,  ]],
            [   3,  [   3,      5,      12,     10,     12, ]],
            [   4,  [   8,      2,      1,      4,      2,  ]],
            [   5,  [   10,     3,      5,      12,     10, ]],
            [   6,  [   9,      6,      9,      6,      6,  ]],
            [   7,  [   11,     7,      13,     14,     14, ]],
            [   8,  [   4,      8,      2,      1,      1,  ]],
            [   9,  [   6,      9,      6,      9,      9,  ]],
            [   10, [   5,      12,     10,     3,      5,  ]],
            [   11, [   7,      13,     14,     11,     13, ]],
            [   12, [   12,     10,     3,      5,      3,  ]],
            [   13, [   14,     11,     7,      13,     11, ]],
            [   14, [   13,     14,     11,     7,      7,  ]],
            [   15, [   15,     15,     15,     15,     15, ]],
            [   16, [   16,     25,     20,     34,     20, ]],
            [   17, [   18,     26,     21,     36,     22, ]],
            [   18, [   17,     27,     22,     35,     21, ]],
            [   19, [   19,     28,     23,     37,     23, ]],
            [   20, [   20,     34,     16,     25,     16, ]],
            [   21, [   22,     35,     17,     27,     18, ]],
            [   22, [   21,     36,     18,     26,     17, ]],
            [   23, [   23,     37,     19,     28,     19, ]],
            [   24, [   24,     43,     24,     43,     24, ]],
            [   25, [   34,     16,     25,     20,     34, ]],
            [   26, [   35,     17,     27,     22,     36, ]],
            [   27, [   36,     18,     26,     21,     35, ]],
            [   28, [   37,     19,     28,     23,     37, ]],
            [   29, [   38,     29,     31,     40,     40, ]],
            [   30, [   39,     30,     32,     41,     41, ]],
            [   31, [   40,     38,     29,     31,     38, ]],
            [   32, [   41,     39,     30,     32,     39, ]],
            [   33, [   42,     44,     33,     45,     42, ]],
            [   34, [   25,     20,     34,     16,     25, ]],
            [   35, [   26,     21,     36,     18,     27, ]],
            [   36, [   27,     22,     35,     17,     26, ]],
            [   37, [   28,     23,     37,     19,     28, ]],
            [   38, [   29,     31,     40,     38,     31, ]],
            [   39, [   30,     32,     41,     39,     32, ]],
            [   40, [   31,     40,     38,     29,     29, ]],
            [   41, [   32,     41,     39,     30,     30, ]],
            [   42, [   33,     45,     42,     44,     33, ]],
            [   43, [   43,     24,     43,     24,     43, ]],
            [   44, [   44,     33,     45,     42,     45, ]],
            [   45, [   45,     42,     44,     33,     44, ]],
            [   46, [   46,     46,     46,     46,     46, ]],
        ])],
    ]);
    export const TileObjectTypeSymmetry = new Map<TileObjectType, TileObjectType[]>([
        // ??????                                 ????????????                            ????????????                            ????????????                            ????????????                                ?????????180  // ????????????
        [ TileObjectType.Empty,             [ TileObjectType.Empty,             TileObjectType.Empty,               TileObjectType.Empty,               TileObjectType.Empty,               TileObjectType.Empty                ] ],
        [ TileObjectType.Road,              [ TileObjectType.Road,              TileObjectType.Road,                TileObjectType.Road,                TileObjectType.Road,                TileObjectType.Road                 ] ],
        [ TileObjectType.Bridge,            [ TileObjectType.Bridge,            TileObjectType.Bridge,              TileObjectType.Bridge,              TileObjectType.Bridge,              TileObjectType.Bridge               ] ],
        [ TileObjectType.Wood,              [ TileObjectType.Wood,              TileObjectType.Wood,                TileObjectType.Wood,                TileObjectType.Wood,                TileObjectType.Wood                 ] ],
        [ TileObjectType.Mountain,          [ TileObjectType.Mountain,          TileObjectType.Mountain,            TileObjectType.Mountain,            TileObjectType.Mountain,            TileObjectType.Mountain             ] ],
        [ TileObjectType.Wasteland,         [ TileObjectType.Wasteland,         TileObjectType.Wasteland,           TileObjectType.Wasteland,           TileObjectType.Wasteland,           TileObjectType.Wasteland            ] ],
        [ TileObjectType.Ruins,             [ TileObjectType.Ruins,             TileObjectType.Ruins,               TileObjectType.Ruins,               TileObjectType.Ruins,               TileObjectType.Ruins                ] ],
        [ TileObjectType.Fire,              [ TileObjectType.Fire,              TileObjectType.Fire,                TileObjectType.Fire,                TileObjectType.Fire,                TileObjectType.Fire                 ] ],
        [ TileObjectType.Rough,             [ TileObjectType.Rough,             TileObjectType.Rough,               TileObjectType.Rough,               TileObjectType.Rough,               TileObjectType.Rough                ] ],
        [ TileObjectType.Mist,              [ TileObjectType.Mist,              TileObjectType.Mist,                TileObjectType.Mist,                TileObjectType.Mist,                TileObjectType.Mist                 ] ],
        [ TileObjectType.Reef,              [ TileObjectType.Reef,              TileObjectType.Reef,                TileObjectType.Reef,                TileObjectType.Reef,                TileObjectType.Reef                 ] ],
        [ TileObjectType.Plasma,            [ TileObjectType.Plasma,            TileObjectType.Plasma,              TileObjectType.Plasma,              TileObjectType.Plasma,              TileObjectType.Plasma               ] ],
        [ TileObjectType.Meteor,            [ TileObjectType.Meteor,            TileObjectType.Meteor,              TileObjectType.Meteor,              TileObjectType.Meteor,              TileObjectType.Meteor               ] ],
        [ TileObjectType.Silo,              [ TileObjectType.Silo,              TileObjectType.Silo,                TileObjectType.Silo,                TileObjectType.Silo,                TileObjectType.Silo                 ] ],
        [ TileObjectType.EmptySilo,         [ TileObjectType.EmptySilo,         TileObjectType.EmptySilo,           TileObjectType.EmptySilo,           TileObjectType.EmptySilo,           TileObjectType.EmptySilo            ] ],
        [ TileObjectType.Headquarters,      [ TileObjectType.Headquarters,      TileObjectType.Headquarters,        TileObjectType.Headquarters,        TileObjectType.Headquarters,        TileObjectType.Headquarters         ] ],
        [ TileObjectType.City,              [ TileObjectType.City,              TileObjectType.City,                TileObjectType.City,                TileObjectType.City,                TileObjectType.City                 ] ],
        [ TileObjectType.CommandTower,      [ TileObjectType.CommandTower,      TileObjectType.CommandTower,        TileObjectType.CommandTower,        TileObjectType.CommandTower,        TileObjectType.CommandTower         ] ],
        [ TileObjectType.Radar,             [ TileObjectType.Radar,             TileObjectType.Radar,               TileObjectType.Radar,               TileObjectType.Radar,               TileObjectType.Radar                ] ],
        [ TileObjectType.Factory,           [ TileObjectType.Factory,           TileObjectType.Factory,             TileObjectType.Factory,             TileObjectType.Factory,             TileObjectType.Factory              ] ],
        [ TileObjectType.Airport,           [ TileObjectType.Airport,           TileObjectType.Airport,             TileObjectType.Airport,             TileObjectType.Airport,             TileObjectType.Airport              ] ],
        [ TileObjectType.Seaport,           [ TileObjectType.Seaport,           TileObjectType.Seaport,             TileObjectType.Seaport,             TileObjectType.Seaport,             TileObjectType.Seaport              ] ],
        [ TileObjectType.TempAirport,       [ TileObjectType.TempAirport,       TileObjectType.TempAirport,         TileObjectType.TempAirport,         TileObjectType.TempAirport,         TileObjectType.TempAirport          ] ],
        [ TileObjectType.TempSeaport,       [ TileObjectType.TempSeaport,       TileObjectType.TempSeaport,         TileObjectType.TempSeaport,         TileObjectType.TempSeaport,         TileObjectType.TempSeaport          ] ],
        [ TileObjectType.Pipe,              [ TileObjectType.Pipe,              TileObjectType.Pipe,                TileObjectType.Pipe,                TileObjectType.Pipe,                TileObjectType.Pipe                 ] ],
        [ TileObjectType.Crystal,           [ TileObjectType.Crystal,           TileObjectType.Crystal,             TileObjectType.Crystal,             TileObjectType.Crystal,             TileObjectType.Crystal              ] ],
        [ TileObjectType.CustomCrystal,     [ TileObjectType.CustomCrystal,     TileObjectType.CustomCrystal,       TileObjectType.CustomCrystal,       TileObjectType.CustomCrystal,       TileObjectType.CustomCrystal        ] ],
        [ TileObjectType.CannonUp,          [ TileObjectType.CannonDown,        TileObjectType.CannonLeft,          TileObjectType.CannonUp,            TileObjectType.CannonRight,         TileObjectType.CannonDown           ] ],
        [ TileObjectType.CannonDown,        [ TileObjectType.CannonUp,          TileObjectType.CannonRight,         TileObjectType.CannonDown,          TileObjectType.CannonLeft,          TileObjectType.CannonUp             ] ],
        [ TileObjectType.CannonLeft,        [ TileObjectType.CannonLeft,        TileObjectType.CannonUp,            TileObjectType.CannonRight,         TileObjectType.CannonDown,          TileObjectType.CannonRight          ] ],
        [ TileObjectType.CannonRight,       [ TileObjectType.CannonRight,       TileObjectType.CannonDown,          TileObjectType.CannonLeft,          TileObjectType.CannonUp,            TileObjectType.CannonLeft           ] ],
        [ TileObjectType.CustomCannon,      [ TileObjectType.CustomCannon,      TileObjectType.CustomCannon,        TileObjectType.CustomCannon,        TileObjectType.CustomCannon,        TileObjectType.CustomCannon         ] ],
        [ TileObjectType.LaserTurret,       [ TileObjectType.LaserTurret,       TileObjectType.LaserTurret,         TileObjectType.LaserTurret,         TileObjectType.LaserTurret,         TileObjectType.LaserTurret          ] ],
        [ TileObjectType.CustomLaserTurret, [ TileObjectType.CustomLaserTurret, TileObjectType.CustomLaserTurret,   TileObjectType.CustomLaserTurret,   TileObjectType.CustomLaserTurret,   TileObjectType.CustomLaserTurret    ] ],
        [ TileObjectType.PipeJoint,         [ TileObjectType.PipeJoint,         TileObjectType.PipeJoint,           TileObjectType.PipeJoint,           TileObjectType.PipeJoint,           TileObjectType.PipeJoint            ] ],

    ]);
    export const TileObjectShapeSymmetry = new Map<TileObjectType, Map<number, number[]>>([
        // ??????     ???????????? ???????????? ???????????? ???????????? ?????????180  // ????????????
        [TileObjectType.Empty, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   1,      2,      1,      2,      1,  ]],
            [   2,  [   2,      1,      2,      1,      2,  ]],
        ])],
        [TileObjectType.Road, new Map([
            [   0,  [   0,      1,      0,      1,      0,  ]],
            [   1,  [   1,      0,      1,      0,      1,  ]],
            [   2,  [   4,      2,      3,      5,      5,  ]],
            [   3,  [   5,      4,      2,      3,      4,  ]],
            [   4,  [   2,      3,      5,      4,      3,  ]],
            [   5,  [   3,      5,      4,      2,      2,  ]],
            [   6,  [   7,      8,      6,      9,      7,  ]],
            [   7,  [   6,      9,      7,      8,      6,  ]],
            [   8,  [   8,      6,      9,      7,      9,  ]],
            [   9,  [   9,      7,      8,      6,      8,  ]],
            [   10, [   10,     10,     10,     10,     10, ]],
        ])],
        [TileObjectType.Bridge, new Map([
            [   0,  [   0,      1,      0,      1,      0,  ]],
            [   1,  [   1,      0,      1,      0,      1,  ]],
            [   2,  [   4,      2,      3,      5,      5,  ]],
            [   3,  [   5,      4,      2,      3,      4,  ]],
            [   4,  [   2,      3,      5,      4,      3,  ]],
            [   5,  [   3,      5,      4,      2,      2,  ]],
            [   6,  [   7,      8,      6,      9,      7,  ]],
            [   7,  [   6,      9,      7,      8,      6,  ]],
            [   8,  [   8,      6,      9,      7,      9,  ]],
            [   9,  [   9,      7,      8,      6,      8,  ]],
            [   10, [   10,     10,     10,     10,     10, ]],
        ])],
        [TileObjectType.Wood, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Mountain, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Wasteland, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Ruins, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Fire, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Rough, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Mist, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Reef, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Plasma, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   3,      2,      1,      4,      3,  ]],
            [   2,  [   2,      1,      4,      3,      4,  ]],
            [   3,  [   1,      4,      3,      2,      1,  ]],
            [   4,  [   4,      3,      2,      1,      2,  ]],
            [   5,  [   7,      6,      5,      8,      7,  ]],
            [   6,  [   6,      5,      8,      7,      8,  ]],
            [   7,  [   5,      8,      7,      6,      5,  ]],
            [   8,  [   8,      7,      6,      5,      6,  ]],
            [   9,  [   10,     9,      12,     11,     11, ]],
            [   10, [   9,      12,     11,     10,     12, ]],
            [   11, [   12,     11,     10,     9,      9,  ]],
            [   12, [   11,     10,     9,      12,     10, ]],
            [   13, [   13,     13,     13,     13,     13, ]],
            [   14, [   14,     15,     14,     15,     14, ]],
            [   15, [   15,     14,     15,     14,     15, ]],
            [   16, [   18,     19,     16,     17,     18, ]],
            [   17, [   17,     18,     19,     16,     19, ]],
            [   18, [   16,     17,     18,     19,     16, ]],
            [   19, [   19,     16,     17,     18,     17, ]],
            [   20, [   21,     23,     22,     20,     23, ]],
            [   21, [   20,     21,     23,     22,     22, ]],
            [   22, [   23,     22,     20,     21,     21, ]],
            [   23, [   22,     20,     21,     23,     20, ]],
            [   24, [   24,     25,     24,     25,     24, ]],
            [   25, [   25,     24,     25,     24,     25, ]],
            [   26, [   26,     27,     28,     29,     28, ]],
            [   27, [   29,     26,     27,     28,     29, ]],
            [   28, [   28,     29,     26,     27,     26, ]],
            [   29, [   27,     28,     29,     26,     27, ]],
        ])],
        [TileObjectType.Meteor, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Silo, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.EmptySilo, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Headquarters, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.City, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CommandTower, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Radar, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Factory, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Airport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Seaport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.TempAirport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.TempSeaport, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.Pipe, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
            [   1,  [   3,      2,      1,      4,      3,  ]],
            [   2,  [   2,      1,      4,      3,      4,  ]],
            [   3,  [   1,      4,      3,      2,      1,  ]],
            [   4,  [   4,      3,      2,      1,      2,  ]],
            [   5,  [   7,      6,      5,      8,      7,  ]],
            [   6,  [   6,      5,      8,      7,      8,  ]],
            [   7,  [   5,      8,      7,      6,      5,  ]],
            [   8,  [   8,      7,      6,      5,      6,  ]],
            [   9,  [   10,     9,      12,     11,     11, ]],
            [   10, [   9,      12,     11,     10,     12, ]],
            [   11, [   12,     11,     10,     9,      9,  ]],
            [   12, [   11,     10,     9,      12,     10, ]],
            [   13, [   13,     13,     13,     13,     13, ]],
            [   14, [   14,     15,     14,     15,     14, ]],
            [   15, [   15,     14,     15,     14,     15, ]],
        ])],
        [TileObjectType.Crystal, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CustomCrystal, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CannonUp, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CannonDown, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CannonLeft, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CannonRight, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CustomCannon, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.LaserTurret, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.CustomLaserTurret, new Map([
            [   0,  [   0,      0,      0,      0,      0,  ]],
        ])],
        [TileObjectType.PipeJoint, new Map([
            [   0,  [   0,      1,      0,      1,      0,  ]],
            [   1,  [   1,      0,      1,      0,      1,  ]],
        ])],
    ]);

    export const TileDefaultCrystalData: ProtoTypes.WarSerialization.ITileCustomCrystalData = {
        radius                      : 2,
        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : false,

        deltaFund                   : 0,
        deltaEnergyPercentage       : 0,

        deltaHp                     : 2,
        deltaFuelPercentage         : 100,
        deltaPrimaryAmmoPercentage  : 100,
    };
    export const TileDefaultCannonUpData: ProtoTypes.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonDownData: ProtoTypes.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 0,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonLeftData: ProtoTypes.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 4,
        rangeForRight               : 0,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCannonRightData: ProtoTypes.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 0,
        rangeForLeft                : 0,
        rangeForRight               : 4,
        rangeForUp                  : 0,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomCannonData: ProtoTypes.WarSerialization.ITileCustomCannonData = {
        rangeForDown                : 4,
        rangeForLeft                : 4,
        rangeForRight               : 4,
        rangeForUp                  : 4,

        priority                    : 0,
        maxTargetCount              : 1,

        canAffectSelf               : false,
        canAffectAlly               : false,
        canAffectEnemy              : true,

        deltaHp                     : -3,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };
    export const TileDefaultCustomLaserTurretData: ProtoTypes.WarSerialization.ITileCustomLaserTurretData = {
        rangeForDown                : 9999,
        rangeForLeft                : 9999,
        rangeForRight               : 9999,
        rangeForUp                  : 9999,

        priority                    : 0,

        canAffectSelf               : true,
        canAffectAlly               : true,
        canAffectEnemy              : true,

        deltaHp                     : -5,
        deltaFuelPercentage         : 0,
        deltaPrimaryAmmoPercentage  : 0,
    };

    export const UnitImageConfigs = new Map([
        [
            Types.UnitAndTileTextureVersion.V0,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
            ]),
        ],
        [
            Types.UnitAndTileTextureVersion.V1,
            new Map<UnitType, { idle: FrameCfg, moving: FrameCfg }>([
                // [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                // [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                // [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 2,   ticksPerFrame: 1 } } ],
                [ UnitType.Infantry,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Mech,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 4,   ticksPerFrame: 1 } } ],
                [ UnitType.Bike,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Recon,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Flare,           { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiAir,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Tank,            { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.MediumTank,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.WarTank,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Artillery,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.AntiTank,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rockets,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Missiles,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Rig,             { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Fighter,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Bomber,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Duster,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.BattleCopter,    { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.TransportCopter, { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Seaplane,        { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Battleship,      { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Carrier,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Submarine,       { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Cruiser,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Lander,          { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
                [ UnitType.Gunboat,         { idle: { framesCount: 4,   ticksPerFrame: 3 },     moving: { framesCount: 3,   ticksPerFrame: 1 } } ],
            ]),
        ],
    ]);
}

// export default CommonConstants;
