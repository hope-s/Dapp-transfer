import * as React from "react";
import styled from "styled-components";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { GoInbox } from "react-icons/go";
import { GoPlusSmall } from "react-icons/go";
import { GoAlert } from "react-icons/go";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import { Bitski } from "bitski";
import Portis from '@portis/web3';
import DcentProvider from "dcent-provider";

import Button, {SHoverLayer} from "./components/Button";
import Column from "./components/Column";
import Wrapper from "./components/Wrapper";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ModalResult from "./components/ModalResult";
import AccountAssets from "./components/AccountAssets";
import ConnectButton from "./components/ConnectButton";
import BscLogo from './assets/bsc.png';

import { apiGetAccountAssets } from "./helpers/api";
import {
  formatTestTransaction,
  getChainData
} from "./helpers/utilities";
import {
  handleSignificantDecimals,
  convertAmountFromRawNumber,
} from "./helpers/bignumber";

import { IAssetData } from "./helpers/types";
import { fonts } from "./styles";
const ethProvider = require("eth-provider");

const ConnectWallet = styled(Button)`
  font-size: 1rem; 
  font-family: monospace;
  background-color: rgba(21, 61, 111, 0.44);
  border: 1px solid rgba(21, 61, 111, 0.44);
  color: #fff;
  height: 36px;
  border-radius: 14px;
  margin: 8px -10px;
  padding: 10px;
  width: 165px;
  &:hover ${SHoverLayer}{
    border-radius: 14px !important;
  }
  @media (min-width: 768px) {
    margin: 30px 10px;
    width: 165px;
  }
`;

const DisconnectWallet = styled(ConnectWallet)`
  margin: 5px 0px 8px 0px;
  width: 130px;
  @media (min-width: 768px) {
    margin: 30px 10px 20px -7px;
  }
`;

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  /* background-color: #160040; */
  background-color: #0C093C;
  color: #fff;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: ${fonts.size.h5};
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  font-size: ${fonts.size.h6};
`;

const STestButton = styled(Button)`
  border-radius: 50px;
  font-size: ${fonts.size.medium};
  height: 35px;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
`;

const NewPositinBtn = styled(Button)`
  border-radius: 12px !important;
  text-align: right;
  font-size: ${fonts.size.medium};
  height: 35px;
  width: 100%;
  max-width: 140px;
  @media (max-width: 768px) {
      max-width: 50% !important;
      text-align: center;
      margin: 12px -1px 10px 13px;
  }
  margin: 12px 4px 12px 10px;
`;

const MoreBtn = styled(Button)`
  border-radius: 12px !important;
  font-size: ${fonts.size.medium};
  height: 35px;
  background-color: rgba(255, 255, 255, 0.1);
  max-width: 90px;
  width: 100%;
  &:hover ${SHoverLayer}{
    border-radius: 12px !important;
  }
  @media (max-width: 768px) {
    max-width: 50% !important;
    margin: 12px 12px 12px -1px;
  }
  margin: 12px -31px 12px 0px;
`;

const MainBox = styled.main`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  @media (min-width: 768px) {
    position: sticky;
    bottom: 18.2%; 
  }
`;

const BoxLeft = styled.section`
  background: radial-gradient(92.78% 103.09% at 50.06% 7.22%, rgba(255, 58, 212, 0.07) 0%, rgba(255, 255, 255, 0.043) 100%), radial-gradient(100% 97.16% at 0% 12.22%, rgba(235, 0, 255, 0.2) 0%, rgba(243, 19, 19, 0.2) 100%);
    @media (min-width: 768px) {
      display: inline;
    }
    display: none;
    padding: 1rem;
    margin: 8px 4.5px 8px 0px;
    width: 33%;
    height: 150px;
    border-radius: 20px;
    position: relative;
    text-align: left;
    overflow: hidden;
    border: 1px solid transparent;
    cursor: pointer;
`;

const BoxRight = styled.div`
  @media (min-width: 768px) {
    display: inline;
  }
  display: none;
  position: relative;
  overflow: hidden;
  text-align: left;
  padding: 1rem;
  margin: 8px 0px 8px 4.5px;
  width: 22%;
  height: 150px;
  border-radius: 20px;
  border: 1px solid transparent;
  background-color: #543864;
  cursor: pointer;
`;

const BoxButtom = styled.div`
    @media (max-width: 768px) {
      width: 93%;
      height: 200px;
      border-radius: 12px;
      position: absolute;
      top: 26% !important;
    }
    @media (min-width: 380px) and (max-width: 600px) {
      width: 95%;

    }
    @media (min-width: 601px) and (max-width: 769px) {
      width: 96%;
    }
    background-color: #1F4068;
    text-align: center;
    padding: 8px;
    border-radius: 20px;
    width: 55.5%;
    height: 190px;
    display: grid;
    justify-content: center !important;
    align-items: center !important;
`;

const OverviewSection = styled.section`
  display: flex;
  justify-content: right;
  width: 78%;
  & .icon-plus{
    padding: 0;
    position: relative;
    left: 44px;
    top: 15px;
    z-index: 1;
  }
  @media (max-width: 768px) {
    flex-direction: row-reverse;
    justify-content: left;
    width: 100%;
    margin-top: 0%;
    & .icon-plus{
    position: relative;
    left: -25px !important;
    top: 15px;
    }
  }
`;

const ShowWalletInMobile = styled.div`
    display: none;
    @media (max-width: 768px) {
      display: flex !important;
    }
`;

export const HideWalletInMobile = styled.div`
    display: flex !important;
    @media (max-width: 768px) {
      display: none !important;
    }
`;
interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  connectError: any;
  pendingRequest: boolean;
  result: any | null;
};

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  connectError: {bool: false, message: ""},
  pendingRequest: false,
  result: null
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
			theme: {
				background: '#1F4068',
				hover: '#1c395d',
        main: "#fff",
        secondary: "#fff"
			},
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
      disableInjectedProvider: false
    });
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
    await this.getAccountAssets();
  };

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });
  };

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "47fd0912b886d0b51059549ecead6a20",
        }
      },
      portis: {
        package: Portis,
        options: {
          id: "15a33955-3769-422a-a2f3-dc508bf3c632"
        }
      },
      dcentwallet: {
        package: DcentProvider,
        options: {
          rpcUrl: "https://public-node.testnet.rsk.co",
          chainId: 1
        }
      },
      torus: {
        package: Torus
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: "pk_live_7E478F57D246AC2D"
        }
      },
      authereum: {
        package: Authereum
      },
      bitski: {
        package: Bitski,
        options: {
          clientId: "7e3dbbbd-df49-456b-88de-68e543e43ee0",
          callbackUrl: window.location.href + "bitski-callback.html"
        }
      },
      frame: {
        package: ethProvider
      },
      "custom-binancechainwallet": {
        display: {
          logo: BscLogo,
          name: "Binance Chain Wallet",
          description: "Connect to your Binance Chain Wallet"
        },
        package: true,
        connector: async () => {
          let provider = null;
          if (typeof window.BinanceChain !== 'undefined') {
            provider = window.BinanceChain;
            try {
              await provider.request({ method: 'eth_requestAccounts' })
            } catch (error) {
              throw new Error("User Rejected");
            }
          } else {
            throw new Error("No Binance Chain Wallet found");
          }
          return provider;
        }
      }
    };
    return providerOptions;
  };

  public getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      await this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error); // tslint:disable-line
      await this.setState({ fetching: false });
    }
  };

  public showErrorModal = () => {
      this.toggleModal();            
      this.setState({connectError: {bool: true}});
      if (this.state.address){
        this.setState({connectError: {message: 'Confirm pool first !'}})
      }
  }

  public toggleModal = () =>
    this.setState({ showModal: !this.state.showModal, connectError: {bool: false}} );
    
  public testSendTransaction = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // @ts-ignore
      function sendTransaction(_tx: any) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once("transactionHash", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
        });
      }

      // send transaction
      const result = await sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        txHash: result,
        from: address,
        to: tx.to,
        value: handleSignificantDecimals(convertAmountFromRawNumber(Number(sessionStorage.getItem('balance'))),8)
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  public render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result
    } = this.state;
    return (
      <SLayout>
          <HideWalletInMobile>
            <Header
              connected={connected}
              address={address}
              chainId={chainId}
              killSession={this.resetApp}
            />
            {connected ? <DisconnectWallet onClick={this.resetApp}>Disconnect</DisconnectWallet> : <ConnectWallet onClick={this.onConnect}>Connect wallet</ConnectWallet>}
            <HideWalletInMobile>
              <AccountAssets chainId={chainId} assets={assets} />
            </HideWalletInMobile>
          </HideWalletInMobile>
          <ShowWalletInMobile>
            <AccountAssets chainId={chainId} assets={assets} /> 
            {connected ? <DisconnectWallet onClick={this.resetApp}>Disconnect</DisconnectWallet> : <ConnectWallet onClick={this.onConnect}>Connect wallet</ConnectWallet>}
          </ShowWalletInMobile>
          <div style={{marginTop: '3%'}}>
            <h6 style={{display: 'block', textAlign: 'center'}}>Pools Overview</h6>
          <OverviewSection>
            <MoreBtn onClick={this.showErrorModal}>More</MoreBtn>
            <GoPlusSmall className="icon-plus" size={30}/>
            <NewPositinBtn onClick={this.showErrorModal}>New position</NewPositinBtn>
          </OverviewSection>
          </div>
        <SContent>
          {fetching && (
            <Column center>
                <Loader />
            </Column>
          )}
        </SContent>
        <MainBox>
          <BoxLeft onClick={this.showErrorModal}> <h6>Learn about providing liquidity ↗</h6>
            Check out our v3 LP walkthrough and migration guides.
          </BoxLeft>
          <BoxRight onClick={this.showErrorModal}> <h6>Top pools ↗</h6>
            Explore popular pools on Uniswap Analytics.</BoxRight>
          <BoxButtom>
          <GoInbox size={40} opacity={0.6} style={{margin: '0 auto'}}/>
          Your V3 liquidity positions will appear here.
          <br/>
          {
            connected ?
            <STestButton left onClick={this.testSendTransaction}>
              Confirm pool
            </STestButton>
            :
            <ConnectButton onClick={this.onConnect} />
          }
          </BoxButtom>
        </MainBox>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Send transaction"}</SModalTitle>
              <SContainer>
                <Loader />
              </SContainer>
              <SModalParagraph style={{margin: '20px 0px 30px 0px'}}>
                {"Please check your wallet"}
              </SModalParagraph>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalParagraph style={{color: '#95D1CC'}}>{"Transaction successfully completed 🥳"}</SModalParagraph>
              <ModalResult>{result}</ModalResult>
            </SModalContainer>
          ) : Number(sessionStorage.getItem('balance')) - 2502441524727298 <= 0 ? (
            <SModalContainer>
              <SModalParagraph style={{color: '#F9D371'}}>
                {this.state.connectError.bool === false && 'Insufficient balance'} {this.state.connectError.bool === false && <GoAlert/>}
              </SModalParagraph>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalParagraph style={{color: '#F8485E'}}>
                {this.state.connectError.bool === false && 'Transaction Rejected'} {this.state.connectError.bool === false && <GoAlert/>}
              </SModalParagraph>
            </SModalContainer>
          )}
          {this.state.connectError.bool ? (
            <SModalContainer>
              <SModalParagraph>
                {this.state.connectError.bool && "Connect a wallet first !"}
              </SModalParagraph>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalParagraph>
                {this.state.connectError.message && this.state.connectError.message }
              </SModalParagraph>
           </SModalContainer>
          )}
        </Modal>
        <ShowWalletInMobile>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.resetApp}
          />
        </ShowWalletInMobile>
      </SLayout>
    );
  };
}

export default App;
