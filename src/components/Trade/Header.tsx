import React from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalancePEN: BigNumber,
  pairBalanceUSDC: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalancePEN, pairBalanceUSDC, uniswapPair,
}: TradePageHeaderProps) => {
  const { t, i18n } = useTranslation();
  const price = pairBalanceUSDC.dividedBy(pairBalancePEN);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset={t("PEN Price")} balance={price} suffix={"USDC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset={t("PEN Liquidity")} balance={pairBalancePEN} suffix={"PEN"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset={t("USDC Liquidity")} balance={pairBalanceUSDC} suffix={"USDC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <>
          <AddressBlock label={t("Uniswap Contract")} address={uniswapPair} />
        </>
      </div>
    </div>
  );
}


export default TradePageHeader;
