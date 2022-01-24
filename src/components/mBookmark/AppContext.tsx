import { ApplicationEntryConfig, BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from "../Entry";
import { BaseHomepageConfig, FeedHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from "../Homepage";
import { MiniEntryGroupType, wallpaperTypes } from '../../utils/constants';
import { createContext, createMemo, createSignal } from 'solid-js';

import type { appConfig } from ".";
import { database } from "../../utils/database";
import { generateUUID } from '../../utils/helpers';
import materialize from "../../utils/materialize";

export const AppContext = createContext();

interface AppContextState {
  appMode: () => AppMode,
  setAppMode: (mode: AppMode) => void,
  userConfig: () => appConfig,
  setUserConfig: (config: appConfig) => void,
  keywords: () => string[],
  getUserSiteConfig: () => SiteConfig,
  setUserSiteConfig: (config: SiteConfig) => void,
  getUserHomepageConfig: () => (BaseHomepageConfig | FeedHomepageConfig | NormalHomepageConfig | WidgetsHomepageConfig)[],
  addEntry: (entry: (BookmarkEntryConfig | BaseEntryConfig | ApplicationEntryConfig), id?: string) => void,
  removeEntry: (id: string) => boolean, // true if removed the whole group, need back to previous screenLayer
  updateEntry: (entry: BookmarkEntryConfig | ApplicationEntryConfig) => void,
  updateMiniGroup: (id: string, miniGroup: Partial<MiniEntryGroupConfig>) => void,
  moveEntryIntoMiniGroup: (id: string, miniGroupId: string) => void,
  createMiniGroupBy2Entry: (id1: string, id2: string) => void,
  reOrderEntries: (id1: string, type: ("before" | "after"), id2: string, groupId?: string) => void,
  moveEntryOutFromMoniGroup: (id: string, index: number) => void
}

export enum AppMode {
  normal,
  edit
}


export interface AppearanceConfig {
  wallpaperUrl: string,
  wallpaperType: wallpaperTypes
}

export interface FeaturesConfig {
  feedPageUrl: string
}
export interface SiteConfig {
  appearance: AppearanceConfig,
  features: FeaturesConfig
}

export function AppProvider(props) {
  const [appMode, setAppMode] = createSignal(AppMode.normal);
  const [userConfig, setUserConfig] = createSignal({
    siteConfig: {} as SiteConfig,
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
  function removeEntryHelper(conf, id: string): (BaseEntryConfig | BookmarkEntryConfig | ApplicationEntryConfig | boolean) {
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
  async function updateUserConfig(cb: CallableFunction) {
    materialize.showLoader();
    let backup = JSON.parse(JSON.stringify(userConfig()));
    let newConfig = cb(JSON.parse(JSON.stringify(userConfig())));
    // try update on gist
    await database.updateData(JSON.stringify(newConfig));
    let updatedConfig = await database.getData();
    if (updatedConfig) {
      materialize.toast({ html: "Successfully saved!", classes: "green" });
      setUserConfig(updatedConfig);
    } else {
      materialize.toast({ html: "Failed to save!", classes: "red" });
    }
    materialize.hideLoader();
  }
  const state: AppContextState = {
    appMode,
    setAppMode,
    userConfig,
    setUserConfig,
    keywords,
    getUserSiteConfig: createMemo(() => userConfig().siteConfig),
    setUserSiteConfig: (config: SiteConfig) => {
      updateUserConfig(oldConfig => {
        oldConfig.siteConfig = {
          ...config
        };
        return JSON.parse(JSON.stringify(oldConfig));
      });
    },
    getUserHomepageConfig: createMemo(() => userConfig().homepages),
    addEntry: (entry: (BaseEntryConfig | BookmarkEntryConfig | ApplicationEntryConfig), id?: string) => {
      updateUserConfig(conf => {
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
      updateUserConfig(conf => {
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
    updateEntry: (entry: BookmarkEntryConfig | ApplicationEntryConfig) => {
      const id = entry.id;
      updateUserConfig(conf => {
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
    updateMiniGroup: (id: string, miniGroup: Partial<MiniEntryGroupConfig>) => {
      updateUserConfig(conf => {
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
      updateUserConfig(conf => {
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
      updateUserConfig(conf => {
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
      updateUserConfig(conf => {
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
      updateUserConfig(conf => {
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