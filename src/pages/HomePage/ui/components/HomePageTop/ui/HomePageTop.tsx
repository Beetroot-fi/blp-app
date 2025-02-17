import { Address, beginCell, toNano } from "@ton/core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { InfoIcon } from "../../../../../../components/Icons/InfoIcon";
import {
  BLP_JETTON_MINTER,
  TGBTC_JETTON_MINTER,
} from "../../../../../../consts";
import { JettonWallet } from "../../../../../../interfaces";
import {
  buildJettonBurnBody,
  buildJettonTransferBody,
} from "../../../../../../methods/jettonUtils";
import { apiService } from "../../../../../../tonx";
import s from "./HomePageTop.module.scss";

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [currentTabNum, setCurrentTabNum] = useState(1);
  const tabs = ["Withdraw", "Deposit"];
  const [tgBTCJettonWallet, setTGBTCJettonWallet] =
    useState<JettonWallet | null>(null);
  const [blpJettonWallet, setBlpJettonWallet] = useState<JettonWallet | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string | number>("");
  const [tonConnectUi] = useTonConnectUI();
  const [currentPercentOfBalance, setCurrentPercentOfBalance] = useState<
    undefined | number
  >(0);

  const balance =
    currentTabNum === 1
      ? Number(tgBTCJettonWallet?.balance || 0) / 1e8
      : Number(blpJettonWallet?.balance || 0) / 1e8;

  const errorText = useMemo(() => {
    if (Number(inputValue) > balance) {
      return "Not enough balance";
    }

    if (Number(inputValue) < 0.000001)
      return "the deposit must be more than 0.000002 TGBTC";

    if (Number(inputValue) < 0.000001)
      return "You need to have at least 1 USDT for deposit";
  }, [inputValue]);

  const error = useMemo(() => {
    return (
      (inputValue !== "" && Number(inputValue) < 0.000002) ||
      Number(inputValue) > balance
    );
  }, [inputValue]);

  const buttonText = currentTabNum === 0 ? "Withdraw" : "Deposit";

  const onInputChange = (e: any) => {
    const { value } = e.target;

    if (value === "") setInputValue("");

    if (isNaN(Number(value))) return;

    setInputValue(value);
  };

  const apyValues = [
    {
      index: 1,
      tab: "x1",
      value: "1.15",
    },
    {
      index: 2,
      tab: "x2",
      value: "2.3",
    },
    {
      index: 3,
      tab: "x3",
      value: "3.45",
    },
    {
      index: 4,
      tab: "x4",
      value: "4.6",
    },
    {
      index: 5,
      tab: "x5",
      value: "5.75",
    },
  ];
  const [currentApyIndex, setCurrentApyIndex] = useState(2);
  const currentApyObject = apyValues.find(
    (item) => item.index === currentApyIndex
  );

  const fetchBalances = async () => {
    try {
      if (!wallet || !wallet.account?.address) {
        return;
      }

      const address = wallet.account.address;

      const [tgBTC, blp] = await Promise.all([
        apiService.getJettonBalance(address, TGBTC_JETTON_MINTER),
        apiService.getJettonBalance(address, BLP_JETTON_MINTER),
      ]);

      setTGBTCJettonWallet(tgBTC);
      setBlpJettonWallet(blp);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [wallet]);

  useEffect(() => {
    if (balance) {
      setCurrentPercentOfBalance((Number(inputValue) / balance) * 100);
    }
  }, [inputValue]);

  const opType = useMemo(
    () => (currentTabNum === 1 ? "deposit" : "withdraw"),
    [currentTabNum]
  );

  const onClick = useCallback(async () => {
    if (!inputValue || error || !wallet?.account.address) return;
    alert(123);

    const isDeposit = opType === "deposit";

    const jettonWallet = isDeposit ? tgBTCJettonWallet : blpJettonWallet;
    if (!jettonWallet?.wallet_address.address) return;

    const body = isDeposit
      ? buildJettonTransferBody(
          0n,
          BigInt(Math.round(Number(inputValue) * 1e8)),
          Address.parse(BLP_JETTON_MINTER),
          Address.parseRaw(wallet.account.address),
          toNano("0.15"),
          beginCell()
            .storeUint(Math.round(Number(currentApyObject?.value) * 1e2), 10)
            .endCell()
        )
      : buildJettonBurnBody(
          0n,
          BigInt(Math.round(Number(inputValue) * 1e8)),
          Address.parseRaw(wallet.account.address)
        );

    const destination = jettonWallet.wallet_address.address;
    const amount = isDeposit ? toNano("0.2") : toNano("0.1");

    try {
      await tonConnectUi.sendTransaction({
        messages: [
          {
            address: destination,
            amount: amount.toString(),
            payload: body.toBoc().toString("base64"),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000,
      });
    } catch (err) {
      throw err;
    }
  }, [
    error,
    wallet,
    inputValue,
    currentApyObject,
    opType,
    tgBTCJettonWallet,
    blpJettonWallet,
    tonConnectUi,
  ]);

  return (
    <div className={s.wrapper}>
      <div className={s.tabs}>
        {tabs.map((item, i) => (
          <div
            className={clsx(s.tab, currentTabNum === i && s.active)}
            onClick={() => setCurrentTabNum(i)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={s.block}>
        <div className={s.block_top}>
          <div className={s.token}>
            <img
              src={currentTabNum === 0 ? "./blp.png" : "./tgbtc.png"}
              alt=""
            />
            <span>{currentTabNum === 0 ? "BLP" : "tgbtc"}</span>
          </div>
          <div className={s.balance}>
            BALANCE: <span>{balance}</span>
          </div>
        </div>
        <div className={s.block_field}>
          <input
            type="text"
            placeholder="0.000000"
            value={inputValue}
            onChange={onInputChange}
            className={clsx(error && s.error)}
          />
        </div>
        {error && (
          <div className={s.error}>
            <InfoIcon />
            <span>{errorText}</span>
          </div>
        )}
        <div className={clsx(s.block_pult, currentTabNum === 1 && s.jcsb)}>
          {currentTabNum === 1 && (
            <div className={s.block_pult_text}>Deposit fee: 1 USDT</div>
          )}
          <div className={s.block_btns}>
            <div
              className={clsx(
                s.block_btns_item,
                currentPercentOfBalance === 25 && s.active
              )}
              onClick={() => setInputValue(Number(balance) * 0.25)}
            >
              25%
            </div>
            <div
              className={clsx(
                s.block_btns_item,
                currentPercentOfBalance === 50 && s.active
              )}
              onClick={() => setInputValue(Number(balance) * 0.5)}
            >
              50%
            </div>
            <div
              className={clsx(
                s.block_btns_item,
                currentPercentOfBalance === 100 && s.active
              )}
              onClick={() => setInputValue(balance)}
            >
              Max
            </div>
          </div>
        </div>
        {currentTabNum === 1 && (
          <div className={s.block_x_wrapper}>
            <div className={s.block_x}>
              {apyValues.map((item, i) => (
                <div
                  className={clsx(
                    s.block_x_item,
                    currentApyIndex > i && s.active
                  )}
                >
                  <div
                    className={s.block_x_item_dot}
                    onClick={() => {
                      setCurrentApyIndex(item.index);
                    }}
                  >
                    <div className={s.block_x_item_text}>{item.tab}</div>
                  </div>
                  <div className={s.block_x_item_line}></div>
                </div>
              ))}
            </div>
            <div className={s.block_apy}>APY {currentApyObject?.value}%</div>
          </div>
        )}
        {currentTabNum === 1 && (
          <div className={s.block_bottom}>
            INFO: LOW Risk of liqudation, conservative yield
          </div>
        )}
      </div>
      <div className={s.btn}>
        <Btn type="pink" className={s.btn} disabled={error} onClick={onClick}>
          {buttonText}
        </Btn>
      </div>
    </div>
  );
};
