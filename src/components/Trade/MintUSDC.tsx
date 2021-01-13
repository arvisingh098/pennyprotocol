import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetUSDC} from '../../utils/web3';
import { useTranslation } from 'react-i18next';
import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {USDC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintUSDCProps = {
  user: string,
  userBalanceUSDC: BigNumber,
}


function MintUSDC({
  user, userBalanceUSDC
}: MintUSDCProps) {
  const { t, i18n } = useTranslation();
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading={t("Mint")}>
      <div style={{ display: 'flex' }}>
        {/* USDC balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset={t("USDC Balance")} balance={userBalanceUSDC} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="USDC"
                value={mintAmount}
                setter={setMintAmount}
              />
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label={t("Mint")}
                onClick={() => {
                  mintTestnetUSDC(toBaseUnitBN(mintAmount, USDC.decimals));
                }}
                disabled={user === '' || !isPos(mintAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MintUSDC;
