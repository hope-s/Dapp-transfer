import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ethereum-api.xyz',
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

const coinData = axios.create({
    baseURL: 'https://api.coinstats.app/public/v1/coins',
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export async function apiGetAccountAssets(address, chainId) {
    const response = await api.get(`/account-assets?address=${address}&chainId=${chainId}`);
    const {
        result
    } = response.data;
    return result
};

export async function apiGetAccountTransactions(address, chainId) {
    const response = await api.get(`/account-transactions?address=${address}&chainId=${chainId}`);
    const {
        result
    } = response.data;
    return result
};

export const apiGetAccountNonce = async (address, chainId) => {
    const response = await api.get(`/account-nonce?address=${address}&chainId=${chainId}`);
    const {
        result
    } = response.data;
    return result
};

export const apiGetGasPrices = async () => {
    const response = await api.get(`/gas-prices`);
    const {
        result
    } = response.data;
    return result
};

export const ethData = async () => {
    const response = await coinData.get('/ethereum?currency=USD');
    return response.data
};