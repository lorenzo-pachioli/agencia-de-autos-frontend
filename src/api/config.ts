const CONFIG_KEY = 'agencia_api_config';

export interface ApiConfig {
  baseUrl: string;
  token: string;
}

export const getConfig = (): ApiConfig => {
  const raw = localStorage.getItem(CONFIG_KEY);
  return raw ? JSON.parse(raw) : { baseUrl: 'http://localhost:8080', token: '' };
};

export const saveConfig = (config: ApiConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};
