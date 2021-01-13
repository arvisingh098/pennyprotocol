import React from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";
import {ownership} from "../../utils/number";

type CouponMarketHeaderProps = {
  debt: BigNumber,
  supply: BigNumber,
  coupons: BigNumber,
  premium: BigNumber,
  redeemable: BigNumber,
};

function CouponMarketHeader ({
  debt, supply, coupons, premium, redeemable
}: CouponMarketHeaderProps) {
  const { t, i18n } = useTranslation();
  return (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Debt Ratio")} balance={ownership(debt, supply)} suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Total Debt")} balance={debt} suffix={"PEN"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Coupons")} balance={coupons} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Premium")} balance={premium.multipliedBy(100)} suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset={t("Redeemable")} balance={redeemable}/>
    </div>
  </div>
);
}


export default CouponMarketHeader;
