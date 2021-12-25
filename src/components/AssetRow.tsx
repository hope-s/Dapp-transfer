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
  padding: 20px;
  display: inline;
`;
const SAssetRowRight = styled.div`
  display: flex;
  margin: 15px;
`;
const SAssetBalance = styled.div`
  display: flex;
`;

const AssetRow = (props: any) => {
  const { asset } = props;
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
            )} ${ !!asset.length ? asset.symbol : ''}`}
          </SAssetBalance>
          : ""
        }
      </SAssetRowRight>
    </SAssetRow>
  );
};

export default AssetRow;
