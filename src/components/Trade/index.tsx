import React, { useState, useEffect } from 'react';
import { LinkBase, Box } from '@aragon/ui';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { getTokenBalance } from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';

import TradePageHeader from './Header';
import {PEN, UNI, USDC} from "../../constants/tokens";
import IconHeader from "../common/IconHeader";


function UniswapPool({ user }: {user: string}) {
  const { t, i18n } = useTranslation();
  const [pairBalancePEN, setPairBalancePEN] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        pairBalancePENStr, pairBalanceUSDCStr,
      ] = await Promise.all([
        getTokenBalance(PEN.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalancePEN(toTokenUnitsBN(pairBalancePENStr, PEN.decimals));
        setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals));
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
      <IconHeader icon={<i className="fas fa-exchange-alt"/>} text={t("Trade")}/>

      <TradePageHeader
        pairBalancePEN={pairBalancePEN}
        pairBalanceUSDC={pairBalanceUSDC}
        uniswapPair={UNI.addr}
      />

      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title={t("Info")}
            description={t("View PEN-USDC pool stats.")}
            icon={<i className="fas fa-chart-area"/>}
            href={"https://uniswap.info/pair/0x365c6ABA69791356B550671718c1e3C11b865c4B"}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title={t("Trade")}
            description={t("Trade Pen tokens.")}
            icon={<i className="fas fa-exchange-alt"/>}
            href={"https://uniswap.exchange/swap?inputCurrency=0x1b3924f88A5ee1D9C86b97dce55d99d4B22dB569&outputCurrency=0xa63fae5e28c5310d54581c0af34ee7472ff4dd6d"}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
            title={t("Supply")}
            description={t("Supply and redeem liquidity.")}
            icon={<i className="fas fa-water"/>}
            href={"https://uniswap.exchange/add/0xa63fae5e28c5310d54581c0af34ee7472ff4dd6d/0x1b3924f88A5ee1D9C86b97dce55d99d4B22dB569"}
          />
        </div>
      </div>
    </>
  );
}

type MainButtonProps = {
  title: string,
  description: string,
  icon: any,
  href:string
}

function MainButton({
  title, description, icon, href,
}:MainButtonProps) {
  return (
    <LinkBase href={href} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default UniswapPool;
