
namespace TinyWars.BaseWar {
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import ClientErrorCode      = Utility.ClientErrorCode;
    import ISerialPlayerManager = ProtoTypes.WarSerialization.ISerialPlayerManager;

    export class BwDrawVoteManager {
        private _remainingVotes : number | null | undefined;
        private _war?           : BwWar;

        public init(playerManagerData: ISerialPlayerManager | null | undefined, remainingVotes: number | null | undefined): ClientErrorCode {
            if (remainingVotes == null) {
                this.setRemainingVotes(remainingVotes);
            } else {
                let maxVotes = 0;
                for (const playerData of playerManagerData ? playerManagerData.players || [] : []) {
                    if (BwHelpers.checkCanVoteForDraw({
                        playerIndex : playerData.playerIndex,
                        aliveState  : playerData.aliveState,
                    })) {
                        ++maxVotes;
                    }
                }
                if (remainingVotes >= maxVotes) {
                    return ClientErrorCode.BwDrawVoteManagerInit000;
                }
            }

            return ClientErrorCode.NoError;
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        public setRemainingVotes(votes: number | undefined | null): void {
            this._remainingVotes = votes;
        }
        public getRemainingVotes(): number | undefined | null {
            return this._remainingVotes;
        }

        public getMaxVotes(): number | undefined {
            const war = this._getWar();
            if (war == null) {
                Logger.log(`BwDrawVoteManager.getMaxVotes() empty war.`);
                return undefined;
            }

            let maxVotes = 0;
            war.getPlayerManager().forEachPlayer(false, player => {
                if (player.checkCanVoteForDraw()) {
                    ++maxVotes;
                }
            });

            return maxVotes;
        }

        public checkIsDraw(): boolean {
            return this.getRemainingVotes() === 0;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar | null | undefined {
            return this._war;
        }
    }
}
