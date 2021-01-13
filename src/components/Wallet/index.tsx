import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import {
  getBalanceBonded,
  getBalanceOfStaged, getFluidUntil, getLockedUntil,
  getStatusOf, getTokenAllowance,
  getTokenBalance, getTokenTotalSupply,
} from '../../utils/infura';
import {PEN, PENS} from "../../constants/tokens";
import {DAO_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';

import AccountPageHeader from "./Header";
import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import IconHeader from "../common/IconHeader";
import {getPoolAddress} from "../../utils/pool";
import {DollarPool4} from "../../constants/contracts";

function Wallet({ user }: {user: string}) {
  const { t, i18n } = useTranslation();
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [userPENBalance, setUserPENBalance] = useState(new BigNumber(0));
  const [userPENAllowance, setUserPENAllowance] = useState(new BigNumber(0));
  const [userPENSBalance, setUserPENSBalance] = useState(new BigNumber(0));
  const [totalPENSSupply, setTotalPENSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserPENBalance(new BigNumber(0));
      setUserPENAllowance(new BigNumber(0));
      setUserPENSBalance(new BigNumber(0));
      setTotalPENSSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        esdBalance, esdAllowance, esdsBalance, esdsSupply, stagedBalance, bondedBalance, status, poolAddress,
        fluidUntilStr, lockedUntilStr
      ] = await Promise.all([
        getTokenBalance(PEN.addr, user),
        getTokenAllowance(PEN.addr, user, PENS.addr),
        getTokenBalance(PENS.addr, user),
        getTokenTotalSupply(PENS.addr),
        getBalanceOfStaged(PENS.addr, user),
        getBalanceBonded(PENS.addr, user),
        getStatusOf(PENS.addr, user),
        getPoolAddress(),

        getFluidUntil(PENS.addr, user),
        getLockedUntil(PENS.addr, user),
      ]);

      const userPENBalance = toTokenUnitsBN(esdBalance, PEN.decimals);
      const userPENSBalance = toTokenUnitsBN(esdsBalance, PENS.decimals);
      const totalPENSSupply = toTokenUnitsBN(esdsSupply, PENS.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, PENS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, PENS.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setUserPENBalance(new BigNumber(userPENBalance));
        setUserPENAllowance(new BigNumber(esdAllowance));
        setUserPENSBalance(new BigNumber(userPENSBalance));
        setTotalPENSSupply(new BigNumber(totalPENSSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil))
        setLockup(poolAddress === DollarPool4 ? DAO_EXIT_LOCKUP_EPOCHS : 1);
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
    <>
      <IconHeader icon={<i className="fas fa-dot-circle"/>} text={t("DAO")}/>

      <AccountPageHeader
        accountPENBalance={userPENBalance}
        accountPENSBalance={userPENSBalance}
        totalPENSSupply={totalPENSSupply}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        user={user}
        balance={userPENBalance}
        allowance={userPENAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      />
    </>
  );
}

export default Wallet;
