import * as React from "react";
import styled from "styled-components";
import Icon from "./Icon";
import ERC20Icon from "./ERC20Icon";
import eth from "../assets/eth.png";
import xdai from "../assets/xdai.png";
import {
  handleSignificantDecimals,
  convertAmountFromRawNumber,
} from "../helpers/bignumber";

const SAssetRow = styled.div`
  width: 100%;
  padding: 20px 0px;
  @media (max-width: 768px) {
    padding: 0px;
  }
  display: table-cell;
`;

const SAssetRowRight = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  margin: 10px 5px 0px 0px;
  @media (max-width: 768px) {
    margin: 11px 13px;
  }
`;

const SAssetBalance = styled.div`
  display: flex;
  margin: 3px 0px 3px 2px !important;
  @media (min-width: 768px) {
    margin: 3px -5px 0px 3px !important;
    min-width: 120px;
  }
`;

const ZeroBalance = styled.span`
  width: 72px;
  margin: 3px 0px;
  @media (min-width: 768px) {
    padding: 0px 0px;
    margin: 3px 7px 3px 0px;
  }
`

const AssetRow = (props: any) => {
  const { asset, connected } = props;
  const nativeCurrencyIcon =
    asset.symbol && asset.symbol.toLowerCase() === "eth"
      ? eth
      : asset.symbol && asset.symbol.toLowerCase() === "xdai"
      ? xdai
      : null;
  return (
    <SAssetRow {...props}>
      <SAssetRowRight>
        {nativeCurrencyIcon ? (
          <Icon src={nativeCurrencyIcon} />
        ) : (
          <ERC20Icon contractAddress={asset.contractAddress.toLowerCase()} />
        )}
        {asset.balance !== '0' ? 
          <SAssetBalance>
            {`${handleSignificantDecimals(
              convertAmountFromRawNumber(asset.balance),
              8
            )} ${asset.symbol}`}
          </SAssetBalance>
          : 
          connected && <ZeroBalance>0.00 ETH</ZeroBalance>
        }
      </SAssetRowRight>
    </SAssetRow>
  );
};

export default AssetRow;