import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, LinkBase, Tag,
} from '@aragon/ui';
import EpochBlock from "../common/EpochBlock";
import {getEpoch} from '../../utils/infura';
import {PENS} from "../../constants/tokens";
import { useTranslation } from 'react-i18next';

function epochformatted() {
  const epochStart = 1609790400;
  const epochPeriod = 1 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `-0${0}:${epochMinute > 9 ?epochMinute : "0" + epochMinute.toString()}:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

type HomePageProps = {
  user: string
};

function HomePage({user}: HomePageProps) {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [epochTime, setEpochTime] = useState("0-00:00:00");
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    let epochStr = '0';
    console.log(user);
    

    async function updateUserInfo() {
      if(user != '')
      {
        epochStr = await getEpoch(PENS.addr);
      }
  
      if (!isCancelled) {
        setEpoch(parseInt(epochStr, 10));
        setEpochTime(epochStr + epochformatted());
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '68%' }} />
        <div style={{ flexBasis: '30%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <EpochBlock epoch={epochTime}/>
          </Box>
        </div>
      </div>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="DAO"
            description={t("Earn rewards for governing")}
            icon={<i className="fas fa-dot-circle"/>}
            onClick={() => {
              history.push('/dao/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title={t("LP Rewards")}
            description={t("Earn rewards for providing liquidity.")}
            icon={<i className="fas fa-parachute-box"/>}
            onClick={() => {
              history.push('/pool/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
            title={t("Regulation")}
            description={t("Network supply regulation statistics.")}
            icon={<i className="fas fa-chart-area"/>}
            onClick={() => {
              history.push('/regulation/');
            }}
          />
        </div>
      </div>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%' }}>
          <MainButton
            title={t("Governance")}
            description={t("Vote on upgrades.")}
            icon={<i className="fas fa-poll"/>}
            onClick={() => {
              history.push('/governance/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title={t("Trade")}
            description={t("Trade Pen tokens.")}
            icon={<i className="fas fa-exchange-alt"/>}
            onClick={() => {
              history.push('/trade/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%'  }}>
          <MainButton
            title={t("Coupons")}
            description={t("Purchase and redeem coupons.")}
            icon={<i className="fas fa-ticket-alt"/>}
            onClick={() => {
              history.push('/coupons/');
            }}
          />
        </div>
        </div>
        <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '35%' }}>
          <MainButton
            title={t("Epoch Details")}
            description={t("Epoch with historical details.")}
            icon={<i className="fas fa-retweet"/>}
            onClick={() => {
              history.push('/epoch/');
            }}
          />
        </div>
      </div>
    </>
  );
}

type MainButtonPropx = {
  title: string,
  description: string,
  icon: any,
  onClick: Function,
  tag?:string
}

function MainButton({
  title, description, icon, onClick, tag,
}:MainButtonPropx) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
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

export default HomePage;
