import { AppContext, AppContextState } from '../../mBookmark/AppContext';
import { Button, Col, Input, Row, Select } from "../../Materialize";
import { createMemo, createSignal, useContext } from 'solid-js';

import CryptoJS from "crypto-js";
import { database } from '../../../utils/database';
import materialize from "../../../utils/materialize";
import { wallpaperTypes } from '../../../utils/constants';

interface PasswordData {
  old: string;
  new1: string;
  new2: string;
}

export function SettingsApp(props) {
  const [showResetPassword, setShowResetPassword] = createSignal(false);
  const { getUserSiteConfig, setUserSiteConfig } = useContext(AppContext) as AppContextState;
  const [data, setData] = createSignal(getUserSiteConfig());
  const [passwordData, setPasswordData] = createSignal({
    old: "",
    new1: "",
    new2: ""
  } as PasswordData);
  const token = createMemo(() => {
    let token = database.getToken();
    if (!token) return "";
    return token.substring(0, 5) + "*".repeat(20) + token.substring(token.length - 5, token.length);
  })
  const updateData = (name: string) => (e: any) => {
    let value;
    const names = name.split(".");
    if (names[1] === "wallpaperType") {
      value = e;
    } else {
      value = (e.target as HTMLInputElement).value;
    }
    setData(prev => {
      prev[names[0]][names[1]] = value;
      return prev;
    });
  }
  const saveChanges = () => {
    setUserSiteConfig(data());
  }
  const logout = () => {
    database.clearLocalConfig();
    document.location.reload();
  }
  const updatePasswordData = (name: string) => (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    setPasswordData(data => {
      data[name] = value;
      return data;
    });
  }
  const CancelChangePassword = () => {
    setShowResetPassword(false);
  }
  const changePassword = () => {
    const newPWData = passwordData();
    if (!newPWData.old || !newPWData.new1 || !newPWData.new2) {
      materialize.toast({ html: "Error: Please fill all fields!", classes: "red" });
      return;
    } else if (newPWData.new1 !== newPWData.new2) {
      materialize.toast({ html: "Error: 2 new secrets are not match, please confirm your inputs!", classes: "red" });
      return;
    } else if (CryptoJS.MD5(newPWData.old).toString() !== database.getSecret()) {
      materialize.toast({ html: "Error: The old secret is incorrect, please retry!", classes: "red" });
      return;
    } else {
      // update and re-encrypt data
      database.setLocalConfig({
        ...database.getLocalConfig(),
        secret: CryptoJS.MD5(newPWData.new1).toString()
      });
      saveChanges();
      // logout
      logout();
    }
  }
  return <>
    <div class="settings-app-wrapper" style={{ display: showResetPassword() ? "none" : "inherit" }}>
      <Row>
        <h4 style={{ "font-weight": "bold" }}>Settings</h4>
        <Col s12>
          <Row>
            <h5>Account</h5>
            <Col s10>
              <Input disabled={true} value={token()} label="Github Token" />
            </Col>
            <Col s2>
              <Button
                onClick={logout}
                icon="exit_to_app"
                className="btn-floating"
                style={{
                  "background-color": "rgb(234 85 85)",
                  "top": "7.5px"
                }}
              ></Button>
            </Col>
            <Col s12 style={{ display: "flex", "justify-content": "center", "margin-bottom": "20px" }}>
              <Button onClick={() => { setShowResetPassword(true) }} icon="lock">Reset Secret</Button>
            </Col>
            <h5>Appearance</h5>
            <Col s12>
              <Select
                label="Wallpaper Type"
                onSelected={updateData("appearance.wallpaperType")}
                options={[
                  {
                    value: wallpaperTypes.image,
                    selected: wallpaperTypes.image === data().appearance.wallpaperType,
                    display: wallpaperTypes.image.toUpperCase()
                  },
                  {
                    value: wallpaperTypes.video,
                    selected: wallpaperTypes.video === data().appearance.wallpaperType,
                    display: wallpaperTypes.video.toUpperCase()
                  }
                ]}
              />
            </Col>
            <Col s12>
              <Input onChange={updateData("appearance.wallpaperUrl")} label="Wallpaper Url" value={data().appearance.wallpaperUrl} maxlength="2000" helperText="Max length: 2000"></Input>
            </Col>
            <h5>Feature</h5>
            <Col s12>
              <Input onChange={updateData("features.feedPageUrl")} label="Feed Page Url" value={data().features.feedPageUrl} maxlength="2000" helperText="Max length: 2000"></Input>
            </Col>
          </Row>
          <Row className="submit-button" style={{ "text-align": "center" }}>
            <Button onClick={saveChanges} icon="save">Save Changes</Button>
          </Row>
        </Col>
      </Row>
    </div>
    {/** reset password window. */}
    <div class="settings-app-wrapper" style={{ display: !showResetPassword() ? "none" : "inherit" }}>
      <Row>
        <h4 style={{ "font-weight": "bold" }}>Reset Secret</h4>
        <Col s12>
          <Row>
            <h5>Old Secret</h5>
            <Col s12>
              <Input onChange={updatePasswordData("old")} label="* Current Secret" value={passwordData().old} maxlength="30" helperText="Max length: 30" type="password"></Input>
            </Col>
            <h5>New Secret</h5>
            <Col s12>
              <Input onChange={updatePasswordData("new1")} label="* New Secret" value={passwordData().new1} maxlength="30" helperText="Max length: 30" type="password"></Input>
            </Col>
            <Col s12>
              <Input onChange={updatePasswordData("new2")} label="* Confirm New Secret" value={passwordData().new2} maxlength="30" helperText="Max length: 30" type="password"></Input>
            </Col>
          </Row>
          <Row className="submit-button" style={{ "text-align": "center" }}>
            <Button onClick={changePassword} icon="save">Change</Button>
            <Button onClick={CancelChangePassword} icon="cancel" style={{ "background-color": "#ef5350", "margin-left": "15px" }}>Cancel</Button>
          </Row>
        </Col>
      </Row>
    </div>
  </>
}