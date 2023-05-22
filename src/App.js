import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import MetamaskProvider from "./components/metamask";
import Page from "./components/page";
window.Buffer = window.Buffer || require("buffer").Buffer; 

function getLibrary(provider) {
  return new Web3(provider);
}

export default () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <Page />
      </MetamaskProvider>
    </Web3ReactProvider>
  );
};
