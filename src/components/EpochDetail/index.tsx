import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {getTokenBalance, getTokenTotalSupply, getTotalDebt, getCouponPremium, getEpoch, getEpochTime,
} from '../../utils/infura';
import {PEN, UNI, USDC, PENS} from "../../constants/tokens";
import AdvanceEpoch from './AdvanceEpoch';
import EpochPageHeader from "./Header";
import IconHeader from "../common/IconHeader";
import BigNumber from 'bignumber.js';
import { toTokenUnitsBN } from '../../utils/number';
import { useTranslation } from 'react-i18next';


const ONE_COUPON = new BigNumber(10).pow(18);
function epochformatted() {
  const epochStart = 1599148800;
  const epochPeriod = 1 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `0${0}:${epochMinute < 50 ? 60 - epochMinute : "0" + (60 - epochMinute).toString()}:${epochRemainder < 50 ? 60 - epochRemainder : "0" + (60 - epochRemainder).toString()}`;
}

function EpochDetail({ user }: {user: string}) {
  const { t, i18n } = useTranslation();
  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  const [pairBalancePEN, setPairBalancePEN] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [poolAddress, setPoolAddress] = useState("");
  const [epochTimes, setEpochTimes] = useState("00:00:00");

  const epochStart = 1609790400;
  const epochPeriod = 1 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const nextEpoch = Math.floor(epochRemainder / epochPeriod);
  var nextEpochs = nextEpoch.toString();
  useEffect(() => {
    let isCancelled = false;
    let epochStr = '0';
    let epochTimeStr = '0';
    let pairBalancePENStr = '0';
    let pairBalanceUSDCStr = '0';
    let debtStr = '0'; 
    let totalSupplyStr = '0';

    async function updateUserInfo() {
      if(user != '')
      {
      [epochStr, epochTimeStr, pairBalancePENStr, pairBalanceUSDCStr, debtStr, totalSupplyStr] = await Promise.all([
          getEpoch(PENS.addr),
          getEpochTime(PENS.addr),
          getTokenBalance(PEN.addr, UNI.addr),
          getTokenBalance(USDC.addr, UNI.addr),
          getTotalDebt(PENS.addr),
          getTokenTotalSupply(PEN.addr)
      ]);
      }
      
      const totalDebt = toTokenUnitsBN(debtStr, PEN.decimals);

      if (!isCancelled) {
        setEpoch(parseInt(epochStr, 10));
        setEpochTime(parseInt(epochTimeStr, 10));
        setPairBalancePEN(toTokenUnitsBN(pairBalancePENStr, PEN.decimals));
        setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals));
        setDebt(new BigNumber(totalDebt));
        setEpochTimes(epochformatted());
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, PEN.decimals));
        if (totalDebt.isGreaterThan(new BigNumber(1))) {
          const couponPremiumStr = await getCouponPremium(PENS.addr, ONE_COUPON)
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, PEN.decimals));
        } else {
          setCouponPremium(new BigNumber(0));
        }
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);
  
  return (
    <>
      <IconHeader icon={<i className="fas fa-retweet"/>} text={t("Epoch")}/>

      <EpochPageHeader
        epoch={epoch}
        epochTime={epochTime}
        spotPrice={pairBalanceUSDC}
        twapPrice={UNI.addr}
        nextEpochs={nextEpochs}
        epochTimes={epochTimes}
        price={pairBalanceUSDC.dividedBy(pairBalancePEN)}
      />

      <Header primary={t("Advance Epoch")} />

      <AdvanceEpoch
        user={user}
        epoch={epoch}
        epochTime={epochTime}
        spotPrice={pairBalanceUSDC}
        twapPrice={UNI.addr}
        nextEpochs={nextEpochs}
        price={pairBalanceUSDC.dividedBy(pairBalancePEN)}
        couponPremium={couponPremium}
        totalSupply={totalSupply}
      />
    </>
  );
}

export default EpochDetail;
