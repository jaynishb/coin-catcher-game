import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import {isMobile} from 'react-device-detect';
import Web3 from "web3";
import MetamaskProvider from "./components/metamask";
import Page from "./components/page";
window.Buffer = window.Buffer || require("buffer").Buffer; 


function getLibrary(provider) {
  return new Web3(provider);
}

export default () => {

  useEffect(() => {
    if (isMobile) {
      window?.screen?.orientation?.lock('landscape-primary')
    }
    document.onselectstart = new Function('return false');
  }, [])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <Page />
      </MetamaskProvider>
    </Web3ReactProvider>
  );
};
