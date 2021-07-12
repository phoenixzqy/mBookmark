import React from 'react';
import style from './index.css';

const RECENT_VISITS = "recentvisits";

function Href({data}) {
  return (
    <div
      className={style.href}
      onClick={() => {
        let recentVisits = window.localStorage.getItem(RECENT_VISITS);
        if (!recentVisits) {
          recentVisits = {
            title: "Recent Visits",
            icon: "",
            apps: []
          }
        } else {
          recentVisits = JSON.parse(recentVisits, true);
        }
        for (let i = 0; i <= recentVisits.apps.length; i++) {
          if (i === recentVisits.apps.length) {
            // add new
            recentVisits.apps.push({
              ...data,
              count: 1,
            });
            break;
          } else if (recentVisits.apps[i].url === data.url) {
            recentVisits.apps[i].count = recentVisits.apps[i].count ? recentVisits.apps[i].count + 1 : 1;
            break;
          }
        }
        // sort visited by counts;
        recentVisits.apps = recentVisits.apps.sort((a, b) => {
          if (a.count > b.count) return -1;
          if (a.count < b.count) return 1;
          return 0;
        });
        window.localStorage.setItem(RECENT_VISITS, JSON.stringify(recentVisits));
        // show loading cover
        window.document.querySelector(".loading-container").style.display = "grid";
        // simulate the loading process in .5 sec
        setTimeout(() => {
          window.location.href = data.url;
          window.document.querySelector(".loading-container").style.display = "none";
        }, 500);
      }}
    >
      <div 
        className={style.icon} 
        style={{
          backgroundImage: `url("${data.icon}")`
        }}
      />
      <div className={style.title}>
        {data.name}{data.count ? `[${data.count}]` : null}
      </div>
    </div>
  )
}


export default Href;

