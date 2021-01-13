import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function NavBar({
  hasWeb3, user, setUser,
}:NavbarProps) {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const currentTheme = useTheme();
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState("");

  useEffect(() => {
    return history.listen((location) => {
      setPage(location.pathname)
    })
  }, [hasWeb3, user, history]);

  const logoUrl = `./logo/logo_${currentTheme._name === 'light' ? 'black' : 'white'}.svg`

  return (
    <>
      <div style={{
        borderTop: '1px solid ' + currentTheme.border,
        backgroundColor: 'none',
        textAlign: 'center',
        height: '128px',
        width: '100%',
        fontSize: '14px'
      }}>
        <div style={{maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto'}}>
          <div style={{ display: 'flex', paddingTop: '24px'}}>
            <div style={{ width: '20%', textAlign: 'left'}}>
              <LinkBase onClick={() => history.push('/')} style={{marginRight: '16px', height: '40px'}}>
                <img src={logoUrl} height="40px" alt="Penny Protocol"/>
              </LinkBase>
            </div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <div className="dropdown" >
              <button className="dropbtn">{t("Lang")}</button>
              <div className="dropdown-content">
                <LinkButton title="En" onClick={() => i18n.changeLanguage('en')}/>
                <LinkButton title="SCH" onClick={() => i18n.changeLanguage('sch')}/>
                <LinkButton title="TCH" onClick={() => i18n.changeLanguage('tch')}/>
              </div>
            </div>
              <LinkButton title={t("DAO")} onClick={() => history.push('/dao/')} isSelected={page.includes('/dao')}/>
              <LinkButton title={t("Liquidity")} onClick={() => history.push('/pool/')} isSelected={page.includes('/pool')}/>
              <LinkButton title={t("Regulation")} onClick={() => history.push('/regulation/')} isSelected={page.includes('/regulation')}/>
              <LinkButton title={t("Governance")} onClick={() => history.push('/governance/')} isSelected={page.includes('/governance')}/>
              <LinkButton title={t("Trade")} onClick={() => history.push('/trade/')} isSelected={page.includes('/trade')}/>
              <LinkButton title={t("Coupons")} onClick={() => history.push('/coupons/')} isSelected={page.includes('/coupons')}/>
            </div>
            <div style={{ width: '20%', textAlign: 'right'}}>
              <ConnectButton hasWeb3={hasWeb3} user={user} setUser={setUser} />
            </div>
          </div>
        </div>
      </div>
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

export default NavBar;
