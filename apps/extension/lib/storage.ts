export const STORAGE_KEY_TOKEN = 'revoos_extension_token';
export const STORAGE_KEY_APP_URL = 'revoos_app_url';
export const STORAGE_KEY_TOKEN_NAME = 'revoos_extension_token_name';

export async function getStoredToken(): Promise<string | null> {
  const result = await (chrome as any).storage.local.get(STORAGE_KEY_TOKEN);
  return (result[STORAGE_KEY_TOKEN] as string) || null;
}

export async function setStoredToken(token: string, name?: string): Promise<void> {
  const payload: Record<string, string> = { [STORAGE_KEY_TOKEN]: token };
  if (name) payload[STORAGE_KEY_TOKEN_NAME] = name;
  await (chrome as any).storage.local.set(payload);
}

export async function clearStoredToken(): Promise<void> {
  await (chrome as any).storage.local.remove([STORAGE_KEY_TOKEN, STORAGE_KEY_TOKEN_NAME]);
}

export async function getAppUrl(): Promise<string> {
  const result = await (chrome as any).storage.local.get(STORAGE_KEY_APP_URL);
  const stored = result[STORAGE_KEY_APP_URL] as string | undefined;
  const env = (import.meta as any).env as { WXT_APP_URL?: string } | undefined;
  return stored || env?.WXT_APP_URL || 'http://localhost:3000';
}

export async function setAppUrl(url: string): Promise<void> {
  await (chrome as any).storage.local.set({ [STORAGE_KEY_APP_URL]: url });
}
