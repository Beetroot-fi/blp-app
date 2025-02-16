import axios, { AxiosInstance } from "axios";
import { JettonWallet } from "./interfaces";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
    },
});

const EMPTY_JETTON_WALLET: JettonWallet = {
    balance: "0",
    jetton: {
        address: "",
        name: "",
        symbol: "",
        decimals: 0,
        image: "",
    },
    wallet_address: {
        address: "",
        is_scam: false,
        is_wallet: false,
    },
};

export const apiService = {
    getJettonBalance: async (walletAddress: string, jettonMinterAddress: string) => {
        try {
            const response = await api.post('', {
                id: 1,
                jsonrpc: '2.0',
                method: 'getAccountJettonBalance',
                params: {
                    account_id: walletAddress,
                    jetton_id: jettonMinterAddress
                }
            });

            return response.data.result;
        } catch (error) {
            return EMPTY_JETTON_WALLET;;
        }
    },
};
