import React, { useState, useEffect} from 'react';
import style from './index.css';


const empty = "about:blank";
function IFrame() {
  const [url, setUrl] = useState(empty);
  
  useEffect(() => {
    function showIframe(event) {
      let target = event.detail.url;
      if (target) {
        setUrl(target);
      }
    }
    function hideIframe() {
      setUrl(empty);
    }
    document.addEventListener("show-iframe", showIframe);
    document.addEventListener("hide-iframe", hideIframe);
    return () => {
      document.removeEventListener("show-iframe", showIframe)
      document.removeEventListener("hide-iframe", hideIframe)
    }
  });

  function isEmpty(url) {
    return url === empty;
  }
  return <iframe
      src={url}
      className={`${style.iframe} ${isEmpty(url) ? null : style.show}`}
      title="3rd party app"
      frameBorder={0} 
      allowFullScreen={true}
    />
}


export default IFrame;
