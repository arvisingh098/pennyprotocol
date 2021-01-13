import React from 'react';
import { useTranslation } from 'react-i18next';

type EpochBlockProps = {
  epoch: string
}

function EpochBlock({ epoch }: EpochBlockProps) {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div style={{ fontSize: 16, padding: 3 }}>{t("Epoch")}</div>
      <div style={{ fontSize: 24, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>{epoch}</div>
    </>
  );
}

export default EpochBlock;
