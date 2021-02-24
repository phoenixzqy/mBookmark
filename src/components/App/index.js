import React from 'react';
import style from './index.css';
import { apps } from '../../config.js';
import Category from '../Category/index';
import IFrame from '../IFrame/index';
function App() {
  return (
    <div className={ style.app }>
      { Object.keys(apps).map(key => <Category key={key} data={apps[key]} />)}
      <IFrame />
      <div style={{
        display: "block",
        minHeight: 50,
        width: "100vw"
      }} > &nbsp;</div>
    </div>
  );
}

export default App;
