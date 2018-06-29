
namespace GameUi {
    export const enum LayerType {
        Top,
        Notify,
        Hud,
        Scene,
        Bottom,
    }

    export namespace StageManager {
        // The game is in landscape mode, which means that its design max height equals its design width, 960.
        export const DESIGN_WIDTH         = 960;
        export const DESIGN_MIN_HEIGHT    = 480;
        export const DESIGN_MAX_HEIGHT    = DESIGN_WIDTH;
        export const RATIO_FOR_MIN_HEIGHT = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

        let   stage : egret.Stage;
        const layers: { [layerType: number]: eui.UILayer } = {};

        export function init(stg: egret.Stage): void {
            stage = stg;

            egret.sys.screenAdapter = new ScreenAdapter();
            stage.setContentSize(stage.stageWidth, stage.stageHeight);

            _addLayer(LayerType.Bottom);
            _addLayer(LayerType.Scene);
            _addLayer(LayerType.Hud);
            _addLayer(LayerType.Notify);
            _addLayer(LayerType.Top);
        }

        export function getStage(): egret.Stage {
            return stage;
        }

        export function getLayer(layer: LayerType): eui.UILayer {
            return layers[layer];
        }

        function _addLayer(layerType: LayerType): void {
            egret.assert(!layers[layerType], "LayerManager.addLayer() duplicated layer: " + layerType);
            layers[layerType] = new UiLayer();
            StageManager.getStage().addChild(layers[layerType]);
        }

        class UiLayer extends eui.UILayer {
            public constructor() {
                super();

                this.addEventListener(egret.Event.RESIZE, this._onResize, this);
            }

            private _onResize(e: egret.Event): void {
                const height = StageManager.getStage().stageHeight;
                for (let i = 0; i < this.numChildren; ++i) {
                    const child = this.getChildAt(i);
                    if ((child instanceof Component.UiPanel) && (child.checkIsAutoAdjustHeight())) {
                        child.height = height;
                    }
                }
            }
        }

        class ScreenAdapter implements egret.sys.IScreenAdapter {
            public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
                const currRatio = screenWidth / screenHeight;
                if (currRatio > RATIO_FOR_MIN_HEIGHT) {
                    return {
                        stageWidth: DESIGN_WIDTH,
                        stageHeight: DESIGN_MIN_HEIGHT,
                        displayWidth: screenHeight * RATIO_FOR_MIN_HEIGHT,
                        displayHeight: screenHeight,
                    };
                } else {
                    return {
                        stageWidth: DESIGN_WIDTH,
                        stageHeight: screenHeight / screenWidth * DESIGN_WIDTH,
                        displayWidth: screenWidth,
                        displayHeight: screenHeight,
                    };
                }
            }
        }
    }
}
