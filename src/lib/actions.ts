export const overflow = (_: HTMLElement) => {
  const overflow = document.body.style.overflow;

  document.body.style.overflow = 'hidden';

  return {
    destroy() {
      document.body.style.overflow = overflow;
    },
  };
};

export const focus = (node: HTMLElement) => {
  const previousFocusedNode = document.activeElement as HTMLElement;

  node.setAttribute('tabindex', '-1');
  node.focus();

  return {
    destroy() {
      node.removeAttribute('tabindex');
      previousFocusedNode?.focus();
    },
  };
};

export const clickOutside = (node: HTMLElement, ignore?: string) => {
  const handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (!event.target || (ignore && target.closest(ignore))) {
      return;
    }

    if (node && !node.contains(target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  };

  document.addEventListener('click', handleClick);

  return {
    destroy() {
      document.removeEventListener('click', handleClick);
    },
  };
};

export const autoHeight = (
  node: HTMLElement,
  { watch, emptyHeight }: { watch: any; emptyHeight: number }
) => {
  return {
    async update() {
      node.style.height = `${emptyHeight}px`;
      const height = node.scrollHeight;
      node.style.height = `${height}px`;
      node.scrollTop = height;
    },
  };
};
