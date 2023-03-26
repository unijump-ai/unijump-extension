import Toolbox from '$components/toolbox/Toolbox.svelte';
import { AppContext } from '$lib/context';
import { createApi, getToolboxConfigForHost } from '$lib/toolbox';
import { ToolboxRootClass, ToolboxWrapperClass } from '$lib/toolbox/toolbox.constants';
import renderContent from './renderContent';

// TODO: This function definitely requires refactoring.
export function renderToolbox() {
  const defaultConfig = getToolboxConfigForHost(window.location.host);

  let rendering = false;

  if (!defaultConfig) return;

  const render = (input: Element, parent: Element, sibling?: Element) => {
    const toolboxNode = parent.querySelector(`.${ToolboxWrapperClass}`);

    if (toolboxNode || rendering) {
      return;
    }

    const toolboxApi = createApi(defaultConfig);

    defaultConfig.plugins?.forEach((plugin) => {
      plugin.beforeMount?.(toolboxApi);
    });

    let toolboxConfig = toolboxApi.getConfig();

    rendering = true;

    const toolboxContainer = toolboxApi.getContainer() || document.createElement('div');
    toolboxContainer.classList.add(ToolboxWrapperClass);
    toolboxContainer.style.width = '100%';
    toolboxContainer.style.position = 'relative';

    toolboxApi.setContainer(toolboxContainer);

    const toolboxOptions = {
      cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      appContainer: toolboxContainer,
      rootClass: ToolboxRootClass,
    };

    renderContent(toolboxOptions, (toolboxRoot) => {
      if (sibling) {
        parent.insertBefore(toolboxContainer, sibling);
      } else {
        parent.appendChild(toolboxContainer);
      }

      defaultConfig.plugins?.forEach((plugin) => plugin.afterMount?.(toolboxApi));
      toolboxConfig = toolboxApi.getConfig();

      new Toolbox({
        target: toolboxRoot,
        context: new Map<AppContext, any>([
          [AppContext.ToolboxConfig, toolboxConfig],
          [AppContext.ToolboxInput, input],
        ]),
      });

      rendering = false;
    });
  };

  const tryInject = (inputElements: NodeListOf<Element>) => {
    const siblingSelector =
      defaultConfig.inject.insertAfter || defaultConfig.inject.insertBefore;

    if (siblingSelector) {
      const siblingNodes = document.querySelectorAll(siblingSelector);

      if (!siblingNodes.length) return;

      siblingNodes.forEach((siblingNode, index) => {
        const inputNode = inputElements[index];
        const parentNode = siblingNode.parentNode as Element;
        const insertBefore = defaultConfig.inject.insertAfter
          ? (siblingNode.nextSibling as Element)
          : siblingNode;

        render(inputNode, parentNode, insertBefore);
      });
    } else {
      const parentNodes = document.querySelectorAll(defaultConfig.inject.parent);
      parentNodes.forEach((parentNode, index) =>
        render(inputElements[index], parentNode)
      );
    }
  };

  const checkInjection = () => {
    const toolboxConfig = getToolboxConfigForHost(window.location.host);

    if (toolboxConfig.disabled || rendering) {
      return;
    }

    const inputElements = document.querySelectorAll(toolboxConfig.input.selector);

    if (!inputElements.length) return;

    tryInject(inputElements);
  };

  setInterval(() => checkInjection(), 500);
}
