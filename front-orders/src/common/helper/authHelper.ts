/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import eventEmitter from '@/common/helper/eventEmitterHelper';
import { ILoginResponse } from '@/common/interfaces/auth.interface';
import { persistor } from '@/redux';

const AUTH_LOCAL_STORAGE_KEY = 'auth_token';
const MESSAGE_USER_NOT_FOUND = 'User not found';

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  } else {
    return false;
  }
}

const getAuth = (): ILoginResponse | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }
  try {
    const auth: ILoginResponse = JSON.parse(lsValue) as ILoginResponse;
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: ILoginResponse, isRemembered: boolean) => {
  if (!localStorage) {
    return;
  }

  try {
    if (isRemembered) {
      document.cookie = `stayLoggedIn=${auth.token}`;
    } else {
      document.cookie = `stayLoggedIn=; Path=/;`;
    }
    Cookies.remove(AUTH_LOCAL_STORAGE_KEY);
    Cookies.set(AUTH_LOCAL_STORAGE_KEY, auth.token);
    const lsValue = JSON.stringify(auth);

    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    document.cookie = `${AUTH_LOCAL_STORAGE_KEY}=; Path=/;`;
    document.cookie = `stayLoggedIn=; Path=/;`;
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    persistor.purge();
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const refreshAuth = (authorization: string) => {
  const token = authorization.substring(7, authorization.length);

  if (!localStorage) {
    return;
  }

  try {
    document.cookie = `${AUTH_LOCAL_STORAGE_KEY}=${token}`;
    const lsValue = JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!);
    lsValue.token = token;
    setAuth(lsValue as ILoginResponse, false);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

export function setupAxios(axios: AxiosInstance) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const auth = getAuth();

      if (auth && auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );
  axios.interceptors.response.use(
    (response) => {
      if (response.headers.authorization) {
        refreshAuth(response.headers.authorization);
      }
      return response;
    },
    (error) => {
      if (
        error.response.status === 401 ||
        (error.response.status === 400 &&
          error.response.data?.message === MESSAGE_USER_NOT_FOUND)
      ) {
        // open modal for expired token
        eventEmitter.emit('unauthorized', { message: 'Token expired' });
      }
      if (error.response.status === 403) {
        console.error('no tienes permisos');
      }
      if (error.response.status === 404) {
        console.error('error del servidor');
      }
      if (
        error.response.status === 500 &&
        !error.config.url.includes('update-data-treatment')
      ) {
        window.location.href = '/500';
      }

      return Promise.reject(error);
    }
  );
}

export function setupNoTokenAxios(axios: AxiosInstance) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export function hideEmail(email: string) {
  const parts = email.split('@');
  const username = parts[0];
  let hidden = username.charAt(0);

  for (let i = 1; i < 5; i++) {
    hidden += '*';
  }

  return (
    hidden +
    username.slice(username.length - 2, username.length) +
    '@' +
    parts[1]
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
