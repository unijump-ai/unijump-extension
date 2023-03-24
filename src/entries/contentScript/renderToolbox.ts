import Toolbox from '$components/toolbox/Toolbox.svelte';
import { AppContext } from '$lib/context';
import { getToolboxConfigForHost } from '$lib/toolbox';
import { ToolboxRootId, ToolboxWrapperId } from '$lib/toolbox/toolbox.constants';
import renderContent from './renderContent';

export function renderToolbox() {
  const toolboxConfig = getToolboxConfigForHost(window.location.host);
  let rendering = false;

  if (!toolboxConfig || toolboxConfig.disabled) return;

  const render = (parent: Element, sibling?: Element) => {
    if (document.getElementById(ToolboxWrapperId) || rendering) return;

    rendering = true;

    const toolboxContainer =
      toolboxConfig.createRootElement?.() || document.createElement('div');
    toolboxContainer.setAttribute('id', ToolboxWrapperId);
    toolboxContainer.style.width = '100%';

    const toolboxOptions = {
      cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      appContainer: toolboxContainer,
      rootId: ToolboxRootId,
    };

    renderContent(toolboxOptions, (toolboxRoot) => {
      if (sibling) {
        parent.insertBefore(toolboxContainer, sibling);
      } else {
        parent.appendChild(toolboxContainer);
      }

      new Toolbox({
        target: toolboxRoot,
        context: new Map([[AppContext.ToolboxConfig, toolboxConfig]]),
      });

      rendering = false;
    });
  };

  const checkInjection = () => {
    const toolboxConfig = getToolboxConfigForHost(window.location.host);

    if (
      toolboxConfig.disabled ||
      rendering ||
      document.getElementById(ToolboxWrapperId)
    ) {
      return;
    }

    const inputElement = document.querySelector(toolboxConfig.input.selector);

    if (!inputElement) {
      return;
    }

    const parentNode = document.querySelector(toolboxConfig.inject.parent);

    if (!parentNode) {
      return;
    }

    if (!toolboxConfig.inject.insertBefore) {
      render(parentNode);
      return;
    }

    const siblingNode = parentNode.querySelector(toolboxConfig.inject.insertBefore);

    if (!siblingNode) {
      return;
    }

    render(parentNode, siblingNode);
  };

  setInterval(() => checkInjection(), 500);
}
