import { useEffect, useMemo, useState } from 'react';

type TabInfo = {
  url: string;
  title: string;
};

type CaptureState = {
  status: 'idle' | 'loading' | 'saving' | 'success' | 'error';
  error?: string;
};

type AuthState = {
  token: string | null;
  loading: boolean;
};

const STORAGE_KEY = 'revoos_extension_token';
const APP_URL_KEY = 'revoos_app_url';

function getDefaultAppUrl() {
  const env = (import.meta as any).env as { WXT_APP_URL?: string } | undefined;
  return env?.WXT_APP_URL || 'http://localhost:3000';
}

async function getActiveTab(): Promise<TabInfo | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url || !tab.title) return null;
    return { url: tab.url, title: tab.title };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getSelection(): Promise<string | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return null;
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || '',
    });
    const text = results?.[0]?.result?.trim();
    return text ? text : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function captureScreenshot(): Promise<string | null> {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
    return dataUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function truncateUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.host + parsed.pathname;
  } catch {
    return url;
  }
}

export default function App() {
  const [tabInfo, setTabInfo] = useState<TabInfo | null>(null);
  const [selection, setSelection] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [auth, setAuth] = useState<AuthState>({ token: null, loading: true });
  const [capture, setCapture] = useState<CaptureState>({ status: 'idle' });
  const [appUrl, setAppUrl] = useState(getDefaultAppUrl());
  const [tokenInput, setTokenInput] = useState('');
  const [connectStatus, setConnectStatus] = useState<'idle' | 'validating' | 'error'>('idle');
  const [connectError, setConnectError] = useState('');

  useEffect(() => {
    (chrome as any).storage.local.get([STORAGE_KEY, APP_URL_KEY]).then((result: any) => {
      setAuth({ token: (result[STORAGE_KEY] as string) || null, loading: false });
      if (result[APP_URL_KEY]) {
        setAppUrl(result[APP_URL_KEY] as string);
      }
    });
  }, []);

  useEffect(() => {
    if (auth.loading || !auth.token) return;
    setCapture({ status: 'loading' });
    Promise.all([getActiveTab(), getSelection(), captureScreenshot()])
      .then(([tab, sel, shot]) => {
        setTabInfo(tab);
        setSelection(sel);
        setScreenshot(shot);
        setCapture({ status: 'idle' });
      })
      .catch((error) => {
        console.error(error);
        setCapture({ status: 'error', error: 'Failed to capture page context' });
      });
  }, [auth.loading, auth.token]);

  const connectUrl = useMemo(() => {
    const url = new URL('/settings?tab=extensions', appUrl);
    url.searchParams.set('source', 'extension');
    return url.toString();
  }, [appUrl]);

  const libraryUrl = useMemo(() => new URL('/library', appUrl).toString(), [appUrl]);

  async function handleDisconnect() {
    try {
      await (chrome as any).storage.local.remove([STORAGE_KEY]);
    } catch {}
    setAuth({ token: null, loading: false });
    setTokenInput('');
    setConnectStatus('idle');
    setConnectError('');
    setTabInfo(null);
    setSelection(null);
    setScreenshot(null);
    setNote('');
    setCapture({ status: 'idle' });
  }

  async function handleConnect() {
    const token = tokenInput.trim();
    if (!token || connectStatus === 'validating') return;
    setConnectStatus('validating');
    setConnectError('');
    try {
      const response = await fetch(`${appUrl}/api/extension/validate`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.error === 'upgrade_required') {
          setConnectError('Upgrade to Plus or Pro to use browser capture.');
        } else if (data.error === 'token_expired') {
          setConnectError('Token expired. Generate a new token in Settings.');
        } else if (data.error === 'rate_limited') {
          setConnectError('Too many attempts. Try again later.');
        } else {
          setConnectError('Invalid or revoked token.');
        }
        setConnectStatus('error');
        return;
      }
      await (chrome as any).storage.local.set({ [STORAGE_KEY]: token });
      setAuth({ token, loading: false });
      setConnectStatus('idle');
      setConnectError('');
    } catch {
      setConnectError('Network error. Check your connection.');
      setConnectStatus('error');
    }
  }

  async function handleSave() {
    if (!auth.token || !tabInfo) return;
    setCapture({ status: 'saving' });
    try {
      const response = await fetch(`${appUrl}/api/extension/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          url: tabInfo.url,
          title: tabInfo.title,
          selection,
          note: note.trim() || undefined,
          screenshot,
        }),
      });

      if (response.status === 403) {
        const data = await response.json().catch(() => ({}));
        if (data.error === 'upgrade_required') {
          setCapture({ status: 'error', error: 'Upgrade to Plus or Pro to use browser capture.' });
          return;
        }
      }

      if (response.status === 401) {
        setCapture({ status: 'error', error: 'Token expired or revoked. Reconnect the extension.' });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setCapture({ status: 'error', error: data.error || 'Failed to save to Revo OS.' });
        return;
      }

      setCapture({ status: 'success' });
    } catch (error) {
      console.error(error);
      setCapture({ status: 'error', error: 'Network error. Check your connection.' });
    }
  }

  if (auth.loading) {
    return (
      <div className="container">
        <header className="header">
          <div className="brand">
            <img src="/icon-32.png" alt="Revo OS" width={32} height={32} style={{ borderRadius: 8 }} />
            <div className="brand-text">
              <span className="brand-title">Revo OS</span>
              <span className="brand-subtitle">Loading</span>
            </div>
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <span className="helper-text">Preparing your workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!auth.token) {
    return (
      <div className="container">
        <header className="header">
          <div className="brand">
            <img src="/icon-32.png" alt="Revo OS" width={32} height={32} style={{ borderRadius: 8 }} />
            <div className="brand-text">
              <span className="brand-title">Revo OS</span>
              <span className="brand-subtitle">Connect your account</span>
            </div>
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <div className="field-group">
              <span className="label">Browser capture</span>
              <p className="helper-text" style={{ textAlign: 'left' }}>
                Save pages to Revo OS with screenshots and selected text in one click. Highlight text and right-click to save instantly.
              </p>
            </div>
            <div className="field-group">
              <span className="label">Paste token</span>
              <input
                className="input"
                type="password"
                placeholder="Paste your Revo OS extension token"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleConnect();
                  }
                }}
              />
            </div>
            {connectStatus === 'error' && connectError ? <span className="error-text">{connectError}</span> : null}
            <button
              className="button"
              onClick={handleConnect}
              disabled={connectStatus === 'validating' || !tokenInput.trim()}
            >
              {connectStatus === 'validating' ? 'Connecting...' : 'Connect'}
            </button>
            <div className="field-group" style={{ gap: 4 }}>
              <span className="helper-text">
                Don&apos;t have a token?{' '}
                <a className="link-button" href={connectUrl} target="_blank" rel="noreferrer">
                  Generate one in Settings
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (capture.status === 'success') {
    return (
      <div className="container">
        <header className="header">
          <div className="brand">
            <img src="/icon-32.png" alt="Revo OS" width={32} height={32} style={{ borderRadius: 8 }} />
            <div className="brand-text">
              <span className="brand-title">Revo OS</span>
              <span className="brand-subtitle">Saved</span>
            </div>
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <div className="success-state">
              <div className="success-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L7 13L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="success-title">Saved to your library</div>
                <p className="helper-text">You can view and organize it in Revo OS.</p>
              </div>
              <div className="actions" style={{ width: '100%' }}>
                <a className="button" href={libraryUrl} target="_blank" rel="noreferrer">
                  Open in Revo OS
                </a>
                <button className="button ghost" onClick={() => window.close()}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <img src="/icon-32.png" alt="Revo OS" width={32} height={32} style={{ borderRadius: 8 }} />
          <div className="brand-text">
            <span className="brand-title">Revo OS</span>
            <span className="brand-subtitle">Save to memory</span>
          </div>
        </div>
        <button className="button ghost" onClick={handleDisconnect} style={{ padding: '6px 12px', fontSize: 12 }}>
          Disconnect
        </button>
      </header>
      <div className="card">
        <div className="card-body">
          {capture.status === 'loading' ? (
            <span className="helper-text">Capturing page context...</span>
          ) : (
            <>
              {tabInfo ? (
                <div className="page-info">
                  <span className="page-title">{tabInfo.title}</span>
                  <span className="page-url">{truncateUrl(tabInfo.url)}</span>
                </div>
              ) : null}
              {screenshot ? (
                <div className="preview">
                  <img className="preview-image" src={screenshot} alt="Page screenshot" />
                </div>
              ) : null}
              {selection ? (
                <div className="field-group">
                  <span className="label">Selected text</span>
                  <div className="preview">
                    <div className="preview-text">{selection}</div>
                  </div>
                </div>
              ) : null}
              <div className="field-group">
                <span className="label">Note (optional)</span>
                <textarea
                  className="textarea"
                  placeholder="Add a quick note..."
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
              {capture.status === 'error' && capture.error ? <span className="error-text">{capture.error}</span> : null}
              <button className="button" onClick={handleSave} disabled={capture.status === 'saving' || !tabInfo}>
                {capture.status === 'saving' ? 'Saving...' : 'Save to Revo OS'}
              </button>
              <span className="helper-text">You can also right-click and select Save to Revo OS</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
