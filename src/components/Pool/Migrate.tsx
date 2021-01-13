import React, { useState } from 'react';
import {
  Box, Button, IconArrowDown, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock,
} from '../common/index';
import { useTranslation } from 'react-i18next';
import {claimPool, unbondPool, withdrawPool} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {PEN, UNI} from "../../constants/tokens";

type MigrateProps = {
  legacyPoolAddress: string,
  staged: BigNumber,
  claimable: BigNumber,
  bonded: BigNumber,
  status: number,
  isRewardNegative: boolean,
};

function Migrate({
  legacyPoolAddress, staged, claimable, bonded, status, isRewardNegative
}: MigrateProps) {
  const [unbonded, setUnbonded] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { t, i18n } = useTranslation();
  return (
    <Box heading={t("Migrate")}>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset={t("Bonded")} balance={bonded} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label={t("Unbond")}
                onClick={() => {
                  unbondPool(
                    legacyPoolAddress,
                    toBaseUnitBN(bonded, UNI.decimals),
                    (hash) => setUnbonded(hash.length > 0)
                  );
                }}
                disabled={legacyPoolAddress === '' || !isPos(bonded) || unbonded || isRewardNegative}
              />
            </div>
          </div>
        </div>
        {/* Withdraw UNI-V2 within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset={t("Staged")} balance={staged} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label={t("Withdraw")}
                onClick={() => {
                  withdrawPool(
                    legacyPoolAddress,
                    toBaseUnitBN(staged, UNI.decimals),
                    (hash) => setWithdrawn(hash.length > 0)
                  );
                }}
                disabled={legacyPoolAddress === '' || !isPos(staged) || withdrawn || status !== 0}
              />
            </div>
          </div>
        </div>
        {/* Claim PEN within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset={t("Claimable")} balance={claimable} suffix={"PEN"} />
              <Button
                wide
                icon={<IconArrowDown/>}
                label={t("Claim")}
                onClick={() => {
                  claimPool(
                    legacyPoolAddress,
                    toBaseUnitBN(claimable, PEN.decimals),
                    (hash) => setClaimed(hash.length > 0)
                  );
                }}
                disabled={legacyPoolAddress === '' || !isPos(claimable) || claimed || status !== 0}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Migrate;
