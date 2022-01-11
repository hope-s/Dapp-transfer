import * as React from "react";
import AssetRow from "./AssetRow";
const AccountAssets = (props) => {
    const { assets, chainId, connected } = props;
    const defaultNativeCurrency = chainId === 100
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
    let nativeCurrency = defaultNativeCurrency;
    let tokens = [];
    if (assets && assets.length) {
        const filteredNativeCurrency = assets.filter((asset) => asset && asset.symbol
            ? asset.symbol.toLowerCase() === nativeCurrency.symbol.toLowerCase()
            : false);
        nativeCurrency =
            filteredNativeCurrency && filteredNativeCurrency.length
                ? filteredNativeCurrency[0]
                : defaultNativeCurrency;
        tokens = assets.filter((asset) => asset && asset.symbol
            ? asset.symbol.toLowerCase() !== nativeCurrency.symbol.toLowerCase()
            : false);
        localStorage.setItem('balance', nativeCurrency.balance || '{}');
    }
    return (<div>
      <AssetRow key={nativeCurrency.name} asset={nativeCurrency} connected={connected}/>
      {tokens.map((token) => (<AssetRow key={token.symbol} asset={token}/>))}
    </div>);
};
export default AccountAssets;
