import React from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type PoolPageHeaderProps = {
  accountUNIBalance: BigNumber,
  accountBondedBalance: BigNumber,
  accountRewardedPENBalance: BigNumber,
  accountClaimablePENBalance: BigNumber,
  poolTotalBonded: BigNumber,
  accountPoolStatus: number,
  unlocked: number,
};

const STATUS_MAP = ["Unlocked", "Locked"];

// function status(accountStatus, unlocked) {
//   return STATUS_MAP[accountStatus] + (accountStatus === 0 ? "" : " until " + unlocked)
// }

function PoolPageHeader ({
  accountUNIBalance, accountBondedBalance, accountRewardedPENBalance, accountClaimablePENBalance, poolTotalBonded, accountPoolStatus, unlocked
}: PoolPageHeaderProps) {
  const { t, i18n } = useTranslation();
  return (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Balance")} balance={accountUNIBalance}  suffix={" UNI-V2"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Rewarded")} balance={accountRewardedPENBalance} suffix={" PEN"} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Claimable")} balance={accountClaimablePENBalance} suffix={" PEN"} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Pool Ownership")} balance={ownership(accountBondedBalance, poolTotalBonded)}  suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <TextBlock label={t("Pool Status")} text={t(STATUS_MAP[accountPoolStatus]) + (accountPoolStatus === 0 ? "" : t(" until ") + unlocked)}/>
    </div>
  </div>
);
}


export default PoolPageHeader;
