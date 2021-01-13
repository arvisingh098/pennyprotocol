import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, purchaseCoupons} from '../../utils/web3';
import { useTranslation } from 'react-i18next';
import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {PEN, PENS} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {getCouponPremium} from "../../utils/infura";
import BigNumberInput from "../common/BigNumberInput";

type PurchaseCouponsProps = {
  user: string,
  allowance: BigNumber,
  balance: BigNumber,
  debt: BigNumber,
};

function PurchaseCoupons({
  user, balance, allowance, debt,
}: PurchaseCouponsProps) {
  const { t, i18n } = useTranslation();
  const [purchaseAmount, setPurchaseAmount] = useState(new BigNumber(0));
  const [premium, setPremium] = useState(new BigNumber(0));

  const updatePremium = async (purchaseAmount) => {
    if (purchaseAmount.lte(new BigNumber(0))) {
      setPremium(new BigNumber(0));
      return;
    }
    const purchaseAmountBase = toBaseUnitBN(purchaseAmount, PEN.decimals);
    const premium = await getCouponPremium(PENS.addr, purchaseAmountBase)
    const premiumFormatted = toTokenUnitsBN(premium, PEN.decimals);
    setPremium(premiumFormatted);
  };

  return (
    <Box heading={t("Purchase")}>
      {allowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* User balance */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset={t(`Balance`)} balance={balance} suffix={" PEN"}/>
          </div>
          <div style={{flexBasis: '38%'}}/>
          {/* Purchase coupons */}
          <div style={{flexBasis: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="PEN"
                    value={purchaseAmount}
                    setter={(value) => {
                      setPurchaseAmount(value);
                      isPos(value) ? updatePremium(value) : updatePremium(new BigNumber(0));
                    }}
                  />
                  <MaxButton
                    onClick={() => {
                      const maxPurchaseAmount = debt.comparedTo(balance) > 0 ? balance : debt
                      setPurchaseAmount(maxPurchaseAmount);
                      updatePremium(maxPurchaseAmount);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconCircleMinus/>}
                  label={t("Burn")}
                  onClick={() => {
                    purchaseCoupons(
                      PENS.addr,
                      toBaseUnitBN(purchaseAmount, PEN.decimals),
                    );
                  }}
                  disabled={user === '' || debt.isZero() || balance.isZero() || !isPos(purchaseAmount)}
                />
              </div>
            </div>
            <PriceSection label={t("Coupons ")} amt={purchaseAmount.plus(premium)}/>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* User balance */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset={t(`PEN Balance`)} balance={balance}/>
          </div>
          <div style={{flexBasis: '40%'}}/>
          {/* Approve DAO to spend Døllar */}
          <div style={{flexBasis: '30%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label={t("Approve")}
              onClick={() => {
                approve(PEN.addr, PENS.addr);
              }}
              disabled={user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default PurchaseCoupons;
