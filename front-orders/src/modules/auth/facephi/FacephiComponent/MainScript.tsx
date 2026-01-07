import Script from 'next/script';
import React from 'react';

const MainScript: React.FC = () => {
  // Genera un parámetro de consulta único basado en la marca de tiempo actual
  const cacheBust = new Date().getTime();

  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <Script
      src={`/assets/scripts/main.js?cache_bust=${cacheBust}`}
      strategy='beforeInteractive'
    />
  );
};

export default MainScript;
