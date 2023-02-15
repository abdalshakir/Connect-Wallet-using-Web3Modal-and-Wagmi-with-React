import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { watchAccount, readContract } from '@wagmi/core';
import { Col, Container, Row } from 'react-bootstrap';
import { useWeb3ModalTheme } from "@web3modal/react";
import contractABI from './contract-ABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { mainnet } from 'wagmi/chains';


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

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App() {

  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState('');
  const { theme, setTheme } = useWeb3ModalTheme();

  setTheme({
    themeMode: "dark",
    themeColor: "blackWhite",
    themeBackground: "themeColor"
  });

  async function getBalance() {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'balanceOf',
        args: [address],
      })

      const tokenBalance = data.toString();
      console.log("Balance in String: ", tokenBalance);
      setBalance(tokenBalance);

      setTimeout(() => {
        window.location.replace(`https://www.kickheadz.com/tagupwall?address=${address}&balance=${tokenBalance}`);
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let unwatch;
    if (isConnected) {
      getBalance();
      unwatch = watchAccount((account) => console.log("Watch Account: ", account));
    }
    return () => {
      if (unwatch) {
        unwatch();
      }
    };
  }, [address, isConnected]);


  return (
    <Container fluid className='bg-dark d-flex align-items-center' style={{ height: '100vh' }}>
      <Container style={{ height: '80vh' }}>
        <Row>
          <Col lg={6} md={8} sm={12} className='m-auto text-center py-5'>
            <h1 className='text-white' style={{ fontSize: '5rem' }}>KICK HEADZ</h1>
            <div style={{ marginTop: '5rem' }}>
              <WagmiConfig client={wagmiClient}>
                <Web3Button />
              </WagmiConfig>
              <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={8} sm={12} className='m-auto text-center py-5'>
            {
              isConnected && (
                <div style={{ width: '100%', marginTop: '2rem', color: '#fff', textAlign: 'center' }}>
                  <h5 style={{ fontSize: '0.8rem' }}>{address}</h5>
                  <h5>Your account have {balance} NFT(s)</h5>
                </div>
              )
            }
          </Col>
        </Row>
      </Container>
    </Container>


  )
}