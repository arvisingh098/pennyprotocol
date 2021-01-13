import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonBase,
} from '@aragon/ui';

function MaxButton({ onClick }:{ onClick: Function }) {
  const { t, i18n } = useTranslation();
  return (
    <div style={{ padding: 3 }}>
      <ButtonBase onClick={onClick}>
        <span style={{ opacity: 0.5 }}> {t("Max")} </span>
      </ButtonBase>
    </div>
  );
}

export default MaxButton;
