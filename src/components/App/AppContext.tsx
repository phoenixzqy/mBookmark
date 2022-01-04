import { createContext, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import appOptions from "../../config";
import type { appConfig } from ".";
import { BaseHomepageConfig, FeedlyHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from "../Homepage";
import { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from "../Entry";
import { MiniEntryGroupType } from "../../utils/constants";

export const AppContext = createContext();

interface AppContextState {
  appMode: () => AppMode,
  setAppMode: (mode: AppMode) => void,
  options: any,
  setOptions: (any) => void,
  userConfig: appConfig,
  setUserConfig: (any: appConfig) => void,
  getUserSiteconfig: () => any,
  getUserHomepageConfig: () => (BaseHomepageConfig | FeedlyHomepageConfig | NormalHomepageConfig | WidgetsHomepageConfig)[],
  addEntry: (entry: (BookmarkEntryConfig | BaseEntryConfig), id?: string) => void,
  removeEntry: (id: string) => void,
  updateEntry: (id:string, entry: BookmarkEntryConfig) => void,
  updateMiniGroup: (id:string, miniGroup: MiniEntryGroupConfig) => void,
  moveEntryIntoMiniGroup: (id: string, miniGroupId: string, index: number) => void,
  moveEntryOutFromMoniGroup: (id:string, index: number) => void
}

export enum AppMode {
  normal,
  edit
}

export function AppProvider(props) {
  const [appMode, setAppMode] = createSignal(AppMode.normal);
  const [options, setOptions] = createStore(appOptions);
  const [userConfig, setUserConfig] = createStore({
    siteConfig: {},
    homepages: []
  });
  function removeEntryHelper(conf, id: string): (BaseEntryConfig|BookmarkEntryConfig|boolean) {
    for (let i in conf.homepages[1].items) {
      if (conf.homepages[1].items[i].type === MiniEntryGroupType) {
        for (let j in conf.homepages[1].items[i].items) {
          if (id === conf.homepages[1].items[i].items[j].id) {
            return conf.homepages[1].items[i].items.splice(j, 1)[0];
            
          }
        }
      }
      if (id === conf.homepages[1].items[i].id) {
        return conf.homepages[1].items.splice(i, 1)[0];
      }
    }
    return false;
  }
  const state: AppContextState = {
    appMode,
    setAppMode,
    options,
    setOptions,
    userConfig,
    setUserConfig,
    getUserSiteconfig: () => userConfig.siteConfig,
    getUserHomepageConfig: () => userConfig.homepages,
    addEntry: (entry: (BaseEntryConfig | BookmarkEntryConfig), id?: string) => {
        setUserConfig(conf => {
          if (!id) {
            // if id is NOT offered, then add entry to the root.
            conf.homepages[1].items.push(entry);
          } else {
            for (let i in conf.homepages[1].items) {
              if (id === conf.homepages[1].items[i].id && conf.homepages[1].items[i].type === MiniEntryGroupType) {
                conf.homepages[1].items[i].push(entry);
              }
            }
          }
          return conf;
        });
    },
    removeEntry: (id: string) => {
        setUserConfig(conf => {
          removeEntryHelper(conf, id);
          return conf;
        });
    },
    updateEntry: (id: string, entry: BookmarkEntryConfig) => {
      setUserConfig(conf => {
        for (let item of conf.homepages[1].items) {
          if (item.type !== MiniEntryGroupType) {
            if (id === item.id) item = {...item, ...entry};
          } else {
            for (let subItem of item.items) {
              if (id === subItem.id) subItem = {...subItem, ...entry};
            }
          }
        }
        return conf;
      });
    },
    updateMiniGroup: (id: string, miniGroup: MiniEntryGroupConfig) => {
      setUserConfig(conf => {
        for (let item of conf.homepages[1].items) {
          if (item.type === MiniEntryGroupType && id === item.id) {
            item = {...item, ...miniGroup};
          }
        }
        return conf;
      });
    },
    moveEntryIntoMiniGroup: (id: string, miniGroupId: string, index: number) => {
      setUserConfig(conf => {
        let entry = removeEntryHelper(conf, id);
        for (let i in conf.homepages[1].items) {
          if (miniGroupId === conf.homepages[1].items[i].id && conf.homepages[1].items[i].type === MiniEntryGroupType) {
            conf.homepages[1].items[i].items.splice(index, 0, entry);
          }
        }
        return conf;
      });
    },
    moveEntryOutFromMoniGroup: (id:string, index: number) => {
      setUserConfig(conf => {
        let entry = removeEntryHelper(conf, id);
        conf.homepages[1].items.splice(index, 0, entry);
        return conf;
      });
    }
  };

  return <AppContext.Provider value={state} children={<></>}>
      {props.children}
    </AppContext.Provider>
}

export type { AppContextState };