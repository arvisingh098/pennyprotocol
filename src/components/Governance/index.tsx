import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getImplementation,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
} from '../../utils/infura';
import {PENS} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import GovernanceHeader from "./Header";
import ProposeCandidate from "./ProposeCandidate";
import CandidateHistory from "./CandidateHistory";
import IconHeader from "../common/IconHeader";
import {canPropose} from "../../utils/gov";
import { useTranslation } from 'react-i18next';

function Governance({ user }: {user: string}) {
  const { t, i18n } = useTranslation();
  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [implementation, setImplementation] = useState("0x");

  useEffect(() => {
    if (user === '') {
      setStake(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [statusStr, stakeStr] = await Promise.all([
        getStatusOf(PENS.addr, user),
        getTokenBalance(PENS.addr, user),
      ]);

      if (!isCancelled) {
        setStake(toTokenUnitsBN(stakeStr, PENS.decimals));
        setUserStatus(parseInt(statusStr, 10));
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

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [totalStakeStr, implementationStr] = await Promise.all([
        getTokenTotalSupply(PENS.addr),
        getImplementation(PENS.addr),
      ]);

      if (!isCancelled) {
        setTotalStake(toTokenUnitsBN(totalStakeStr, PENS.decimals));
        setImplementation(implementationStr)
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
      <IconHeader icon={<i className="fas fa-poll"/>} text={t("Governance")}/>

      <GovernanceHeader
        stake={stake}
        totalStake={totalStake}
        accountStatus={userStatus}
        implementation={implementation}
      />

      {
        canPropose(stake, totalStake) ?
          <>
            <Header primary={t("Propose Candidate")}/>
            <ProposeCandidate
              user={user}
              stake={stake}
              totalStake={totalStake}
              accountStatus={userStatus}
            />
          </>
          :
          ''
      }

      <Header primary={t("Candidate History")} />

      <CandidateHistory user={user}/>
    </>
  );
}

export default Governance;
