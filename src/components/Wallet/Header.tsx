import React from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type AccountPageHeaderProps = {
  accountPENBalance: BigNumber,
  accountPENSBalance: BigNumber,
  totalPENSSupply: BigNumber,
  accountStagedBalance: BigNumber,
  accountBondedBalance: BigNumber,
  accountStatus: number,
  unlocked: number,
};

const STATUS_MAP = ["Unlocked", "Locked", "Locked"];

function AccountPageHeader ({
  accountPENBalance, accountPENSBalance, totalPENSSupply, accountStagedBalance, accountBondedBalance, accountStatus, unlocked
}: AccountPageHeaderProps) {
  const { t, i18n } = useTranslation();
  return (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Balance")} balance={accountPENBalance} suffix={t(" PEN")}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Staged")} balance={accountStagedBalance}  suffix={" PEN"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Bonded")} balance={accountBondedBalance} suffix={" PEN"} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("DAO Ownership")} balance={ownership(accountPENSBalance, totalPENSSupply)}  suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <TextBlock label={t("Status")} text={t(STATUS_MAP[accountStatus]) + (accountStatus === 0 ? "" : " "+ t("until") + " " + unlocked)}/>
    </div>
  </div>
);
}


export default AccountPageHeader;
