export interface JettonWallet {
    balance: string;
    jetton: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        image: string;
    };
    wallet_address: {
        address: string;
        is_scam: boolean;
        is_wallet: boolean;
    };
}
