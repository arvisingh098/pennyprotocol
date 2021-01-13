import React, {useEffect, useState} from 'react';
import BigNumber from "bignumber.js";
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable, getPoolBalanceOfRewarded, getPoolBalanceOfStaged,
  getTokenBalance,
  getTokenTotalSupply
} from "../../utils/infura";
import {PEN, PENS, UNI} from "../../constants/tokens";
import {formatBN, toTokenUnitsBN} from "../../utils/number";
import {getPoolAddress} from "../../utils/pool";

type TotalBalanceProps = {
  user: string,
}

function TotalBalance({ user }: TotalBalanceProps) {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setTotalBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();

      const [
        esdBalance, stagedBalance, bondedBalance,
        pairBalancePENStr, pairTotalSupplyUNIStr, userUNIBalanceStr,
        userPoolBondedBalanceStr, userPoolStagedBalanceStr,
        userPoolRewardedBalanceStr, userPoolClaimableBalanceStr,
      ] = await Promise.all([
        getTokenBalance(PEN.addr, user),
        getBalanceOfStaged(PENS.addr, user),
        getBalanceBonded(PENS.addr, user),

        getTokenBalance(PEN.addr, UNI.addr),
        getTokenTotalSupply(UNI.addr),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolAddress, user),
        getPoolBalanceOfStaged(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      const userBalance = toTokenUnitsBN(new BigNumber(esdBalance), PEN.decimals);
      const userStagedBalance = toTokenUnitsBN(new BigNumber(stagedBalance), PENS.decimals);
      const userBondedBalance = toTokenUnitsBN(new BigNumber(bondedBalance), PENS.decimals);

      const userUNIBalance = toTokenUnitsBN(new BigNumber(userUNIBalanceStr), PENS.decimals);
      const userPoolBondedBalance = toTokenUnitsBN(new BigNumber(userPoolBondedBalanceStr), PENS.decimals);
      const userPoolStagedBalance = toTokenUnitsBN(new BigNumber(userPoolStagedBalanceStr), PENS.decimals);
      const userPoolRewardedBalance = toTokenUnitsBN(new BigNumber(userPoolRewardedBalanceStr), PENS.decimals);
      const userPoolClaimableBalance = toTokenUnitsBN(new BigNumber(userPoolClaimableBalanceStr), PENS.decimals);

      let UNItoPEN = new BigNumber(0);
      if(pairTotalSupplyUNIStr != 0)
        UNItoPEN = new BigNumber(pairBalancePENStr).dividedBy(new BigNumber(pairTotalSupplyUNIStr));

      const daoTotalBalance = userStagedBalance.plus(userBondedBalance);
      const poolTotalBalance = UNItoPEN.multipliedBy(userPoolStagedBalance.plus(userPoolBondedBalance))
        .plus(userPoolRewardedBalance.plus(userPoolClaimableBalance));
      const circulationBalance = UNItoPEN.multipliedBy(userUNIBalance).plus(userBalance)

      const totalBalance = daoTotalBalance.plus(poolTotalBalance).plus(circulationBalance)

      if (!isCancelled) {
        setTotalBalance(totalBalance);
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <div style={{ fontSize: 14, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>    
      ∅{formatBN(totalBalance, 2)}
    </div>
  );
}


export default TotalBalance;
