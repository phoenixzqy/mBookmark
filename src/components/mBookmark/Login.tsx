import { Button, Col, Input, Row } from "../Materialize";

import CryptoJS from "crypto-js";
import { createSignal } from "solid-js"
import { database } from "../../utils/database";
import materialize from "../../utils/materialize";

export function Login(props) {
  const { setIsSignedIn } = props;
  const [token, setToken] = createSignal("");
  const [secret, setSecret] = createSignal("");
  const onInput = name => e => {
    switch (name) {
      case "token":
        setToken(e.target.value);
        break;
      case "secret":
        setSecret(e.target.value);
        break;
      default:
      // nothing
    }
  }
  function Login() {
    if (token() === "" || secret() === "") {
      materialize.toast({ html: "Error: Both token and secret are required!", classes: "red" });
      return;
    }
    database.setLocalConfig({
      token: token(),
      gistid: "",
      secret: CryptoJS.MD5(secret()).toString()
    });
    setIsSignedIn(true); // this will trigger signin action
  }
  return <div class="login-container">
    <p class="title">Login with Github Token</p>
    <Row>
      <Col s12>
        <Input onInput={onInput("token")} label="* Github Token" value=""></Input>
        <Input type="password" onInput={onInput("secret")} label="* Encrypt Secret" value=""></Input>
      </Col>
    </Row>
    <Row style={{ "text-align": "center" }}>
      <Button onClick={Login} style={{ width: "125px" }}>Login</Button>
    </Row>
  </div>
}