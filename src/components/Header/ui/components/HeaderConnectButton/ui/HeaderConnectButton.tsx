import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
  Wallet,
} from "@tonconnect/ui-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { TESTNET_CHAIN_ID } from "../../../../../../consts";
import Btn from "../../../../../Btn/Btn";
import HeaderStore from "../../../../store/HeaderStore";
import { useHeaderConnectButton } from "../helpers/useHeaderConnectButton";
import s from "./HeaderConnectButton.module.scss";

interface Props {
  store: HeaderStore;
}

export const HeaderConnectButton: React.FC<Props> = observer(({ store }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { disconnectClick, connectButtonText } = useHeaderConnectButton({
    store,
    wallet,
  });

  useEffect(() => {
    /**
     * Handles wallet status changes and enforces mainnet-only connections
     * @param wallet - Connected wallet instance or null
     */
    const handleStatusChange = async (wallet: Wallet | null): Promise<void> => {
      if (wallet?.account.chain == TESTNET_CHAIN_ID) {
        await tonConnectUI.disconnect();
        console.log("testnet");
      } else {
        console.log("mainnet");
      }
    };

    const unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);

    return () => unsubscribe();
  }, [tonConnectUI]);

  return (
    <div className={s.connect}>
      <Btn
        height="auto"
        type={!wallet ? "default" : "transparent"}
        onClick={disconnectClick}
        width="full"
        fontSize="16"
      >
        {connectButtonText}
      </Btn>
      {!wallet && <TonConnectButton className={s.connect_hidden} />}
    </div>
  );
});
