import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';
import { useTranslation } from 'react-i18next';
import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {PEN, UNI, USDC} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalancePEN: BigNumber,
  userBalanceUSDC: BigNumber,
  pairBalancePEN: BigNumber,
  pairBalanceUSDC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalancePEN,
  userBalanceUSDC,
  pairBalancePEN,
  pairBalanceUSDC,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const { t, i18n } = useTranslation();
  const [amountUSDC, setAmountUSDC] = useState(new BigNumber(0));
  const [amountPEN, setAmountPEN] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const USDCToPENRatio = pairBalanceUSDC.isZero() ? new BigNumber(1) : pairBalanceUSDC.div(pairBalancePEN);
  const PENToUSDCRatio = pairBalancePEN.isZero() ? new BigNumber(1) : pairBalancePEN.div(pairBalanceUSDC);

  const onChangeAmountUSDC = (amountUSDC) => {
    if (!amountUSDC) {
      setAmountPEN(new BigNumber(0));
      setAmountUSDC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountUSDCBN = new BigNumber(amountUSDC)
    setAmountUSDC(amountUSDCBN);

    const amountUSDCBU = toBaseUnitBN(amountUSDCBN, USDC.decimals);
    const newAmountPEN = toTokenUnitsBN(
      amountUSDCBU.multipliedBy(PENToUSDCRatio).integerValue(BigNumber.ROUND_FLOOR),
      USDC.decimals);
    setAmountPEN(newAmountPEN);

    const newAmountPENBU = toBaseUnitBN(newAmountPEN, PEN.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalancePENBU = toBaseUnitBN(pairBalancePEN, PEN.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountPENBU).div(pairBalancePENBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountPEN = (amountPEN) => {
    if (!amountPEN) {
      setAmountPEN(new BigNumber(0));
      setAmountUSDC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountPENBN = new BigNumber(amountPEN)
    setAmountPEN(amountPENBN);

    const amountPENBU = toBaseUnitBN(amountPENBN, PEN.decimals);
    const newAmountUSDC = toTokenUnitsBN(
      amountPENBU.multipliedBy(USDCToPENRatio).integerValue(BigNumber.ROUND_FLOOR),
      PEN.decimals);
    setAmountUSDC(newAmountUSDC);

    const newAmountUSDCBU = toBaseUnitBN(newAmountUSDC, USDC.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceUSDCBU = toBaseUnitBN(pairBalanceUSDC, USDC.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountUSDCBU).div(pairBalanceUSDCBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading={t("Add Liquidity")}>
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset={t("USDC Balance")} balance={userBalanceUSDC} />
        </div>
        {/* Add liquidity to pool */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <BigNumberInput
                  adornment="PEN"
                  value={amountPEN}
                  setter={onChangeAmountPEN}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountPEN(userBalancePEN);
                  }}
                />
              </>
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="USDC"
                value={amountUSDC}
                setter={onChangeAmountUSDC}
              />
              <PriceSection label={t("Mint ")} amt={amountUNI} symbol={t(" Pool Tokens")} />
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label={t("Add Liquidity")}
                onClick={() => {
                  const amountPENBU = toBaseUnitBN(amountPEN, PEN.decimals);
                  const amountUSDCBU = toBaseUnitBN(amountUSDC, USDC.decimals);
                  addLiquidity(
                    amountPENBU,
                    amountUSDCBU,
                    SLIPPAGE,
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}


export default AddLiquidity;
