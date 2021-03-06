
// import ScrCreateModel       from "../../singleCustomRoom/model/ScrCreateModel";
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSrwWar           from "../../singleRankWar/model/SrwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import SpmModel             from "./SpmModel";
// import SpmSrwRankModel      from "./SpmSrwRankModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace SpmProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;
    import SpwWar           = TwnsSpwWar.SpwWar;
    import SrwWar           = TwnsSrwWar.SrwWar;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgSpmCreateScw,                     callback: _onMsgSpmCreateScw },
            { msgCode: NetMessageCodes.MsgSpmCreateSfw,                     callback: _onMsgSpmCreateSfw },
            { msgCode: NetMessageCodes.MsgSpmCreateSrw,                     callback: _onMsgSpmCreateSrw },
            { msgCode: NetMessageCodes.MsgSpmGetWarSaveSlotFullDataArray,   callback: _onMsgSpmGetWarSaveSlotFullDataArray },
            { msgCode: NetMessageCodes.MsgSpmDeleteWarSaveSlot,             callback: _onMsgSpmDeleteWarSaveSlot },
            { msgCode: NetMessageCodes.MsgSpmSaveScw,                       callback: _onMsgSpmSaveScw },
            { msgCode: NetMessageCodes.MsgSpmSaveSfw,                       callback: _onMsgSpmSaveSfw },
            { msgCode: NetMessageCodes.MsgSpmSaveSrw,                       callback: _onMsgSpmSaveSrw },
            { msgCode: NetMessageCodes.MsgSpmGetRankList,                   callback: _onMsgSpmGetRankList },
            { msgCode: NetMessageCodes.MsgSpmValidateSrw,                   callback: _onMsgSpmValidateSrw },
            { msgCode: NetMessageCodes.MsgSpmGetReplayData,                 callback: _onMsgSpmGetReplayData },
            { msgCode: NetMessageCodes.MsgSpmDeleteAllScoreAndReplay,       callback: _onMsgSpmDeleteAllScoreAndReplay },
        ], null);
    }

    export function reqSpmGetWarSaveSlotFullDataArray(): void {
        NetManager.send({
            MsgSpmGetWarSaveSlotFullDataArray: { c: {} },
        });
    }
    function _onMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
            Notify.dispatch(NotifyType.MsgSpmGetWarSaveSlotFullDataArray, data);
        }
    }

    export function reqSpmCreateScw(param: ScrCreateModel.DataForCreateWar): void {
        NetManager.send({
            MsgSpmCreateScw: { c: param },
        });
    }
    function _onMsgSpmCreateScw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateScw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmCreateScw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateScw, data);
        }
    }

    export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
        slotIndex       : number;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
    }): void {
        NetManager.send({
            MsgSpmCreateSfw: { c: {
                slotIndex,
                slotExtraData,
                warData,
            }, },
        });
    }
    function _onMsgSpmCreateSfw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmCreateSfw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateSfw, data);
        }
    }

    export function reqSpmCreateSrw(data: ProtoTypes.NetMessage.MsgSpmCreateSrw.IC): void {
        NetManager.send({
            MsgSpmCreateSrw: { c: data },
        });
    }
    function _onMsgSpmCreateSrw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSrw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmCreateSrw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateSrw, data);
        }
    }

    export function reqSpmSaveScw(war: SpwWar): void {
        NetManager.send({
            MsgSpmSaveScw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveScw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveScw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmSaveScw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveScw, data);
        }
    }

    export function reqSpmSaveSfw(war: SpwWar): void {
        NetManager.send({
            MsgSpmSaveSfw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveSfw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveSfw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmSaveSfw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveSfw, data);
        }
    }

    export function reqSpmSaveSrw(war: SpwWar): void {
        NetManager.send({
            MsgSpmSaveSrw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveSrw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveSrw.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmSaveSrw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveSrw, data);
        }
    }

    export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
        NetManager.send({
            MsgSpmDeleteWarSaveSlot: { c: {
                slotIndex,
            } },
        });
    }
    function _onMsgSpmDeleteWarSaveSlot(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmDeleteWarSaveSlot.IS;
        if (!data.errorCode) {
            SpmModel.updateOnMsgSpmDeleteWarSaveSlot(Helpers.getExisted(data.slotIndex));
            Notify.dispatch(NotifyType.MsgSpmDeleteWarSaveSlot, data);
        }
    }

    export function reqSpmGetRankList(mapId: number): void {
        NetManager.send({
            MsgSpmGetRankList: { c: {
                mapId,
            } },
        });
    }
    function _onMsgSpmGetRankList(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmGetRankList.IS;
        SpmModel.updateOnMsgSpmGetRankList(data);
        Notify.dispatch(NotifyType.MsgSpmGetRankList, data);
    }

    export function reqSpmValidateSrw(war: SrwWar): void {
        NetManager.send({
            MsgSpmValidateSrw: { c: {
                warData     : war.serializeForValidation(),
            } },
        });
    }
    function _onMsgSpmValidateSrw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmValidateSrw.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgSpmValidateSrw, data);
        }
    }

    export function reqSpmGetReplayData(rankId: number): void {
        NetManager.send({
            MsgSpmGetReplayData: { c: {
                rankId,
            } },
        });
    }
    async function _onMsgSpmGetReplayData(e: egret.Event): Promise<void> {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmGetReplayData.IS;
        await SpmModel.updateOnMsgSpmGetReplayData(data);
        Notify.dispatch(NotifyType.MsgSpmGetReplayData, data);
    }

    export function reqSpmDeleteAllScoreAndReplay(): void {
        NetManager.send({
            MsgSpmDeleteAllScoreAndReplay: { c: {
            } },
        });
    }
    function _onMsgSpmDeleteAllScoreAndReplay(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmDeleteAllScoreAndReplay.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgSpmDeleteAllScoreAndReplay, data);
        }
    }
}

// export default SpmProxy;
