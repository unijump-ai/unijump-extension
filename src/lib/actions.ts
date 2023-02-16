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
