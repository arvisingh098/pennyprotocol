import React, { useState } from 'react';
import {
  Box, Button, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { removeLiquidity } from '../../utils/web3';
import { useTranslation } from 'react-i18next';
import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import { toBaseUnitBN } from '../../utils/number';
import {decreaseWithSlippage} from "../../utils/calculation";
import {PEN, UNI, USDC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type RemoveLiquidityProps = {
  userBalanceUNI: BigNumber,
  pairBalancePEN: BigNumber,
  pairBalanceUSDC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}


function RemoveLiquidity({
  userBalanceUNI,
  pairBalancePEN,
  pairBalanceUSDC,
  pairTotalSupplyUNI,
}: RemoveLiquidityProps) {
  const { t, i18n } = useTranslation();
  const [withdrawAmountUNI, setWithdrawAmountUNI] = useState(new BigNumber(0));

  const poolPortion = withdrawAmountUNI.div(pairTotalSupplyUNI);
  const estimatedUSDCReceived = pairBalanceUSDC.times(poolPortion);
  const estimatedPENReceived = pairBalancePEN.times(poolPortion);

  const minUSDCReceived = decreaseWithSlippage(estimatedUSDCReceived);
  const minPENReceived = decreaseWithSlippage(estimatedPENReceived);

  const onChangeWithdrawAmountUNI = (amountUNI) => {
    if (!amountUNI) {
      setWithdrawAmountUNI(new BigNumber(0));
      return;
    }
    const amountUNIBN = new BigNumber(amountUNI);
    setWithdrawAmountUNI(amountUNIBN);
  };

  return (
    <Box heading={t("Remove Liquidity")}>
      <div style={{ display: 'flex' }}>
        {/* Pool Token in Hold */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset={t("Pair Token Balance")} balance={userBalanceUNI} />
        </div>
        {/* Remove */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="UNI-V2"
                value={withdrawAmountUNI}
                setter={onChangeWithdrawAmountUNI}
              />
              <MaxButton
                onClick={() => setWithdrawAmountUNI(userBalanceUNI)}
              />
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <PriceSection label={t("You get ")} amt={estimatedUSDCReceived} symbol=" USDC" />
                <PriceSection label="+ " amt={estimatedPENReceived} symbol=" PEN" />
              </>
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label={t("Remove Liquidity")}
                onClick={() => {
                  removeLiquidity(
                    toBaseUnitBN(withdrawAmountUNI, UNI.decimals),
                    toBaseUnitBN(minPENReceived, PEN.decimals),
                    toBaseUnitBN(minUSDCReceived, USDC.decimals),
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

export default RemoveLiquidity;
