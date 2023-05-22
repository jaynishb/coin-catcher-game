import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { Modal } from "./model";

export default function SelectWalletModal({ isOpen, closeModal }) {
  const { activate } = useWeb3React();

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <h2>Select Wallet</h2>
      <button
        variant="outline"
        onClick={() => {
          activate(connectors.coinbaseWallet);
          setProvider("coinbaseWallet");
          closeModal();
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
          activate(connectors.walletConnect);
          setProvider("walletConnect");
          closeModal();
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
          activate(connectors.injected);
          setProvider("injected");
          closeModal();
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
    </Modal>
  );
}
