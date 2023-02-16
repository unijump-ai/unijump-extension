import { AppContext } from '$lib/context';
import renderContent from '../renderContent';
import ContentPage from './ContentPage.svelte';

renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
  new ContentPage({
    target: appRoot,
    context: new Map([[AppContext.Root, appRoot]]),
  });
});
