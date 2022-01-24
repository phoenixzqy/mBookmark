import { AppContext, AppContextState } from '../../mBookmark/AppContext';
import { Button, Col, Input, Row, Select } from "../../Materialize";
import { createSignal, useContext } from 'solid-js';

import { wallpaperTypes } from '../../../utils/constants';

export function SettingsApp(props) {
  const { getUserSiteConfig, setUserSiteConfig } = useContext(AppContext) as AppContextState;
  const [data, setData] = createSignal(getUserSiteConfig());
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
  return <div class="settings-app-wrapper">
    <Row>
      <h4 style={{ "font-weight": "bold" }}>Settings</h4>
      <Col s12>
        <Row>
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
            <Input onChange={updateData("appearance.wallpaperUrl")} label="Wallpaper Url" value={data().appearance.wallpaperUrl}></Input>
          </Col>
          <h5>Feature</h5>
          <Col s12>
            <Input onChange={updateData("features.feedPageUrl")} label="Feed Page Url" value={data().features.feedPageUrl}></Input>
          </Col>
        </Row>
        <Row className="submit-button" style={{ "text-align": "center" }}>
          <Button onClick={saveChanges} icon="save">Save Changes</Button>
        </Row>
      </Col>
    </Row>
  </div>
}