import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: '.',
  manifest: () => ({
    name: 'Revo OS',
    description: 'Save pages to your Revo OS memory library',
    version: '0.1.0',
    permissions: ['activeTab', 'storage', 'scripting', 'tabs', 'contextMenus', 'notifications'],
    host_permissions: ['http://localhost:3000/*', 'https://*.revoos.app/*'],
    action: {
      default_title: 'Revo OS',
      default_popup: 'popup.html',
    },
  }),
});
