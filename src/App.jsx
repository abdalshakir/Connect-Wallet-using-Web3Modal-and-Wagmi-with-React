import { configureChains, createClient, WagmiConfig, useAccount, useContract, useContractRead } from 'wagmi';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { useWeb3ModalTheme } from "@web3modal/react";
import contractABI from './contract-ABI.json';
import { mainnet } from 'wagmi/chains';
import Web3 from 'web3';
import './App.css';
import { useState } from 'react';


const projectId = "4c21ad73dbf007a0b79ea1af1df300ca";
const contractAddress = "0x735763e06F4632EB0598Ff1cEA0B1D9b9463d857";

// 2. Configure wagmi client
const chains = [mainnet]

const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ version: '1', appName: 'web3Modal', chains, projectId }),
  provider
});

console.log("Wagmi Client: ", wagmiClient);

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App() {

  const { address, isConnected, isDisconnected } = useAccount();

  const [tokenBalance, setTokenBalance] = useState(0)

  async function getBalance() {
    try {
      await window.web3.currentProvider.enable();
      const web3 = new Web3(window.web3.currentProvider);
      const contract = await new web3.eth.Contract(contractABI, contractAddress);
      let userBalance = await contract.methods.balanceOf(address).call();
      console.log(`This account have ${userBalance} NFTs`);
      setTokenBalance(userBalance)
    } catch (error) {
      console.log(error);
    }
  }

  getBalance();

  const { theme, setTheme } = useWeb3ModalTheme();

  const handleThemeChange = () => {
    setTheme({
      themeMode: "dark",
      themeColor: "orange",
      themeBackground: "gradient"
    });
  };

  return (
    <div className='App'>
      <WagmiConfig client={wagmiClient}>
        <Web3Button onClick={handleThemeChange} />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      {
        isConnected && (
          <div>
            <h2>{address}</h2>
            <h1>This account have {tokenBalance} NFTs</h1>
          </div>
        )
      }
    </div>
  )
}