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
    }, 500)
  }

  return (
    <Modal title={'Select wallet to connect'} isOpen={isOpen} onClose={onClose} isCentered>
        <div className="flex flex-col items-center w-full my-2">
      <button
        className="border-[#E2E8F0] w-full my-1  border-2 px-4 py-2 rounded"
        variant="outline"
        onClick={() => {
          activateProvider(connectors.coinbaseWallet);
          setProvider("coinbaseWallet");
          onClose();
        }}
        w="100%"
      >
        <div className="flex justify-center gap-2">
          <img
            src="https://app.uniswap.org/static/media/coinbaseWalletIcon.07499ce0896d18990e93182d478a70cd.svg"
            alt="Coinbase Wallet Logo"
            borderRadius="3px"
          />
          <span>Coinbase Wallet</span>
        </div>
      </button>
      <button
      className="border-[#E2E8F0] w-full my-1  border-2 px-4 py-2 rounded"
        variant="outline"
        onClick={() => {
          activateProvider(connectors.walletConnect);
          setProvider("walletConnect");
            onClose();
        }}
        w="100%"
      >
        <div className="flex justify-center gap-2">
          <img
          className=""
            src="https://app.uniswap.org/static/media/walletConnectIcon.1dbab988fae0fcca5455f5eaed5e4417.svg"
            alt="Wallet Connect Logo"
            borderRadius="3px"
          />
          <span>Wallet Connect</span>
        </div>
      </button>
      <button
      className="border-[#E2E8F0] w-full my-1 border-2 px-4 py-2 rounded"
        variant="outline"
        onClick={() => {
          activateProvider(connectors.injected);
          setProvider("injected");
          onClose();
        }}
        w="100%"
      >
        <div className="flex justify-center gap-2">
          <img
            src="https://app.uniswap.org/static/media/metamask.a8bd577376764ebfd421e669e37b0ebb.svg"
            alt="Metamask Logo"
            borderRadius="3px"
          />
          <span>Metamask</span>
        </div>
      </button>
      </div>
    </Modal>
  );
}
