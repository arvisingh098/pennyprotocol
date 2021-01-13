import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { approve } from '../../utils/web3';
import { useTranslation } from 'react-i18next';
import {PEN, USDC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {UniswapV2Router02} from "../../constants/contracts";

type UniswapApproveCollateralProps = {
  user: string,
  userAllowancePEN: BigNumber
  userAllowanceUSDC: BigNumber
};

function UniswapApproveCollateral({
  user, userAllowancePEN, userAllowanceUSDC,
}: UniswapApproveCollateralProps) {
  const { t, i18n } = useTranslation();
  return (
    <Box heading={t("Unlock for Uniswap")}>
      <div style={{display: 'flex'}}>
        <div style={{width: '40%'}} />
        {/* Approve Uniswap Router to spend PEN */}
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label={t("Unlock PEN")}
            onClick={() => {
              approve(PEN.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowancePEN.comparedTo(MAX_UINT256) === 0}
          />
        </div>
        {/* Approve Uniswap Router to spend USDC */}
        <div style={{width: '6%'}} />
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label={t("Unlock USDC")}
            onClick={() => {
              approve(USDC.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceUSDC.comparedTo(MAX_UINT256.dividedBy(2)) > 0}
          />
        </div>
      </div>
    </Box>
  );
}

export default UniswapApproveCollateral;