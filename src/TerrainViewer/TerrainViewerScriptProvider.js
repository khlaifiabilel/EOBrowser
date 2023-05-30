import { useState, useEffect } from 'react';

const EOB3D_SCRIPT_SRC = `${process.env.REACT_APP_ROOT_URL}eob3d/eob3d.nocache.js`;

export default function TerrainViewerScriptProvider({ children }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = EOB3D_SCRIPT_SRC;
    document.body.appendChild(script);
    // eslint-disable-next-line
  }, []);

  function on3DInitialized() {
    setScriptLoaded(true);
    window.set3DTheme('EOB');
  }

  window.on3DInitialized = on3DInitialized;
  if (!scriptLoaded) {
    return null;
  }
  return children;
}
