export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const inlineClass = (
  defaultClasses: string,
  conditinalClasses: Record<string, boolean> | string[]
): string => {
  let validClasses: string[] = [];

  if (Array.isArray(conditinalClasses)) {
    validClasses = conditinalClasses;
  } else {
    Object.keys(conditinalClasses).forEach((className) => {
      const value = conditinalClasses[className];

      if (!value) return;

      validClasses.push(className);
    });
  }

  return `${defaultClasses} ${validClasses.join(' ')}`;
};

export const inlineStyle = (styleObject: Partial<CSSStyleDeclaration>): string => {
  const validStyles = [];

  Object.keys(styleObject).forEach((key) => {
    const value = styleObject[key];

    if (!value) return;

    validStyles.push(`${key}: ${value};`);
  });

  return validStyles.join('');
};

export const isMac = () => {
  const platform = ((window.navigator as any).userAgentData?.platform ||
    window.navigator.platform) as string;

  return platform.toLowerCase().includes('mac');
};
