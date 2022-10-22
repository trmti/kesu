import styles from '../styles/Home.module.css';
import { useState } from 'react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import Web3 from 'web3';
import ABI from '../utils/ABI.json';

// Create a connector
const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org', // Required
  qrcodeModal: QRCodeModal,
});

connector.on('connect', (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts } = payload.params[0];
  console.log(accounts);
});

export default function Home() {
  const [currentConnector, setCurrentConnector] = useState(connector);
  const onClick = async () => {
    if (!currentConnector.connected) {
      console.log('not connected');
      // create new session
      await connector.createSession();
      setCurrentConnector(connector);
    } else {
      await connector.killSession();
      await connector.createSession();
      setCurrentConnector(connector);
    }
  };

  const sendTx = async () => {
    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    const contractAddress = '0x175719E2730D6904C445dD5e32dffB8BE7Bfbc10';
    const contract = new web3.eth.Contract(ABI, contractAddress);
    console.log(contract);
    const data = contract.methods
      .safeMint(connector.accounts[0], 2)
      .encodeABI();
    const tx = {
      from: currentConnector.accounts[0],
      to: contractAddress,
      data: data,
      value: `${0.02424 * 10 ** 18}`,
    };
    console.log(tx);
    // const res = await currentConnector.signTransaction(tx);
    // console.log(res);
    const res2 = await currentConnector.sendTransaction(tx);
    console.log(res2);
  };

  return (
    <div className={styles.container}>
      <button onClick={onClick}>connect wallet</button>
      <button onClick={sendTx}>send transaction</button>
    </div>
  );
}
