import React from 'react';

import BigNumber from "bignumber.js";
import {AddressBlock, BalanceBlock} from "../common";
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";
import {GOVERNANCE_PROPOSAL_THRESHOLD} from "../../constants/values";
import { useTranslation } from 'react-i18next';

type GovernanceHeaderProps = {
  stake: BigNumber,
  totalStake: BigNumber,
  accountStatus: number,
  implementation: string
};

const STATUS_MAP = ["Frozen", "Fluid", "Locked"];

function GovernanceHeader ({
  stake, totalStake, accountStatus, implementation
}: GovernanceHeaderProps) {
  const { t, i18n } = useTranslation();
  return (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '25%' }}>
      <BalanceBlock asset={t("DAO Ownership")} balance={ownership(stake, totalStake)} suffix="%" />
    </div>
    <div style={{ flexBasis: '25%' }}>
      <BalanceBlock asset={t("Proposal Threshold")} balance={GOVERNANCE_PROPOSAL_THRESHOLD.multipliedBy(100)} suffix="%" />
    </div>
    <div style={{ flexBasis: '25%' }}>
      <TextBlock label={t("Status")} text={t(STATUS_MAP[accountStatus])}/>
    </div>
    <div style={{ flexBasis: '25%' }}>
      <AddressBlock label={t("Implementation")} address={implementation} />
    </div>
  </div>
);
}


export default GovernanceHeader;
