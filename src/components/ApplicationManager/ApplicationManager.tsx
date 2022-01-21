import { ScreenLayerContextState, ScreenLayerManagerContext } from '../ScreenLayerManager/ScreenLayerManager';
import { createContext, createSignal, useContext } from 'solid-js';

import { ApplicationMapper } from '../Application/index';
import { ScreenLayerTypes } from '../../utils/constants';

export const ApplicationManagerContext = createContext();

interface ApplicationData {
  id: string,
  application: CallableFunction
}

export interface ApplicationManagerContextState {
  applications: () => { [id: string]: ApplicationData },
  currentApplication: () => string,
  launchApplication: (id: string) => void,
  killApplication: (id: string) => void
}

export function ApplicationManagerProvider(props) {
  const [applications, setApplications] = createSignal({} as { [id: string]: ApplicationData });
  const [currentApplication, setCurrentApplication] = createSignal(undefined as string);
  const { showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;

  const state: ApplicationManagerContextState = {
    applications,
    currentApplication,
    launchApplication: (id: string) => {
      if (!ApplicationMapper[id]) {
        throw new Error(`Invalid application id: ${id}`);
      }
      setApplications(old => {
        old[id] = {
          id,
          application: ApplicationMapper[id].application
        };
        return old;
      });
      setCurrentApplication(id);
      showLayer({ type: ScreenLayerTypes.applicationPopover });
    },
    killApplication: (id: string) => {
      setApplications(old => {
        old[id] = undefined;
        return old;
      });
    }
  }
  return <ApplicationManagerContext.Provider value={state} children={<></>}>
    {props.children}
  </ApplicationManagerContext.Provider>
}