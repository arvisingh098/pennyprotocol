import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import {advance} from '../../utils/web3';
import NumberBlock from "../common/NumberBlock";
import {PENS} from "../../constants/tokens";
import BigNumber from 'bignumber.js';
import { BalanceBlock } from '../common/index';
import { useTranslation } from 'react-i18next';

type AdvanceEpochProps = {
  user: string,
  epoch: number,
  epochTime: number,
  spotPrice: BigNumber,
  twapPrice: string,
  nextEpochs: string,
  price: BigNumber,
  couponPremium: BigNumber,
  totalSupply: BigNumber
}

function AdvanceEpoch({
  user,
  epoch,
  epochTime,
  spotPrice, 
  twapPrice, 
  nextEpochs, 
  price,
  couponPremium, 
  totalSupply
}: AdvanceEpochProps) {
  const { t, i18n } = useTranslation();
  const twapPrices = Number(price);
  const taotalSuplly = Number(totalSupply);
  let factorPrice;
  if(twapPrices < 1)
    factorPrice = 1 - twapPrices;
  else
     factorPrice = 0;

  factorPrice = taotalSuplly * factorPrice;

  return (
    <>
    <Box heading={t("Advance Epoch")}>
      <div style={{ display: 'flex' }}>
        {/* Epoch Time */}
        <div style={{ width: '30%' }}>
          <NumberBlock title={t("Epoch (from current time)")} num={epochTime} />
        </div>
        {/* Advance Epoch */}
        <div style={{ width: '40%' }}/>
        <div style={{ width: '30%', paddingTop: '2%' }}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label={t("Advance")}
            onClick={() => {
              advance(PENS.addr);
            }}
            disabled={user === '' || epoch >= epochTime}
          />
        </div>
      </div>
    </Box>
    <Box heading={t("Next Epoch")}>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{ flexBasis: '100%'}}>
            <h2><BalanceBlock asset="" balance={factorPrice} suffix={t("PEN Debt will increase in the next Epoch")}/></h2>
            <h2><BalanceBlock asset="" balance={couponPremium.multipliedBy(100)} suffix={t("% coupon premium. No reward for Bonding or LPing.")}/></h2>
        </div>
      </div>
    </Box>
    </>
  );
}


export default AdvanceEpoch;
