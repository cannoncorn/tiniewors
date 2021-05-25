
namespace TinyWars.Utility.Notify {
    import GridIndex    = Types.GridIndex;
    import TouchPoints  = Types.TouchPoints;

    ////////////////////////////////////////////////////////////////////////////////
    // Notify types.
    ////////////////////////////////////////////////////////////////////////////////
    export const enum Type {
        NetworkConnected,
        NetworkDisconnected,

        TimeTick,
        TileAnimationTick,
        UnitAnimationTick,
        GridAnimationTick,
        UnitAndTileTextureVersionChanged,
        IsShowGridBorderChanged,

        MouseWheel,
        GlobalTouchBegin,
        GlobalTouchMove,
        ZoomableContentsMoved,

        ConfigLoaded,
        TileModelUpdated,
        LanguageChanged,

        ChatPanelOpened,
        ChatPanelClosed,

        McrCreateBannedCoIdArrayChanged,
        McrCreateTeamIndexChanged,
        McrCreateSelfCoIdChanged,
        McrCreateSelfSkinIdChanged,
        McrCreateSelfPlayerIndexChanged,
        McrCreatePresetWarRuleIdChanged,

        McrJoinTargetRoomIdChanged,
        McrJoinedPreviewingRoomIdChanged,

        MfrCreateSelfCoIdChanged,
        MfrCreateTeamIndexChanged,
        MfrCreateSelfPlayerIndexChanged,
        MfrCreateSelfSkinIdChanged,

        MfrJoinTargetRoomIdChanged,
        MfrJoinedPreviewingRoomIdChanged,

        MrrMyRoomAdded,
        MrrMyRoomDeleted,
        MrrJoinedPreviewingRoomIdChanged,
        MrrSelfSettingsCoIdChanged,
        MrrSelfSettingsSkinIdChanged,

        ScrCreatePresetWarRuleIdChanged,
        ScrCreateBannedCoIdArrayChanged,
        ScrCreateWarSaveSlotChanged,
        ScrCreatePlayerInfoChanged,

        MrrPreviewingMapIdChanged,
        McwPreviewingWarIdChanged,
        MrwPreviewingWarIdChanged,
        MfwPreviewingWarIdChanged,
        RwPreviewingReplayIdChanged,
        SpmPreviewingWarSaveSlotChanged,

        BroadcastOngoingMessagesChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        RwNextActionIdChanged,
        BwTurnIndexChanged,
        BwTurnPhaseCodeChanged,
        BwPlayerIndexInTurnChanged,

        BwPlayerFundChanged,
        BwCoEnergyChanged,
        BwCoUsingSkillTypeChanged,
        BwCoIdChanged,

        BwCursorTapped,
        BwCursorDragged,
        BwCursorDragEnded,
        BwCursorGridIndexChanged,

        BwFieldZoomed,
        BwFieldDragged,

        BwActionPlannerStateChanged,

        BwWarMenuPanelOpened,
        BwWarMenuPanelClosed,
        BwProduceUnitPanelOpened,
        BwProduceUnitPanelClosed,
        BwCoListPanelOpened,
        BwCoListPanelClosed,

        BwUnitBeDestroyed,
        BwUnitBeAttacked,
        BwUnitBeSupplied,
        BwUnitBeRepaired,

        BwTileBeDestroyed,
        BwTileBeAttacked,

        BwSiloExploded,

        ReplayAutoReplayChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MeDrawerModeChanged,
        MeUnitChanged,
        MeTileChanged,
        MeMapNameChanged,
        MeWarRuleNameChanged,
        MeWarEventIdArrayChanged,
        MeBannedCoIdArrayChanged,

        WarEventFullDataChanged,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgCommonHeartbeat,
        MsgCommonLatestConfigVersion,
        MsgCommonGetServerStatus,
        MsgCommonGetRankList,

        MsgBroadcastGetMessageList,
        MsgBroadcastAddMessage,
        MsgBroadcastDeleteMessage,
        MsgBroadcastDoBroadcast,

        MsgChangeLogGetMessageList,
        MsgChangeLogAddMessage,
        MsgChangeLogModifyMessage,

        MsgUserLogin,
        MsgUserRegister,
        MsgUserLogout,

        MsgMapGetRawData,
        MsgMapGetRawDataFailed,
        MsgMapGetEnabledBriefDataList,
        MsgMapGetEnabledRawDataList,
        MsgMapGetBriefData,
        MsgMapGetBriefDataFailed,

        MsgChatGetAllMessages,
        MsgChatAddMessage,
        MsgChatUpdateReadProgress,
        MsgChatGetAllReadProgressList,

        MsgUserGetPublicInfo,
        MsgUserGetPublicInfoFailed,
        MsgUserSetNickname,
        MsgUserSetNicknameFailed,
        MsgUserSetDiscordId,
        MsgUserSetDiscordIdFailed,
        MsgUserGetOnlineUsers,
        MsgUserSetPrivilege,
        MsgUserSetPassword,
        MsgUserGetSettings,
        MsgUserSetSettings,

        MsgMeGetDataList,
        MsgMeGetData,
        MsgMeSubmitMap,

        MsgMmSetMapAvailability,
        MsgMmReloadAllMaps,
        MsgMmSetMapEnabled,
        MsgMmGetReviewingMaps,
        MsgMmReviewMap,
        MsgMmSetMapTag,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMcrCreateRoom,
        MsgMcrGetRoomInfo,
        MsgMcrGetRoomInfoFailed,
        MsgMcrGetJoinedRoomInfoList,
        MsgMcrGetJoinableRoomInfoList,
        MsgMcrExitRoom,
        MsgMcrSetWarRule,
        MsgMcrJoinRoom,
        MsgMcrDeleteRoomByPlayer,
        MsgMcrDeleteRoomByServer,
        MsgMcrDeletePlayer,
        MsgMcrSetReady,
        MsgMcrSetSelfSettings,
        MsgMcrGetOwnerPlayerIndex,
        MsgMcrStartWar,

        MsgMfrCreateRoom,
        MsgMfrGetRoomInfo,
        MsgMfrGetRoomInfoFailed,
        MsgMfrGetJoinedRoomInfoList,
        MsgMfrGetJoinableRoomInfoList,
        MsgMfrExitRoom,
        MsgMfrJoinRoom,
        MsgMfrDeleteRoomByPlayer,
        MsgMfrDeleteRoomByServer,
        MsgMfrDeletePlayer,
        MsgMfrSetReady,
        MsgMfrSetSelfSettings,
        MsgMfrGetOwnerPlayerIndex,
        MsgMfrStartWar,

        MsgMrrGetMaxConcurrentCount,
        MsgMrrSetMaxConcurrentCount,
        MsgMrrGetRoomPublicInfo,
        MsgMrrGetRoomPublicInfoFailed,
        MsgMrrGetMyRoomPublicInfoList,
        MsgMrrSetBannedCoIdList,
        MsgMrrSetSelfSettings,
        MsgMrrDeleteRoomByServer,

        MsgReplayGetInfoList,
        MsgReplayGetData,
        MsgReplayGetDataFailed,
        MsgReplaySetRating,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgMpwCommonGetMyWarInfoList,
        MsgMpwCommonContinueWarFailed,
        MsgMpwCommonContinueWar,
        MsgMpwCommonSyncWar,
        MsgMpwCommonHandleBoot,

        MsgMpwWatchGetUnwatchedWarInfos,
        MsgMpwWatchGetOngoingWarInfos,
        MsgMpwWatchGetRequestedWarInfos,
        MsgMpwWatchGetWatchedWarInfos,
        MsgMpwWatchMakeRequest,
        MsgMpwWatchHandleRequest,
        MsgMpwWatchDeleteWatcher,
        MsgMpwWatchContinueWar,
        MsgMpwWatchContinueWarFailed,

        MsgMpwActionSystemBeginTurn,
        MsgMpwActionSystemCallWarEvent,
        MsgMpwActionSystemDestroyPlayerForce,
        MsgMpwActionSystemEndWar,

        MsgMpwActionPlayerDeleteUnit,
        MsgMpwActionPlayerEndTurn,
        MsgMpwActionPlayerProduceUnit,
        MsgMpwActionPlayerSurrender,
        MsgMpwActionPlayerVoteForDraw,
        MsgMpwActionUnitAttackUnit,
        MsgMpwActionUnitAttackTile,
        MsgMpwActionUnitBeLoaded,
        MsgMpwActionUnitBuildTile,
        MsgMpwActionUnitCaptureTile,
        MsgMpwActionUnitDive,
        MsgMpwActionUnitDropUnit,
        MsgMpwActionUnitJoinUnit,
        MsgMpwActionUnitLaunchFlare,
        MsgMpwActionUnitLaunchSilo,
        MsgMpwActionUnitLoadCo,
        MsgMpwActionUnitProduceUnit,
        MsgMpwActionUnitSupplyUnit,
        MsgMpwActionUnitSurface,
        MsgMpwActionUnitUseCoSkill,
        MsgMpwActionUnitWait,

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        MsgSpmCreateScw,
        MsgSpmCreateSfw,
        MsgSpmCreateSrw,
        MsgSpmGetWarSaveSlotFullDataArray,
        MsgSpmDeleteWarSaveSlot,
        MsgSpmSaveScw,
        MsgSpmSaveSfw,
        MsgSpmSaveSrw,
        MsgSpmGetSrwRankInfo,
        MsgSpmValidateSrw,
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Notify datas.
    ////////////////////////////////////////////////////////////////////////////////
    export namespace Data {
        export type ConfigLoaded                = number;
        export type McwPlayerIndexInTurnChanged = number;
        export type McwPlayerFundChanged        = BaseWar.BwPlayer;
        export type McwPlayerEnergyChanged      = BaseWar.BwPlayer;
        export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
        export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
        export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
        export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
        export type MeUnitChanged               = { gridIndex: GridIndex };
        export type MeTileChanged               = { gridIndex: GridIndex };
        export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Dispatcher functions.
    ////////////////////////////////////////////////////////////////////////////////
    const _DISPATCHER = new egret.EventDispatcher();

    export type Listener = {
        type        : Type,
        callback    : (e: egret.Event) => void,
        thisObject? : any,
        useCapture? : boolean,
        priority?   : number;
    };

    export function dispatch(t: Type, data?: any): void {
        _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
    }

    export function addEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
        _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject, useCapture, priority);
    }
    export function addEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean, priority?: number): void {
        for (const l of listeners) {
            addEventListener(
                l.type,
                l.callback,
                l.thisObject != null ? l.thisObject : thisObject,
                l.useCapture != null ? l.useCapture : useCapture,
                l.priority   != null ? l.priority   : priority
            );
        }
    }

    export function removeEventListener(type: Type, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean): void {
        _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject, useCapture);
    }
    export function removeEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean): void {
        for (const l of listeners) {
            removeEventListener(
                l.type,
                l.callback,
                l.thisObject != null ? l.thisObject : thisObject,
                l.useCapture != null ? l.useCapture : useCapture
            );
        }
    }

    function getTypeName(t: Type): string {
        return "Notify" + t;
    }
}
