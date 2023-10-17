import { App, Octokit } from "https://esm.sh/octokit?dts";

import CryptoJS from "crypto-js";
import { appConfig } from "../components/mBookmark";
import defaultData from "./defaultData.json";

// import {Octokit }

export interface LocalConfig {
  token: string;
  gistid: string;
  secret: string;
}
// NOTE: ignoring irrelevant attributes
export interface Gist {
  id: string;
  description: string;
  files: any;
}

const GIST_DB_NAME = "mbookmark_gist_database";
const MAX_GISTS_PER_PAGE = 100;

class Database {
  private octokit;

  constructor() {
    const token = this.getToken();
    if (token) {
      this.octokit = new Octokit({ auth: token });
    }
  }
  public getLocalConfig(): LocalConfig {
    let config = window.localStorage.getItem("localConfig");
    if (!config) {
      config = JSON.stringify({
        token: "",
        gistid: "",
        secret: ""
      });
      // 1st time user, setup default config
      window.localStorage.setItem("localConfig", config);
    }
    return JSON.parse(config);
  }
  public initLocalConfig(): void {
    this.setLocalConfig({
      token: "",
      secret: "",
      gistid: ""
    });
  }
  public setLocalConfig(config: LocalConfig) {
    window.localStorage.setItem("localConfig", JSON.stringify(config));
    if (config.token) {
      this.octokit = new Octokit({ auth: config.token });
    }
  }
  public clearLocalConfig() {
    window.localStorage.removeItem("localConfig");
  }
  public getToken(): string {
    return this.getLocalConfig().token;
  }
  public getSecret(): string {
    return this.getLocalConfig().secret;
  }

  /**
   * 0. if gistId is set, getch data directedly 
   * 1. fetch all gists an try to find mbm db file
   * 2. if not found, upload a default version.
   */
  public async initData(): Promise<appConfig> {
    if (this.getGistId()) {
      return this.getData();
    }
    let page = 1;
    let cuurrentpageCount = MAX_GISTS_PER_PAGE;
    while (cuurrentpageCount >= MAX_GISTS_PER_PAGE) {
      let response = await this.getGists(page++);
      let gists = response.data as Gist[];
      cuurrentpageCount = gists.length;
      // loop to find data
      for (let i = 0; i < gists.length; i++) {
        let files = Object.keys(gists[i].files);
        if (files.includes(GIST_DB_NAME)) {
          // found
          let gist = (await this.getGist(gists[i].id)).data;
          this.setLocalConfig({
            token: this.getToken(),
            gistid: gist.id,
            secret: this.getSecret()
          });
          return JSON.parse(this.decrypt(gist.files[GIST_DB_NAME].content));
        }
      }
    }
    // not found, then upload a default version
    let response = await this.createGist(
      {
        [GIST_DB_NAME]: {
          filename: GIST_DB_NAME,
          content: this.encrypt(JSON.stringify(defaultData))
        }
      },
      "This is the mBookmark database file"
    );
    const gist = response.data as Gist;
    this.setLocalConfig({
      token: this.getToken(),
      gistid: gist.id,
      secret: this.getSecret()
    });
    return JSON.parse(this.decrypt(gist.files[GIST_DB_NAME].content));
  }

  public async getData(): Promise<appConfig> {
    let { data } = await this.getGist(this.getGistId());
    return JSON.parse(this.decrypt(data.files[GIST_DB_NAME].content));
  }

  public async updateData(content: string): Promise<void> {
    await this.updateGist(this.getGistId(), {
      [GIST_DB_NAME]: {
        content: this.encrypt(content)
      }
    })
  }

  public async deleteData(): Promise<void> {
    await this.deleteGist(this.getGistId());
  }

  private getGistId(): string {
    return this.getLocalConfig().gistid;
  }

  private async getGists(page: number = 1): Promise<any> {
    return this.octokit.request('GET /gists', {
      per_page: MAX_GISTS_PER_PAGE,
      page
    });
  }

  private async getGist(id: string): Promise<any> {
    return this.octokit.request('GET /gists/{gist_id}', {
      gist_id: id
    });
  }

  private async createGist(files: { [name: string]: any }, description?: string, isPublic?: boolean): Promise<any> {
    return this.octokit.request('POST /gists', {
      description: description || "",
      files,
      public: isPublic || false
    })
  }

  private async updateGist(id: string, files: { [name: string]: any }, description?: string): Promise<any> {
    return this.octokit.request('PATCH /gists/{gist_id}', {
      gist_id: id,
      description,
      files
    })
  }

  private async deleteGist(id: string): Promise<any> {
    return this.octokit.request('DELETE /gists/{gist_id}', {
      gist_id: id
    })
  }

  private encrypt(content: string) {
    return CryptoJS.AES.encrypt(content, this.getSecret()).toString();
  }

  private decrypt(content: string) {
    return CryptoJS.AES.decrypt(content, this.getSecret()).toString(CryptoJS.enc.Utf8);
  }
}

const database = new Database();
export { database };