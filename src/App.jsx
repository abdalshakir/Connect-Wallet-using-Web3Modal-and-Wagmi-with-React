import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { configureChains, createClient, WagmiConfig, useAccount, useContractRead } from 'wagmi';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { useWeb3ModalTheme } from "@web3modal/react";
import { mainnet } from 'wagmi/chains';
import contractABI from './contract-ABI.json';
import './App.css';


const projectId = "4c21ad73dbf007a0b79ea1af1df300ca";
const contractAddress = "0x5FA0be692bC49A68510F42A747522006cc49c720"; //"0x735763e06F4632EB0598Ff1cEA0B1D9b9463d857";

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

  // const { data, isLoading, error } = useContractRead({
  //   address: contractAddress,
  //   abi: contractABI
  // })

  // if (isLoading) {
  //   console.log("Loading...");
  // }
  // if (error) {
  //   console.log(error);
  // }
  // console.log("Data: ", data);

  const { address, isConnected, isDisconnected } = useAccount();
  console.log("Use Acc: ", address);

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
        isConnected && <h2>{address}</h2>
      }
    </div>
  )
}