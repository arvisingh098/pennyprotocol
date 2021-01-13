import React, {useEffect, useState} from 'react';
import {
  DataView, Button, IconCirclePlus
} from '@aragon/ui';

import {getBatchBalanceOfCoupons, getBatchCouponsExpiration, getCouponEpochs} from '../../utils/infura';
import {PEN, PENS} from "../../constants/tokens";
import {formatBN, toBaseUnitBN, toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import {redeemCoupons} from "../../utils/web3";
import { useTranslation } from 'react-i18next';

type PurchaseHistoryProps = {
  user: string,
  hideRedeemed: boolean,
  totalRedeemable: BigNumber
};

function PurchaseHistory({
  user, hideRedeemed, totalRedeemable
}: PurchaseHistoryProps) {
  const { t, i18n } = useTranslation();
  const [epochs, setEpochs] = useState([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const epochsFromEvents = await getCouponEpochs(PENS.addr, user);
      const epochNumbers = epochsFromEvents.map(e => parseInt(e.epoch));
      const balanceOfCoupons = await getBatchBalanceOfCoupons(PENS.addr, user, epochNumbers);
      const couponsExpirations = await getBatchCouponsExpiration(PENS.addr, epochNumbers);

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.balance = new BigNumber(balanceOfCoupons[i]);
        epoch.expiration = couponsExpirations[i];
        return epoch;
      });

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs);
        setInitialized(true);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, totalRedeemable]);

  return (
    <DataView
      fields={[t('Epoch'), t('Purchased'), t('Balance'), t('Expires'), '']}
      status={ initialized ? t('default') : t('loading') }
      // @ts-ignore
      entries={hideRedeemed ? epochs.filter((epoch) => !epoch.balance.isZero()) : epochs}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(epoch) => [
        epoch.epoch.toString(),
        formatBN(toTokenUnitsBN(epoch.coupons, PEN.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.balance, PEN.decimals), 2),
        epoch.expiration.toString(),
        <Button
          icon={<IconCirclePlus />}
          label={t("Redeem")}
          onClick={() => redeemCoupons(
            PENS.addr,
            epoch.epoch,
            epoch.balance.isGreaterThan(toBaseUnitBN(totalRedeemable, PEN.decimals))
              ? toBaseUnitBN(totalRedeemable, PEN.decimals)
              : epoch.balance
          )}
          disabled={epoch.balance.isZero()}
        />
      ]}
    />
  );
}

export default PurchaseHistory;
