
// import CommonModel          from "../../common/model/CommonModel";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserProxy            from "./UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace UserModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NetMessage           = ProtoTypes.NetMessage;
    import IUserPublicInfo      = ProtoTypes.User.IUserPublicInfo;
    import IUserBriefInfo       = ProtoTypes.User.IUserBriefInfo;
    import IUserSettings        = ProtoTypes.User.IUserSettings;
    import IUserSelfInfo        = ProtoTypes.User.IUserSelfInfo;
    import IUserPrivilege       = ProtoTypes.User.IUserPrivilege;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    let _isLoggedIn                 = false;
    let _selfInfo                   : IUserSelfInfo | null = null;
    let _selfAccount                : string;
    let _selfPassword               : string | null = null;
    const _userPublicInfoAccessor   = Helpers.createCachedDataAccessor<number, IUserPublicInfo>({
        reqData                     : (userId: number) => UserProxy.reqUserGetPublicInfo(userId),
    });
    const _userBriefInfoAccessor    = Helpers.createCachedDataAccessor<number, IUserBriefInfo>({
        reqData                     : (userId: number) => UserProxy.reqUserGetBriefInfo(userId),
    });

    export function init(): void {
        Notify.addEventListeners([
            { type: NotifyType.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
            { type: NotifyType.MsgUserLogout,          callback: _onNotifyMsgUserLogout, },
        ], null);
    }

    export function clearLoginInfo(): void {
        setIsLoggedIn(false);
        setSelfInfo(null);
        setSelfPassword(null);
    }

    function setIsLoggedIn(isLoggedIn: boolean): void {
        _isLoggedIn = isLoggedIn;
    }
    export function getIsLoggedIn(): boolean {
        return _isLoggedIn;
    }

    function setSelfInfo(selfInfo: IUserSelfInfo | null): void {
        _selfInfo = selfInfo;
    }
    export function getSelfInfo(): IUserSelfInfo | null {
        return _selfInfo;
    }
    function getSelfUserComplexInfo(): ProtoTypes.User.IUserComplexInfo | null {
        const selfInfo = getSelfInfo();
        return selfInfo ? selfInfo.userComplexInfo ?? null : null;
    }

    export function getSelfUserId(): number | null {
        const selfInfo = getSelfInfo();
        return selfInfo ? selfInfo.userId ?? null : null;
    }

    export function setSelfAccount(account: string): void {
        _selfAccount = account;
    }
    export function getSelfAccount(): string {
        return _selfAccount;
    }

    export function setSelfPassword(password: string | null): void {
        _selfPassword = password;
    }
    export function getSelfPassword(): string | null {
        return _selfPassword;
    }

    function getSelfUserPrivilege(): IUserPrivilege | null {
        const userComplexInfo = getSelfUserComplexInfo();
        return userComplexInfo ? userComplexInfo.userPrivilege ?? null : null;
    }
    function setSelfUserPrivilege(userPrivilege: IUserPrivilege): void {
        const userComplexInfo = getSelfUserComplexInfo();
        (userComplexInfo) && (userComplexInfo.userPrivilege = userPrivilege);
    }
    export function getIsSelfAdmin(): boolean {
        const privilege = getSelfUserPrivilege();
        return privilege ? (!!privilege.isAdmin) : false;
    }
    export function getIsSelfMapCommittee(): boolean {
        const privilege = getSelfUserPrivilege();
        return privilege ? (!!privilege.isMapCommittee) : false;
    }
    export function checkCanSelfEditChangeLog(): boolean {
        const privilege = getSelfUserPrivilege();
        return (!!privilege)
            && ((!!privilege.isAdmin) || (!!privilege.isChangeLogEditor));
    }
    export function getIsSelfChatManager(): boolean {
        return !!getSelfUserPrivilege()?.isChatManager;
    }

    export function getSelfNickname(): string | null {
        const info = getSelfInfo();
        return info ? info.nickname ?? null : null;
    }
    function setSelfNickname(nickname: string): void {
        const info = getSelfInfo();
        (info) && (info.nickname = nickname);
    }

    export function getSelfAvatarId(): number | null {
        return getSelfInfo()?.userComplexInfo?.avatarId ?? null;
    }
    export function setSelfAvatarId(avatarId: number): void {
        const userComplexInfo = getSelfInfo()?.userComplexInfo;
        (userComplexInfo) && (userComplexInfo.avatarId = avatarId);
    }

    export function getSelfMapEditorAutoSaveTime(): number | null {
        return getSelfInfo()?.userComplexInfo?.mapEditorAutoSaveTime ?? null;
    }
    export function setSelfMapEditorAutoSaveTime(time: number | null): void {
        const userComplexInfo = getSelfInfo()?.userComplexInfo;
        (userComplexInfo) && (userComplexInfo.mapEditorAutoSaveTime = time);
    }

    export function getSelfDiscordId(): string | null {
        const info = getSelfInfo();
        return info ? info.discordId ?? null : null;
    }
    function setSelfDiscordId(discordId: string | null): void {
        const info = getSelfInfo();
        (info) && (info.discordId = discordId);
    }

    export function getUserPublicInfo(userId: number): Promise<IUserPublicInfo | null> {
        return _userPublicInfoAccessor.getData(userId);
    }
    export function setUserPublicInfo(userId: number, info: IUserPublicInfo | null): void {
        _userPublicInfoAccessor.setData(userId, info);
    }

    export function getUserBriefInfo(userId: number): Promise<IUserBriefInfo | null> {
        return _userBriefInfoAccessor.getData(userId);
    }
    export function setUserBriefInfo(userId: number, info: IUserBriefInfo | null): void {
        _userBriefInfoAccessor.setData(userId, info);
    }

    export async function getUserNickname(userId: number): Promise<string | null> {
        const info = await getUserPublicInfo(userId);
        return info ? info.nickname ?? null : null;
    }
    export async function getUserMrwRankScoreInfo(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserRankInfo.IUserMrwRankInfo | null> {
        return (await getUserPublicInfo(userId))?.userMrwRankInfoArray?.find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount)) ?? null;
    }
    export async function getUserMpwStatisticsData(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserWarStatistics.IUserMpwStatistics | null> {
        return (await getUserPublicInfo(userId))?.userMpwStatisticsArray?.find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount)) ?? null;
    }
    export function getMapRating(mapId: number): number | null {
        return getSelfUserComplexInfo()?.userMapRatingArray?.find(v => v.mapId === mapId)?.rating ?? null;
    }

    function getSelfSettings(): IUserSettings | null {
        return getSelfUserComplexInfo()?.userSettings ?? null;
    }
    export function getSelfSettingsTextureVersion(): Types.UnitAndTileTextureVersion {
        return getSelfSettings()?.unitAndTileTextureVersion ?? Types.UnitAndTileTextureVersion.V0;
    }
    export function getSelfSettingsIsSetPathMode(): boolean {
        return getSelfSettings()?.isSetPathMode ?? false;
    }
    export function getSelfSettingsIsShowGridBorder(): boolean {
        return getSelfSettings()?.isShowGridBorder ?? false;
    }
    export function getSelfSettingsIsAutoScrollMap(): boolean {
        return getSelfSettings()?.isAutoScrollMap ?? true;
    }

    export function getSelfSettingsOpacitySettings(): ProtoTypes.User.IUserOpacitySettings | null {
        return getSelfSettings()?.opacitySettings ?? null;
    }
    export function setSelfSettingsOpacitySettings(opacitySettings: ProtoTypes.User.IUserOpacitySettings): void {
        const selfSettings = getSelfSettings();
        if (selfSettings == null) {
            return;
        }

        selfSettings.opacitySettings = opacitySettings;
        Notify.dispatch(NotifyType.UserSettingsOpacitySettingsChanged);
    }
    export function reqTickSelfSettingsUnitOpacity(): void {
        const unitOpacity = getSelfSettingsOpacitySettings()?.unitOpacity;
        if ((unitOpacity === 100) || (unitOpacity == null)) {
            UserProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 75 } });
        } else if (unitOpacity === 75) {
            UserProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 50 } });
        } else if (unitOpacity === 50) {
            UserProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 0 } });
        } else {
            UserProxy.reqUserSetSettings({ opacitySettings: { unitOpacity: 100 } });
        }
    }
    function mergeSelfSettingsOpacitySettings(newOpacitySettings: ProtoTypes.User.IUserOpacitySettings): void {
        const selfSettings = getSelfSettings();
        if (selfSettings == null) {
            return;
        }

        const currentOpacitySettings = selfSettings.opacitySettings;
        if (currentOpacitySettings == null) {
            selfSettings.opacitySettings = Helpers.deepClone(newOpacitySettings);
        } else {
            currentOpacitySettings.tileBaseOpacity      = newOpacitySettings.tileBaseOpacity ?? currentOpacitySettings.tileBaseOpacity;
            currentOpacitySettings.tileDecoratorOpacity = newOpacitySettings.tileDecoratorOpacity ?? currentOpacitySettings.tileDecoratorOpacity;
            currentOpacitySettings.tileObjectOpacity    = newOpacitySettings.tileObjectOpacity ?? currentOpacitySettings.tileObjectOpacity;
            currentOpacitySettings.unitOpacity          = newOpacitySettings.unitOpacity ?? currentOpacitySettings.unitOpacity;
        }

        Notify.dispatch(NotifyType.UserSettingsOpacitySettingsChanged);
    }

    export function updateOnMsgUserLogin(data: NetMessage.MsgUserLogin.IS): void {
        setIsLoggedIn(true);

        const userSelfInfo = data.userSelfInfo;
        (userSelfInfo) && (setSelfInfo(userSelfInfo));
    }
    export async function updateOnMsgUserGetOnlineState(data: NetMessage.MsgUserGetOnlineState.IS): Promise<void> {
        const userPublicInfo = await getUserPublicInfo(Helpers.getExisted(data.userId));
        if (userPublicInfo) {
            userPublicInfo.isOnline         = data.isOnline;
            userPublicInfo.lastActivityTime = data.lastActivityTime;
        }
    }
    export function updateOnMsgUserSetNickname(data: NetMessage.MsgUserSetNickname.IS): void {
        setSelfNickname(Helpers.getExisted(data.nickname));
    }
    export function updateOnMsgUserSetDiscordId(data: NetMessage.MsgUserSetDiscordId.IS): void {
        setSelfDiscordId(data.discordId ?? null);
    }
    export function updateOnMsgUserSetPrivilege(data: NetMessage.MsgUserSetPrivilege.IS): void {
        if (data.userId === getSelfUserId()) {
            setSelfUserPrivilege(Helpers.getExisted(data.userPrivilege));
        }
    }
    export function updateOnMsgUserSetSettings(data: NetMessage.MsgUserSetSettings.IS): void {
        const selfSettings  = getSelfSettings();
        const newSettings   = data.userSettings;
        if ((selfSettings == null) || (newSettings == null)) {
            return;
        }

        const oldIsShowGridBorder   = getSelfSettingsIsShowGridBorder();
        const oldVersion            = getSelfSettingsTextureVersion();
        const oldIsAutoScrollMap    = getSelfSettingsIsAutoScrollMap();
        (newSettings.isSetPathMode != null)             && (selfSettings.isSetPathMode = newSettings.isSetPathMode);
        (newSettings.isShowGridBorder != null)          && (selfSettings.isShowGridBorder = newSettings.isShowGridBorder);
        (newSettings.unitAndTileTextureVersion != null) && (selfSettings.unitAndTileTextureVersion = newSettings.unitAndTileTextureVersion);
        (newSettings.isAutoScrollMap != null)           && (selfSettings.isAutoScrollMap = newSettings.isAutoScrollMap);
        (newSettings.opacitySettings != null)           && (mergeSelfSettingsOpacitySettings(newSettings.opacitySettings));

        if (oldVersion !== getSelfSettingsTextureVersion()) {
            CommonModel.updateOnUnitAndTileTextureVersionChanged();
            Notify.dispatch(NotifyType.UnitAndTileTextureVersionChanged);
        }
        if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
            Notify.dispatch(NotifyType.UserSettingsIsShowGridBorderChanged);
        }
        if (oldIsAutoScrollMap !== getSelfSettingsIsAutoScrollMap()) {
            Notify.dispatch(NotifyType.UserSettingsIsAutoScrollMapChanged);
        }
    }
    export function updateOnMsgUserSetMapRating(data: NetMessage.MsgUserSetMapRating.IS): void {
        const complexInfo       = Helpers.getExisted(getSelfUserComplexInfo());
        const { mapId, rating } = data;
        if (complexInfo.userMapRatingArray == null) {
            complexInfo.userMapRatingArray = [{
                mapId,
                rating,
            }];
        } else {
            const array = complexInfo.userMapRatingArray;
            const info  = array.find(v => v.mapId === mapId);
            if (info) {
                info.rating = rating;
            } else {
                array.push({
                    mapId,
                    rating,
                });
            }
        }
    }
    export function updateOnMsgUserSetAvatarId(data: NetMessage.MsgUserSetAvatarId.IS): void {
        setSelfAvatarId(Helpers.getExisted(data.avatarId, ClientErrorCode.UserModel_UpdateOnMsgUserSetAvatarId_00));
    }
    export function updateOnMsgUserSetMapEditorAutoSaveTime(data: NetMessage.MsgUserSetMapEditorAutoSaveTime.IS): void {
        setSelfMapEditorAutoSaveTime(data.time ?? null);
    }

    function _onNotifyNetworkDisconnected(): void {
        setIsLoggedIn(false);
    }
    function _onNotifyMsgUserLogout(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogout.IS;
        if (data.reason === Types.LogoutType.SelfRequest) {
            FloatText.show(Lang.getText(LangTextType.A0005));
        } else if (data.reason === Types.LogoutType.LoginCollision) {
            FloatText.show(Lang.getText(LangTextType.A0006));
        } else if (data.reason === Types.LogoutType.NetworkFailure) {
            FloatText.show(Lang.getText(LangTextType.A0013));
        }

        setIsLoggedIn(false);
    }
}

// export default UserModel;
