import { AppContext } from '$lib/context';
import { MAX_Z_INDEX } from '$lib/style';
import renderContent, { type ContentRendererOptions } from '../renderContent';
import { renderToolbox } from '../renderToolbox';
import ContentPage from './ContentPage.svelte';

renderApp();
renderToolbox();

function renderApp() {
  const appContainer = document.createElement('div');
  appContainer.style.zIndex = MAX_Z_INDEX;
  const appOptions = {
    cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    appContainer,
    rootClass: 'unijump-app',
  } satisfies ContentRendererOptions;

  renderContent(appOptions, (appRoot) => {
    document.body.appendChild(appContainer);

    new ContentPage({
      target: appRoot,
      context: new Map([[AppContext.Root, appRoot]]),
    });
  });
}
