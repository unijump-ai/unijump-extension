import browser from 'webextension-polyfill';

export interface ContentRendererOptions {
  cssPaths: string[];
  appContainer: HTMLElement;
  rootClass: string;
}

export default async function renderContent(
  options: ContentRendererOptions,
  render: (appRoot: HTMLElement) => void
) {
  const { appContainer, cssPaths, rootClass } = options;
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.DEV ? 'open' : 'closed',
  });
  const appRoot = document.createElement('div');
  appRoot.classList.add(rootClass);

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

  render(appRoot);
}
