import { useCallback, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { apiUrl, noTokenApiUrl, spectrumApiUrl } from '@/common/utils/axios';

export const useGoogleRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [token, setToken] = useState('');

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const token = await executeRecaptcha('yourAction');

    setToken(token);
    noTokenApiUrl.defaults.headers.common['x-recaptcha-response'] = token;
    apiUrl.defaults.headers.common['x-recaptcha-response'] = token;
    spectrumApiUrl.defaults.headers.common['x-recaptcha-response'] = token;
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleReCaptchaVerify,
    token,
  };
};
