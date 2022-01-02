import * as React from "react";
import AssetRow from "./AssetRow";
import { IAssetData } from "../helpers/types";

const AccountAssets = (props: any) => {
  const { assets, chainId, connected } = props;
  const defaultNativeCurrency: IAssetData =
    chainId === 100
      ? {
          contractAddress: "",
          symbol: "xDAI",
          name: "xDAI",
          decimals: "18",
          balance: "0",
        }
      : {
          contractAddress: "",
          name: "Ethereum",
          symbol: "ETH",
          decimals: "18",
          balance: "0",
        };

  let nativeCurrency: IAssetData = defaultNativeCurrency;
  let tokens: IAssetData[] = [];
  if (assets && assets.length) {
    const filteredNativeCurrency = assets.filter((asset: IAssetData) =>
      asset && asset.symbol
        ? asset.symbol.toLowerCase() === nativeCurrency.symbol.toLowerCase()
        : false
    );
    nativeCurrency =
      filteredNativeCurrency && filteredNativeCurrency.length
        ? filteredNativeCurrency[0]
        : defaultNativeCurrency;
    tokens = assets.filter((asset: IAssetData) =>
      asset && asset.symbol
        ? asset.symbol.toLowerCase() !== nativeCurrency.symbol.toLowerCase()
        : false
    );
    sessionStorage.setItem('balance', nativeCurrency.balance || '{}')
  }
  return (
    <div>
      <AssetRow key={nativeCurrency.name} asset={nativeCurrency} connected={connected} />
      {tokens.map((token) => (
        <AssetRow key={token.symbol} asset={token} />
      ))}
    </div>
  );
};

export default AccountAssets;
