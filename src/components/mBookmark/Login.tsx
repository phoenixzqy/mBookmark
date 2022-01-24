import { Button, Col, Input, Row } from "../Materialize";

import { createSignal } from "solid-js"
import { database } from "../../utils/database";

export function Login(props) {
  const { setIsSignedIn } = props;
  const [token, setToken] = createSignal("");
  function onInput(e) {
    setToken(e.target.value);
  }
  function Login() {
    database.setLocalConfig({
      token: token(),
      gistid: ""
    });
    setIsSignedIn(true);
  }
  return <div class="login-container">
    <p class="title">Login with Github Token</p>
    <Row>
      <Col s12>
        <Input onInput={onInput} label="Github Token" value=""></Input>
      </Col>
    </Row>
    <Row style={{ "text-align": "center" }}>
      <Button onClick={Login} style={{ width: "125px" }}>Login</Button>
    </Row>
  </div>
}