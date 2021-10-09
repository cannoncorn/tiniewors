
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsBwRandomNumberManager {
    import ISeedRandomState = ProtoTypes.Structure.ISeedRandomState;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class BwRandomNumberManager {
        private _isNeedReplay?              : boolean;
        private _seedRandomInitialState?    : ProtoTypes.Structure.ISeedRandomState | null;
        private _randomNumberGenerator?     : seedrandom.prng | null;

        public init({ isNeedSeedRandom, initialState, currentState }: {
            isNeedSeedRandom: boolean;
            initialState    : Types.Undefinable<ISeedRandomState>;
            currentState    : Types.Undefinable<ISeedRandomState>;
        }): void {
            this._setIsNeedReplay(isNeedSeedRandom);

            if (isNeedSeedRandom) {
                // TODO: check if the states are valid.
                if (initialState == null) {
                    throw Helpers.newError(`Empty initialState.`);
                }
                this._setSeedRandomInitialState(initialState);

                if (currentState == null) {
                    throw Helpers.newError(`Empty currentState.`);
                }
                this._setRandomNumberGenerator(new Math.seedrandom("", { state: currentState }));
            }
        }

        private _setIsNeedReplay(isNeedReplay: boolean): void {
            this._isNeedReplay = isNeedReplay;
        }
        private _getIsNeedReplay(): boolean {
            return Helpers.getExisted(this._isNeedReplay);
        }

        private _setRandomNumberGenerator(generator: seedrandom.prng): void {
            this._randomNumberGenerator = generator;
        }
        private _getRandomNumberGenerator(): seedrandom.prng | null {
            return Helpers.getDefined(this._randomNumberGenerator, ClientErrorCode.BwRandomNumberManager_GetRandomNumberGenerator_00);
        }

        public getRandomNumber(): number {
            if (!this._getIsNeedReplay()) {
                return Math.random();
            }

            return Helpers.getExisted(this._getRandomNumberGenerator())();
        }

        public getSeedRandomCurrentState(): ProtoTypes.Structure.ISeedRandomState {
            return Helpers.getExisted(this._getRandomNumberGenerator()).state();
        }

        private _setSeedRandomInitialState(state: ProtoTypes.Structure.ISeedRandomState): void {
            this._seedRandomInitialState = state;
        }
        public getSeedRandomInitialState(): ProtoTypes.Structure.ISeedRandomState | null {
            return Helpers.getDefined(this._seedRandomInitialState, ClientErrorCode.BwRandomNumberManager_GetSeedRandomInitialState_00);
        }
    }
}

// export default TwnsBwRandomNumberManager;
