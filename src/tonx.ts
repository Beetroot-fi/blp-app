import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
    },
});

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
            throw error;
        }
    },
};
