import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import Blockie from "./Blockie";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { transitions } from "../styles";
import Button, {SHoverLayer} from "../components/Button";

interface isConnected {
  connected: boolean;
}

const SHeader = styled.div<isConnected>`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content:  ${({ connected }) => (connected ? "space-between" : "end")};
  padding: 0 10px;
  @media (max-width: 768px) {
    position: absolute;
    top: 61.1%;
  }
`;

const WalletConnnectButton = styled(Button)<isConnected>`
  @media (max-width: 768px) {
    display: none;
  }
  font-size: 1rem;
  font-family: monospace;
  background-color: rgba(21, 61, 111, 0.44);
  border: 1px solid rgba(21, 61, 111, 0.44);
  color: #fff;
  height: 36px;
  border-radius: 14px;
  padding: 10px;
  margin: ${({ connected }) => (connected ? "10px 10px" : "0px 0px 8px !important")};
  &:hover ${SHoverLayer}{
    border-radius: 14px !important;
  }
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`;

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`;

const SAddress = styled.p<isConnected>`
  transition: ${transitions.base};
  font-weight: bold;
  user-select: none;
  font-family: monospace;
  margin: ${({ connected }) => (connected ? "-3px auto 5px -2px" : "0")};
`;

interface IHeaderProps {
  killSession: () => void;
  onConnect: () => void;
  connected: boolean;
  address: string;
  chainId: number;
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession, onConnect } = props;
  const chainData = chainId ? getChainData(chainId) : null;
  return (
    <SHeader {...props}>
      {connected && chainData && (
        <SActiveChain>
          <p>{`Connected to`}</p>
          <p>{chainData.name}</p>
        </SActiveChain>
      )}
      {!connected && (
        <WalletConnnectButton connected={connected} onClick={onConnect}>Connect wallet</WalletConnnectButton>
      )}
      {address && (
        <SActiveAccount>
          <WalletConnnectButton connected={connected} onClick={killSession}>Disconnect</WalletConnnectButton>
          <SBlockie address={address} />
          <SAddress connected={connected}>{ellipseAddress(address)}</SAddress>
        </SActiveAccount>
      )}
    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
