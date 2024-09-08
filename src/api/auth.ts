// src/auth.ts
import {
  AUTH_CODE,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  AMOCRM_SUBDOMAIN,
} from '../config';

const TOKEN_STORAGE_KEY = 'amocrm_tokens';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number; // Время в секундах
  created_at: number; // Время создания токена
}

export const getTokenData = (): TokenData | null => {
  const tokenDataString = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (tokenDataString) {
    return JSON.parse(tokenDataString);
  }
  return null;
};

const saveTokenData = (tokenData: TokenData) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
};

const fetchAccessToken = async (): Promise<void> => {
  try {
    const response = await fetch(
      `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: AUTH_CODE,
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка получения токена доступа');
    }

    const data = await response.json();
    const tokenData: TokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      created_at: Date.now(),
    };

    saveTokenData(tokenData);
  } catch (error) {
    console.error(error);
  }
};

export const refreshAccessToken = async (): Promise<void> => {
  const tokenData = getTokenData();
  if (!tokenData) {
    await fetchAccessToken();
    return;
  }

  try {
    const response = await fetch(
      `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: tokenData.refresh_token,
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка обновления токена доступа');
    }

    const data = await response.json();
    const newTokenData: TokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      created_at: Date.now(),
    };

    saveTokenData(newTokenData);
  } catch (error) {
    console.error(error);
  }
};

export const getAccessToken = async (): Promise<string> => {
  let tokenData = getTokenData();

  if (!tokenData) {
    await fetchAccessToken();
    tokenData = getTokenData();
  }

  if (tokenData) {
    const currentTime = Date.now();
    const expirationTime = tokenData.created_at + tokenData.expires_in * 1000;

    if (currentTime > expirationTime) {
      await refreshAccessToken();
      tokenData = getTokenData();
    }

    return tokenData?.access_token || '';
  }

  throw new Error('Токен доступа не найден');
};
