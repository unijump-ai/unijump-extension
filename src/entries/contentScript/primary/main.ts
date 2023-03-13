import { AppContext } from '$lib/context';
import { MAX_Z_INDEX } from '$lib/style';
import renderContent, { type ContentRendererOptions } from '../renderContent';
import ContentPage from './ContentPage.svelte';

renderApp();

function renderApp() {
  const appContainer = document.createElement('div');
  appContainer.style.zIndex = MAX_Z_INDEX;
  const appOptions = {
    cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    appContainer,
  } satisfies ContentRendererOptions;

  renderContent(appOptions, (appRoot) => {
    new ContentPage({
      target: appRoot,
      context: new Map([[AppContext.Root, appRoot]]),
    });
  });
}
