
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import Logger                               from "../../tools/helpers/Logger";
import Types                                from "../../tools/helpers/Types";
import Notify                               from "../../tools/notify/Notify";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                            from "../../user/model/UserModel";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import MrrProxy                             from "./MrrProxy";
import MrrSelfSettingsModel                 from "./MrrSelfSettingsModel";

namespace MrrModel {
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import NetMessage                               = ProtoTypes.NetMessage;
    import IMrrRoomInfo                             = ProtoTypes.MultiRankRoom.IMrrRoomInfo;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    let _previewingRoomId           : number;
    let _previewingMapId            : number;
    let _maxConcurrentCountForStd   = 0;
    let _maxConcurrentCountForFog   = 0;
    const _roomInfoDict             = new Map<number, IMrrRoomInfo>();
    const _roomInfoRequests         = new Map<number, ((info: NetMessage.MsgMrrGetRoomPublicInfo.IS | undefined | null) => void)[]>();

    export function setMaxConcurrentCount(hasFog: boolean, count: number): void {
        if (hasFog) {
            _maxConcurrentCountForFog = count;
        } else {
            _maxConcurrentCountForStd = count;
        }
    }
    export function getMaxConcurrentCount(hasFog: boolean): number {
        return hasFog ? _maxConcurrentCountForFog : _maxConcurrentCountForStd;
    }

    function setRoomInfo(roomId: number, roomInfo: IMrrRoomInfo | undefined): void {
        _roomInfoDict.set(roomId, roomInfo);
    }
    export function getRoomInfo(roomId: number): Promise<IMrrRoomInfo | undefined | null> {
        if (roomId == null) {
            return new Promise((resolve) => resolve(null));
        }
        if (_roomInfoDict.has(roomId)) {
            return new Promise(resolve => resolve(_roomInfoDict.get(roomId)));
        }

        if (_roomInfoRequests.has(roomId)) {
            return new Promise((resolve) => {
                _roomInfoRequests.get(roomId).push(info => resolve(info.roomInfo));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
                if (data.roomId === roomId) {
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfo,         callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,   callbackOnFailed);

                    for (const cb of _roomInfoRequests.get(roomId)) {
                        cb(data);
                    }
                    _roomInfoRequests.delete(roomId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfo,        callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMrrGetRoomPublicInfoFailed,  callbackOnFailed);

            MrrProxy.reqMrrGetRoomPublicInfo(roomId);
        });

        return new Promise((resolve) => {
            _roomInfoRequests.set(roomId, [info => resolve(info.roomInfo)]);
        });
    }

    export function updateWithMyRoomInfoList(roomList: IMrrRoomInfo[]): void {
        for (const roomInfo of roomList || []) {
            setRoomInfo(roomInfo.roomId, roomInfo);
        }
    }
    export function getMyRoomIdArray(): number[] {
        const idArray: number[] = [];
        for (const [roomId, roomInfo] of _roomInfoDict) {
            if (checkIsMyRoom(roomInfo)) {
                idArray.push(roomId);
            }
        }
        return idArray;
    }

    export async function updateOnMsgMrrGetRoomPublicInfo(data: ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS): Promise<void> {
        const roomInfo  = data.roomInfo;
        const roomId    = roomInfo.roomId;
        setRoomInfo(roomId, roomInfo);

        if (MrrSelfSettingsModel.getRoomId() === roomId) {
            await MrrSelfSettingsModel.resetData(roomId);
        }
    }
    export async function updateOnMsgMrrSetBannedCoIdList(data: ProtoTypes.NetMessage.MsgMrrSetBannedCoIdList.IS): Promise<void> {
        const roomId    = data.roomId;
        const roomInfo  = await getRoomInfo(roomId);
        if (!roomInfo) {
            return;
        }

        const settingsForMrw    = roomInfo.settingsForMrw;
        const srcPlayerIndex    = data.playerIndex;
        const bannedCoIdList    = data.bannedCoIdList;
        if (settingsForMrw.dataArrayForBanCo == null) {
            settingsForMrw.dataArrayForBanCo = [{
                srcPlayerIndex,
                bannedCoIdList,
            }];
        } else {
            const dataArray     = settingsForMrw.dataArrayForBanCo;
            const playerData    = dataArray.find(v => v.srcPlayerIndex === data.playerIndex);
            if (playerData) {
                playerData.bannedCoIdList = data.bannedCoIdList;
            } else {
                dataArray.push({
                    srcPlayerIndex,
                    bannedCoIdList,
                });
            }
        }
    }
    export async function updateOnMsgMrrSetSelfSettings(data: ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS): Promise<void> {
        const roomInfo = await getRoomInfo(data.roomId);
        if (!roomInfo) {
            return;
        }

        const playerIndex       = data.playerIndex;
        const coId              = data.coId;
        const unitAndTileSkinId = data.unitAndTileSkinId;
        if (roomInfo.playerDataList == null) {
            Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() roomInfo.playerDataList == null.`);
            roomInfo.playerDataList = [{
                playerIndex,
                userId              : null,
                coId,
                unitAndTileSkinId,
                isReady             : true,
            }];
        } else {
            const dataArray     = roomInfo.playerDataList;
            const playerData    = dataArray.find(v => v.playerIndex === playerIndex);
            if (playerData) {
                playerData.coId                 = coId;
                playerData.isReady              = true;
                playerData.unitAndTileSkinId    = unitAndTileSkinId;
            } else {
                Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() playerData == null.`);
                dataArray.push({
                    playerIndex,
                    userId              : null,
                    coId,
                    unitAndTileSkinId,
                    isReady             : true,
                });
            }
        }
    }
    export function updateOnMsgMrrDeleteRoomByServer(data: ProtoTypes.NetMessage.MsgMrrDeleteRoomByServer.IS): void {
        const roomId        = data.roomId;
        const oldRoomInfo   = _roomInfoDict.get(roomId);
        setRoomInfo(roomId, undefined);

        if ((oldRoomInfo) && (checkIsMyRoom(oldRoomInfo))) {
            Notify.dispatch(NotifyType.MrrMyRoomDeleted);
        }
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of getMyRoomIdArray()) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return false;
        }

        const selfUserId = UserModel.getSelfUserId();
        const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
        if (playerData == null) {
            return false;
        }

        if (roomInfo.timeForStartSetSelfSettings != null) {
            return !playerData.isReady;
        } else {
            const arr = roomInfo.settingsForMrw.dataArrayForBanCo;
            if ((arr == null) || (arr.every(v => v.srcPlayerIndex !== playerData.playerIndex))) {
                return true;
            }
        }
    }

    export function getPreviewingRoomId(): number {
        return _previewingRoomId;
    }
    export function setPreviewingRoomId(roomId: number | null): void {
        if (getPreviewingRoomId() != roomId) {
            _previewingRoomId = roomId;
            Notify.dispatch(NotifyType.MrrJoinedPreviewingRoomIdChanged);
        }
    }

    export function getPreviewingMapId(): number | null | undefined {
        return _previewingMapId;
    }
    export function setPreviewingMapId(mapId: number): void {
        if (getPreviewingMapId() != mapId) {
            _previewingMapId = mapId;
            Notify.dispatch(NotifyType.MrrPreviewingMapIdChanged);
        }
    }

    export async function createDataForCommonWarPlayerInfoPage(roomId: number): Promise<OpenDataForCommonWarPlayerInfoPage | undefined> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return undefined;
        }

        const settingsForCommon = roomInfo.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (const playerInfo of (roomInfo.playerDataList || [])) {
            const playerIndex = playerInfo.playerIndex;
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : false,
                userId              : playerInfo.userId,
                coId                : playerInfo.coId,
                unitAndTileSkinId   : playerInfo.unitAndTileSkinId,
                isReady             : playerInfo.isReady,
                isInTurn            : undefined,
                isDefeat            : undefined,
            });
        }

        return {
            configVersion           : settingsForCommon.configVersion,
            playersCountUnneutral   : WarRuleHelpers.getPlayersCount(warRule),
            roomOwnerPlayerIndex    : undefined,
            callbackOnExitRoom      : undefined,
            callbackOnDeletePlayer  : undefined,
            playerInfoArray,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number): Promise<OpenDataForCommonWarBasicSettingsPage> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const warRule           = roomInfo.settingsForCommon.warRule;
        const settingsForMrw    = roomInfo.settingsForMrw;
        const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(settingsForMrw.mapId),
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : undefined,
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: undefined,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: undefined,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: undefined,
                },
            );
        } else {
            Logger.error(`MrrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number): Promise<OpenDataForCommonWarAdvancedSettingsPage | undefined> {
        const roomInfo = await getRoomInfo(roomId);
        if (roomInfo == null) {
            return undefined;
        }

        const settingsForCommon = roomInfo.settingsForCommon;
        const warRule           = settingsForCommon.warRule;
        return {
            configVersion   : settingsForCommon.configVersion,
            warRule,
            warType         : warRule.ruleForGlobalParams.hasFogByDefault ? Types.WarType.MrwFog : Types.WarType.MrwStd,
        };
    }

    function checkIsMyRoom(roomInfo: IMrrRoomInfo | undefined): boolean {
        const selfUserId = UserModel.getSelfUserId();
        return roomInfo?.playerDataList?.some(v => v.userId === selfUserId);
    }
}

export default MrrModel;
