import { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from "../Entry";
import { BaseHomepageConfig, FeedlyHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from "../Homepage";
import { EntryTypes, MiniEntryGroupType } from '../../utils/constants';
import { createContext, createMemo, createSignal } from 'solid-js';

import type { appConfig } from ".";
import appOptions from "../../config";
import { generateUUID } from '../../utils/helpers';

export const AppContext = createContext();

interface AppContextState {
  appMode: () => AppMode,
  setAppMode: (mode: AppMode) => void,
  settings: () => any,
  updateSettings: (any) => void,
  userConfig: () => appConfig,
  setUserConfig: (any: appConfig) => void,
  keywords: () => string[],
  getUserSiteconfig: () => any,
  getUserHomepageConfig: () => (BaseHomepageConfig | FeedlyHomepageConfig | NormalHomepageConfig | WidgetsHomepageConfig)[],
  addEntry: (entry: (BookmarkEntryConfig | BaseEntryConfig), id?: string) => void,
  removeEntry: (id: string) => boolean, // true if removed the whole group, need back to previous screenLayer
  updateEntry: (entry: BookmarkEntryConfig) => void,
  updateMiniGroup: (id: string, miniGroup: MiniEntryGroupConfig) => void,
  moveEntryIntoMiniGroup: (id: string, miniGroupId: string) => void,
  createMiniGroupBy2Entry: (id1: string, id2: string) => void,
  reOrderEntries: (id1: string, type: ("before" | "after"), id2: string, groupId?: string) => void,
  moveEntryOutFromMoniGroup: (id: string, index: number) => void
}

export enum AppMode {
  normal,
  edit
}

export function AppProvider(props) {
  const [appMode, setAppMode] = createSignal(AppMode.normal);
  const [settings, updateSettings] = createSignal(appOptions);
  const [userConfig, setUserConfig] = createSignal({
    siteConfig: {},
    homepages: []
  });
  const keywords = createMemo(() => {
    const items = userConfig().homepages[1]?.items || [];
    let myKeywords: string[] = [];
    for (let i in items) {
      if (items[i].type === MiniEntryGroupType) {
        for (let j in items[i].items) {
          myKeywords = myKeywords.concat(items[i].items[j].keywords || []);
        }
      } else {
        myKeywords = myKeywords.concat(items[i].keywords || []);
      }
    }
    return myKeywords;
  });
  function removeEntryHelper(conf, id: string): (BaseEntryConfig | BookmarkEntryConfig | boolean) {
    let items = conf.homepages[1].items;
    for (let i in items) {
      if (items[i].type === MiniEntryGroupType) {
        for (let j in items[i].items) {
          if (id === items[i].items[j].id) {
            let entry = items[i].items.splice(j, 1)[0];
            // remove emptry group
            if (items[i].items.length === 0) {
              items.splice(i, 1);
            }
            return entry;
          }
        }
      }
      if (id === items[i].id) {
        return items.splice(i, 1)[0];
      }
    }
    return false;
  }
  const state: AppContextState = {
    appMode,
    setAppMode,
    settings,
    updateSettings,
    userConfig,
    setUserConfig,
    keywords,
    getUserSiteconfig: createMemo(() => userConfig().siteConfig),
    getUserHomepageConfig: createMemo(() => userConfig().homepages),
    addEntry: (entry: (BaseEntryConfig | BookmarkEntryConfig), id?: string) => {
      setUserConfig(conf => {
        const items = conf.homepages[1].items;
        if (!id) {
          // if id is NOT offered, then add entry to the root.
          items.push(entry);
        } else {
          for (let i in items) {
            if (id === items[i].id && items[i].type === MiniEntryGroupType) {
              items[i].items.push(entry);
            }
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    removeEntry: (id: string) => {
      let removeGroup = false;
      setUserConfig(conf => {
        removeEntryHelper(conf, id);
        // remove empty entryGroup
        let items = conf.homepages[1].items;
        for (let i = items.length - 1; i >= 0; i--) {
          if (items[i].type === MiniEntryGroupType && items[i].items.length === 0) {
            items.splice(i, 1);
            removeGroup = true;
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
      return removeGroup;
    },
    updateEntry: (entry: BookmarkEntryConfig) => {
      const id = entry.id;
      setUserConfig(conf => {
        let items = conf.homepages[1].items;
        for (let i in items) {
          if (items[i].type !== MiniEntryGroupType) {
            if (id === items[i].id) items[i] = { ...items[i], ...entry };
          } else {
            for (let j in items[i].items) {
              if (id === items[i].items[j].id) items[i].items[j] = { ...items[i].items[j], ...entry };
            }
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    updateMiniGroup: (id: string, miniGroup: MiniEntryGroupConfig) => {
      setUserConfig(conf => {
        let items = conf.homepages[1].items;
        for (let i in items) {
          if (items[i].type === MiniEntryGroupType && id === items[i].id) {
            items[i] = { ...items[i], ...miniGroup };
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    moveEntryIntoMiniGroup: (id: string, miniGroupId: string) => {
      setUserConfig(conf => {
        let entry = removeEntryHelper(conf, id);
        let items = conf.homepages[1].items;
        for (let i in items) {
          if (miniGroupId === items[i].id && items[i].type === MiniEntryGroupType) {
            items[i].items.push(entry);
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    createMiniGroupBy2Entry: (putId: string, intoId: string) => {
      setUserConfig(conf => {
        let putEntry = removeEntryHelper(conf, putId);
        let items = conf.homepages[1].items;
        for (let i in items) {
          if (items[i].id === intoId && items[i].type !== MiniEntryGroupType) {
            const intoEntry = items[i];
            items[i] = {
              id: generateUUID(),
              type: MiniEntryGroupType,
              name: "new group",
              items: [intoEntry, putEntry]
            } as MiniEntryGroupConfig;
            break;
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    reOrderEntries: (id1: string, type: ("before" | "after"), id2: string, groupId?: string) => {
      setUserConfig(conf => {
        let items = conf.homepages[1].items;
        if (groupId) {
          loop1: for (let i in items) {
            if (items[i].type !== MiniEntryGroupType || items[i].id !== groupId) continue;
            // if user tries to remove the last item in group and add it back to previous group, do nothing
            if (id2 === "last") {
              if (items[i].items.length > 1) {
                items[i].items.push(removeEntryHelper(conf, id1));
              }
              break;
            } else {
              for (let j in items[i].items) {
                if (items[i].items[j].id === id2) {
                  items[i].items.splice(type === "before" ? j : ~~j + 1, 0, removeEntryHelper(conf, id1));
                  break loop1;
                }
              }
            }
          }
        } else {
          if (id2 === "last") {
            items.push(removeEntryHelper(conf, id1));
          } else {
            for (let i in items) {
              if (items[i].id === id2) {
                items.splice(type === "before" ? i : ~~i + 1, 0, removeEntryHelper(conf, id1));
                break;
              }
            }
          }
        }
        return JSON.parse(JSON.stringify(conf));
      });
    },
    moveEntryOutFromMoniGroup: (id: string, index: number) => {
      setUserConfig(conf => {
        let entry = removeEntryHelper(conf, id);
        if (index >= 0) {
          conf.homepages[1].items.splice(index, 0, entry);
        } else {
          conf.homepages[1].items.push(entry);
        }
        return JSON.parse(JSON.stringify(conf));
      });
    }
  };

  return <AppContext.Provider value={state} children={<></>}>
    {props.children}
  </AppContext.Provider>
}

export type { AppContextState };