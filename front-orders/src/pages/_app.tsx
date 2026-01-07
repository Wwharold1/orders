/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import clsx from 'clsx';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import 'animate.css/animate.min.css';
import '@/styles/globals.css';

import { WhatsappButton } from '@/common/components/WhatsappButton';
import {
  getCookie,
  removeAuth,
  setupAxios,
  setupNoTokenAxios,
} from '@/common/helper/authHelper';
import { prudentialModern } from '@/common/helper/fontHelper';
import { apiUrl, noTokenApiUrl } from '@/common/utils/axios';
import { persistor, store } from '@/redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
setupAxios(apiUrl);
setupNoTokenAxios(noTokenApiUrl);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!getCookie('stayLoggedIn') && router.pathname === '/') {
      removeAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactQueryDevtools initialIsOpen={false} />
          <main className={clsx(prudentialModern.variable, 'font-primary')}>
            <GoogleReCaptchaProvider
              reCaptchaKey={process.env.NEXT_GOOGLE_RECAPTCHA_KEY || ''}
              scriptProps={{
                async: false,
                defer: false,
                appendTo: 'head',
                nonce: undefined,
              }}
            >
              <Component {...pageProps} />
            </GoogleReCaptchaProvider>
            <WhatsappButton />
          </main>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
