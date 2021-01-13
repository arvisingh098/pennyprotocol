import React, { useState } from 'react';
import {
  Box, Button, IconArrowUp, IconCirclePlus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, providePool} from '../../utils/web3';
import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {PEN, USDC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";
import { useTranslation } from 'react-i18next';

type ProvideProps = {
  poolAddress: string,
  user: string,
  rewarded: BigNumber,
  pairBalancePEN: BigNumber,
  pairBalanceUSDC: BigNumber,
  userUSDCBalance: BigNumber,
  userUSDCAllowance: BigNumber,
  status: number,
};

function Provide({
  poolAddress, user, rewarded, pairBalancePEN, pairBalanceUSDC, userUSDCBalance, userUSDCAllowance, status
}: ProvideProps) {
  const { t, i18n } = useTranslation();
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const USDCToPENRatio = pairBalanceUSDC.isZero() ? new BigNumber(1) : pairBalanceUSDC.div(pairBalancePEN);

  const onChangeAmountPEN = (amountPEN) => {
    if (!amountPEN) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountPENBN = new BigNumber(amountPEN)
    setProvideAmount(amountPENBN);

    const amountPENBU = toBaseUnitBN(amountPENBN, PEN.decimals);
    const newAmountUSDC = toTokenUnitsBN(
      amountPENBU.multipliedBy(USDCToPENRatio).integerValue(BigNumber.ROUND_FLOOR),
      PEN.decimals);
    setUsdcAmount(newAmountUSDC);
  };

  return (
    <Box heading={t("Provide")}>
      {userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset={t("Rewarded")} balance={rewarded} suffix={"PEN"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset={t("USDC Balance")} balance={userUSDCBalance} suffix={"USDC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Provide liquidity using Pool rewards */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="PEN"
                    value={provideAmount}
                    setter={onChangeAmountPEN}
                    disabled={status === 1}
                  />
                  <PriceSection label={t("Requires ")} amt={usdcAmount} symbol=" USDC"/>
                  <MaxButton
                    onClick={() => {
                      onChangeAmountPEN(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconArrowUp/>}
                  label={t("Provide")}
                  onClick={() => {
                    providePool(
                      poolAddress,
                      toBaseUnitBN(provideAmount, PEN.decimals),
                      (hash) => setProvideAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || status !== 0 || !isPos(provideAmount) || usdcAmount.isGreaterThan(userUSDCBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset={t("Rewarded")} balance={rewarded} suffix={"PEN"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset={t("USDC Balance")} balance={userUSDCBalance} suffix={"USDC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Approve Pool to spend USDC */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label={t("Approve")}
              onClick={() => {
                approve(USDC.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> {t("Zap your rewards directly to LP by providing more USDC")} </span>
      </div>
    </Box>
  );
}

export default Provide;
