import browser from 'webextension-polyfill';

export interface ContentRendererOptions {
  cssPaths: string[];
  appContainer: HTMLElement;
}

export default async function renderContent(
  options: ContentRendererOptions,
  render: (appRoot: HTMLElement) => void
) {
  const { appContainer, cssPaths } = options;
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.DEV ? 'open' : 'closed',
  });
  const appRoot = document.createElement('div');
  appRoot.setAttribute('id', 'unijump-app');

  if (import.meta.hot) {
    const { addViteStyleTarget } = await import(
      '@samrum/vite-plugin-web-extension/client'
    );

    await addViteStyleTarget(shadowRoot);
  } else {
    cssPaths.forEach((cssPath: string) => {
      const styleEl = document.createElement('link');
      styleEl.setAttribute('rel', 'stylesheet');
      styleEl.setAttribute('href', browser.runtime.getURL(cssPath));
      shadowRoot.appendChild(styleEl);
    });
  }

  shadowRoot.appendChild(appRoot);
  document.body.appendChild(appContainer);

  render(appRoot);
}
