import React, { useEffect, useState } from 'react';
import style from './index.css';
import { apps } from '../../config.js';
import Category from '../Category/index';

const RECENT_VISITS = "recentvisits";

function App() {
  const [recentVisits] = useState(window.localStorage.getItem(RECENT_VISITS));
  const [appList, setAppList] = useState(apps);
  useEffect(() => {
    if (recentVisits) {
      setAppList({
        rencentVisits: JSON.parse(recentVisits, true),
        ...apps,
      })
    }
  }, [recentVisits]);
  return (
    <div className={ style.app }>
      { Object.keys(appList).map(key => <Category key={key} data={appList[key]}/>)}
      <div style={{
        display: "block",
        minHeight: 50,
        width: "100vw"
      }} > &nbsp;</div>
    </div>
  );
}

export default App;
