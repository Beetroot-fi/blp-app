import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Btn from "../../../../../../components/Btn/Btn";
import { InfoIcon } from "../../../../../../components/Icons/InfoIcon";
import s from "./HomePageTop.module.scss";
import { apiService } from "../../../../../../tonx";
import { useTonWallet } from "@tonconnect/ui-react";
import {
  BLP_JETTON_MINTER,
  TGBTC_JETTON_MINTER,
} from "../../../../../../consts";

export const HomePageTop = () => {
  const wallet = useTonWallet();
  const [currentTabNum, setCurrentTabNum] = useState(1);
  const tabs = ["Withdraw", "Deposit"];
  const [tgBTCbalance, setTGBTCbalance] = useState<number>(0);
  const [blpBalance, setBlpBalance] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string | number>("");
  const [currentPercentOfBalance, setCurrentPercentOfBalance] = useState<
    undefined | number
  >(0);
  const error = useMemo(() => {
    return inputValue !== "" && Number(inputValue) < 0.000002;
  }, [inputValue]);

  const errorText = useMemo(() => {
    if (Number(inputValue) < 0.000001)
      return "the deposit must be more than 0.000002 TGBTC";

    if (Number(inputValue) < 0.000001)
      return "You need to have at least 1 USDT for deposit";
  }, [inputValue]);

  const balance = currentTabNum === 0 ? blpBalance : tgBTCbalance;

  const onInputChange = (e: any) => {
    const { value } = e.target;

    if (value === "") setInputValue("");

    if (isNaN(Number(value))) return;

    setInputValue(value);
  };

  useEffect(() => {
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

        setTGBTCbalance(Number(tgBTC) / 1e8);
        setBlpBalance(Number(blp) / 1e8);
      } catch (error) {
        throw error;
      }
    };

    fetchBalances();

    if (balance) {
      setCurrentPercentOfBalance((Number(inputValue) / balance) * 100);
    }
  }, [wallet, inputValue, currentTabNum]);

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
            <div className={s.block_pult_text}>Swap fee: 1 USDT</div>
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
              <div className={clsx(s.block_x_item, s.active)}>
                <div className={s.block_x_item_dot}>
                  <div className={s.block_x_item_text}>X1</div>
                </div>
                <div className={s.block_x_item_line}></div>
              </div>
              <div className={clsx(s.block_x_item, s.active)}>
                <div className={s.block_x_item_dot}>
                  <div className={s.block_x_item_text}>X2</div>
                </div>
                <div className={s.block_x_item_line}></div>
              </div>
              <div className={s.block_x_item}>
                <div className={s.block_x_item_dot}>
                  <div className={s.block_x_item_text}>X3</div>
                </div>
                <div className={s.block_x_item_line}></div>
              </div>
              <div className={s.block_x_item}>
                <div className={s.block_x_item_dot}>
                  <div className={s.block_x_item_text}>X4</div>
                </div>
                <div className={s.block_x_item_line}></div>
              </div>
              <div className={s.block_x_item}>
                <div className={s.block_x_item_dot}>
                  <div className={s.block_x_item_text}>X5</div>
                </div>
                <div className={s.block_x_item_line}></div>
              </div>
            </div>
            <div className={s.block_apy}>APY 3.53%</div>
          </div>
        )}
        {currentTabNum === 1 && (
          <div className={s.block_bottom}>
            INFO: LOW Risk of liqudation, conservative yield
          </div>
        )}
      </div>
      <div className={s.btn}>
        <Btn type="pink" className={s.btn} disabled={error}>
          Withdraw
        </Btn>
      </div>
    </div>
  );
};
