
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace.LeaderboardProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetTopDataArray,  callback: _onMsgLbSpmOverallGetTopDataArray, },
            { msgCode: NetMessageCodes.MsgLbSpmOverallGetSingleData,    callback: _onMsgLbSpmOverallGetSingleData, },
        ]);
    }

    export function reqLbSpmOverallGetTopDataArray(): void {
        NetManager.send({ MsgLbSpmOverallGetTopDataArray: { c: {
        } } });
    }
    function _onMsgLbSpmOverallGetTopDataArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetTopDataArray.IS;
        if (!data.errorCode) {
            LeaderboardModel.setSpmOverallTopDataArray(data.dataArray ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetTopDataArray, data);
        }
    }

    export function reqLbSpmOverallGetSingleData(userId: number): void {
        NetManager.send({ MsgLbSpmOverallGetSingleData: { c: {
            userId,
        } } });
    }
    function _onMsgLbSpmOverallGetSingleData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgLbSpmOverallGetSingleData.IS;
        if (!data.errorCode) {
            LeaderboardModel.setSpmOverallSingleData(Helpers.getExisted(data.userId), data.data ?? null);
            Notify.dispatch(NotifyType.MsgLbSpmOverallGetTopDataArray, data);
        }
    }
}
