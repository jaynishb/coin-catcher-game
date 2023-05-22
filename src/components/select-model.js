import { useWeb3React } from "@web3-react/core";
import { connectors } from "../wallet/Connector";
import { Modal } from "./model";

export default function SelectWalletModal({ isOpen, onClose }) {
  const { activate } = useWeb3React();

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  const activateProvider = (provider) => {
    setTimeout(() => {
        activate(provider)
    }, 2000)
  }

  return (
    <Modal title={'Select wallet to connect'} isOpen={isOpen} onClose={onClose} isCentered>
        <div className="flex flex-col items-center w-full">
      <button
        className=""
        variant="outline"
        onClick={() => {
          activateProvider(connectors.coinbaseWallet);
          setProvider("coinbaseWallet");
          onClose();
        }}
        w="100%"
      >
        <div w="100%" justifyContent="center">
          <image
            src="/cbw.png"
            alt="Coinbase Wallet Logo"
            width={25}
            height={25}
            borderRadius="3px"
          />
          <span>Coinbase Wallet</span>
        </div>
      </button>
      <button
        variant="outline"
        onClick={() => {
          activateProvider(connectors.walletConnect);
          setProvider("walletConnect");
        //   onClose();
        }}
        w="100%"
      >
        <div w="100%" justifyContent="center">
          <image
            src="/wc.png"
            alt="Wallet Connect Logo"
            width={26}
            height={26}
            borderRadius="3px"
          />
          <span>Wallet Connect</span>
        </div>
      </button>
      <button
        variant="outline"
        onClick={() => {
          activateProvider(connectors.injected);
          setProvider("injected");
          onClose();
        }}
        w="100%"
      >
        <div w="100%" justifyContent="center">
          <image
            src="/mm.png"
            alt="Metamask Logo"
            width={25}
            height={25}
            borderRadius="3px"
          />
          <span>Metamask</span>
        </div>
      </button>
      </div>
    </Modal>
  );
}
