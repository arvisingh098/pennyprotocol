import React from 'react';
import { BalanceBlock, AddressBlock } from '../common/index';
import NumberBlock from "../common/NumberBlock";
import TextBlock from "../common/TextBlock";
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';

type AccountPageHeaderProps = {
  epoch: number,
  epochTime: number,
  spotPrice: BigNumber,
  twapPrice: string,
  nextEpochs: string,
  price: BigNumber,
  epochTimes: string
};

function EpochPageHeader ({
  epoch, 
  epochTime,
  spotPrice, 
  twapPrice, 
  nextEpochs, 
  epochTimes,
  price

}: AccountPageHeaderProps) {
  const { t, i18n } = useTranslation();
  return (

  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <NumberBlock title={t("Current")} num={epoch} />
    </div>
   <div style={{ flexBasis: '25%' }}>
        <TextBlock label={t("Next Epoch")} text={epochTimes}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset={t("Spot Price")} balance={price} suffix={"USDC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset={t("TWAP Price")} balance={price} suffix={"USDC"}/>
      </div>
    <div style={{ width: '25%' }}>
      <TextBlock label={t("Period")} text={epoch >= 0 ? "1 hours" : "1 hours"}/>
    </div>
  </div>
);
}

export default EpochPageHeader;
