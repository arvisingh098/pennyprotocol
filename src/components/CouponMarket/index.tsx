import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';
import { useParams } from 'react-router-dom';

import {
  getCouponPremium,
  getTokenAllowance,
  getTokenBalance,
  getTokenTotalSupply, getTotalCoupons,
  getTotalDebt, getTotalRedeemable,
} from '../../utils/infura';
import {PEN, PENS} from "../../constants/tokens";
import CouponMarketHeader from "./Header";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import PurchaseCoupons from "./PurchaseCoupons";
import PurchaseHistory from "./PurchaseHistory";
import ModalWarning from "./ModalWarning";
import IconHeader from "../common/IconHeader";
import {getPreference, storePreference} from "../../utils/storage";
import {CheckBox} from "../common";
import { useTranslation } from 'react-i18next';

const ONE_COUPON = new BigNumber(10).pow(18);

function CouponMarket({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }
  const { t, i18n } = useTranslation();
  const storedHideRedeemed = getPreference('hideRedeemedCoupons', '0');

  const [balance, setBalance] = useState(new BigNumber(0));
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [supply, setSupply] = useState(new BigNumber(0));
  const [coupons, setCoupons] = useState(new BigNumber(0));
  const [redeemable, setRedeemable] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));
  const [hideRedeemed, setHideRedeemed] = useState(storedHideRedeemed === '1');

  useEffect(() => {
    if (user === '') {
      setBalance(new BigNumber(0));
      setAllowance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [balanceStr, allowanceStr] = await Promise.all([
        getTokenBalance(PEN.addr, user),
        getTokenAllowance(PEN.addr, user, PENS.addr),
      ]);

      const userBalance = toTokenUnitsBN(balanceStr, PEN.decimals);

      if (!isCancelled) {
        setBalance(new BigNumber(userBalance));
        setAllowance(new BigNumber(allowanceStr));
        (new BigNumber(allowanceStr));
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

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [supplyStr, debtStr, couponsStr, redeemableStr] = await Promise.all([
        getTokenTotalSupply(PEN.addr),
        getTotalDebt(PENS.addr),
        getTotalCoupons(PENS.addr),
        getTotalRedeemable(PENS.addr),
      ]);

      const totalSupply = toTokenUnitsBN(supplyStr, PEN.decimals);
      const totalDebt = toTokenUnitsBN(debtStr, PEN.decimals);
      const totalCoupons = toTokenUnitsBN(couponsStr, PEN.decimals);
      const totalRedeemable = toTokenUnitsBN(redeemableStr, PEN.decimals);

      if (!isCancelled) {
        setSupply(new BigNumber(totalSupply));
        setDebt(new BigNumber(totalDebt));
        setCoupons(new BigNumber(totalCoupons));
        setRedeemable(new BigNumber(totalRedeemable));

        if (totalDebt.isGreaterThan(new BigNumber(1))) {
          const couponPremiumStr = await getCouponPremium(PENS.addr, ONE_COUPON)
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, PEN.decimals));
        } else {
          setCouponPremium(new BigNumber(0));
        }
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
      <ModalWarning/>

      <IconHeader icon={<i className="fas fa-ticket-alt"/>} text={t("Coupon Market")}/>

      <CouponMarketHeader
        debt={debt}
        supply={supply}
        coupons={coupons}
        premium={couponPremium}
        redeemable={redeemable}
      />

      <Header primary={t("Purchase")} />

      <PurchaseCoupons
        user={user}
        allowance={allowance}
        balance={balance}
        debt={debt}
      />

      <div style={{ display: 'flex' }}>
        <Header primary={t("Coupons")} />
        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <CheckBox
            text={t("Hide Redeemed")}
            onCheck={(checked) => {
              storePreference('hideRedeemedCoupons', checked ? '1' : '0');
              setHideRedeemed(checked);
            }}
            checked={hideRedeemed}
          />
        </div>
      </div>

      <PurchaseHistory
        user={user}
        hideRedeemed={hideRedeemed}
        totalRedeemable={redeemable}
      />
    </>
  );
}

export default CouponMarket;
