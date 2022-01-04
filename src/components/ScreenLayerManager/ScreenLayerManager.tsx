import { createContext, createSignal } from "solid-js";
import { ScreenLayerTypes } from "../../utils/constants";

export const ScreenLayerManagerContext = createContext();

interface ScreenLayerData {
  type: ScreenLayerTypes,
  ref?: any,
  data?: any,
  show?: CallableFunction,
  hide?: CallableFunction
}

interface ScreenLayerContextState {
  register: (screen: ScreenLayerData) => void,
  layers: () => { ScreenLayerTypes: ScreenLayerData},
  currentScreenLayer: () => ScreenLayerData,
  showLayer: (screen: ScreenLayerData) => void,
  backToPrevLayer: () => void,
  goToNextLayer: () => void 
}

const defaultScreenLayer: ScreenLayerData = {
  type: ScreenLayerTypes.homepage
};

export function ScreenLayerManagerProvider(props) {
  const [history, setHistory] = createSignal([] as ScreenLayerData[]);
  const [histroyIndex, setHistoryIndex] = createSignal(0); // indicate the position of current screen layer in history list
  const [layers, setLayers] = createSignal({} as { ScreenLayerTypes: ScreenLayerData});
  const [currentScreenLayer, setCurrentScreenLayer] = createSignal(defaultScreenLayer);

  function showLayerHook(screen: ScreenLayerData) {
    if (screen.show) { screen.show(); } 
    else if (screen.ref) {
      const refElement = screen.ref as HTMLElement;
      refElement.classList.remove("screen-layer-hide");
      refElement.classList.add("screen-layer-show");
    }
  }
  function hideLayerHook(screen: ScreenLayerData) {
    if (screen.hide) { screen.hide(); } 
    if (screen.ref) {
      const refElement = screen.ref as HTMLElement;
      refElement.classList.remove("screen-layer-show");
      refElement.classList.add("screen-layer-hide");
    }
  }
  function validateLayer(screen: ScreenLayerData) {
    return layers()[screen.type] !== undefined;
  }

  const state: ScreenLayerContextState = {
    currentScreenLayer,
    layers,
    register: (screen) => {
      if (!layers()[screen.type]) {
        if (screen.type !== defaultScreenLayer.type) hideLayerHook(screen);
        else {
          setHistory(prev => {
            prev.push(screen);
            return prev;
          });
          setCurrentScreenLayer(screen);
        }
        setLayers(prev => {
          prev[screen.type] = screen;
          return prev;
        });
      }
    },
    showLayer( screen ) {
      if (!validateLayer(screen)) {
        console.error(`invalid/unregistered screen type: ${JSON.stringify(screen)}`);
        return;
      }
      if (currentScreenLayer().type === screen.type) return;
      hideLayerHook(currentScreenLayer());
      const newScreenLayer: ScreenLayerData = { ...layers()[screen.type], ...screen};
      if (histroyIndex() === history().length - 1) {
        setHistory(prev => {
          prev.push(newScreenLayer);
          return prev;
        });
      } else {
        setHistory(prev => {
          prev.length = histroyIndex() + 1; // remove all the rest
          prev.push(newScreenLayer);
          return prev;
        });
      }
      setHistoryIndex(histroyIndex() + 1);
      setCurrentScreenLayer(newScreenLayer);
      // cache current data for each layers
      setLayers(prev => {
        prev[newScreenLayer.type] = newScreenLayer;
        return prev;
      })
      showLayerHook(newScreenLayer);
    },
    backToPrevLayer: () => {
      if (histroyIndex() === 0) return; // must keep at lease 1 screen layer shown
      setCurrentScreenLayer(prev => {
        hideLayerHook(prev);
        const next = history()[histroyIndex() - 1];
        showLayerHook(next);
        return next;
      });
      setHistoryIndex(histroyIndex() - 1);
    },
    goToNextLayer: () => {
      if (histroyIndex() === history().length - 1) return; // no next
      setCurrentScreenLayer(prev => {
        hideLayerHook(prev);
        const next = history()[histroyIndex() + 1];
        showLayerHook(next);
        return next;
      });
      setHistoryIndex(histroyIndex() + 1);
    }
  }
  return <ScreenLayerManagerContext.Provider value={state} children={<></>}>
    {props.children}
  </ScreenLayerManagerContext.Provider>
}


export type { ScreenLayerContextState, ScreenLayerData};