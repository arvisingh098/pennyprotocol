import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import './style.css';
import { useTranslation } from 'react-i18next';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import TotalBalance from "./TotalBalance";
import ConnectModal from './ConnectModal';

type connectButtonProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function ConnectButton({ hasWeb3, user, setUser }: connectButtonProps) {
  const { t, i18n } = useTranslation();
  const { status, reset } = useWallet();

  const [isWeb3Connected, setIsWeb3Connected] = useState(false);

  const connectWeb3 = async () => {
    const address = await connect();
    if(address == false) return;
    setIsWeb3Connected(true);
    setUser(address);
  };

  const disconnectWeb3 = async () => {
    setIsWeb3Connected(false);
    setUser('');
    // reset();
  };

  // const toggleModal = () => setModalOpen(!isModalOpen);

  return isWeb3Connected ? (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1'}}/>
      <div>
        <Box padding={4} style={{width: '192px'}}>
          <div style={{display: 'flex'}}>
            <div>
              <LinkBase onClick={disconnectWeb3} style={{marginRight: '8px', height: '24px'}}>
                <IconPower />
              </LinkBase>
            </div>
            <div style={{flex: '1', textAlign: 'right'}}>
              <IdentityBadge entity={user} />
            </div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1', textAlign: 'right'}}>
              <TotalBalance user={user} />
            </div>
          </div>
        </Box>
      </div>
    </div>
  ) : (
    <>
      <Button icon={<IconConnect />} label={t("Connect")} onClick={connectWeb3} disabled={!hasWeb3}/>
    </>
  );
}

type linkButtonProps = {
  title:string,
  onClick: Function,
  isSelected?:boolean
}

function LinkButton({ title, onClick, isSelected = false }:linkButtonProps) {
  return (
      <LinkBase onClick={onClick} style={{marginLeft: '8px', marginRight: '8px', height: '40px'}}>
        <div style={{ padding: '1%', opacity: isSelected ? 1 : 0.5, fontSize: 17 }}>{title}</div>
      </LinkBase>
  );
}


export default ConnectButton;
