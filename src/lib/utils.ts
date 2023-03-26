export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ClassNameType = string | string[] | Record<string, boolean>;

export const inlineClass = (...classNames: ClassNameType[]) => {
  let classArray: string[] = [];

  const addClasses = (classes: string[]) => {
    classArray = [...classArray, ...classes];
  };

  classNames.forEach((classInit) => {
    if (typeof classInit === 'string') {
      addClasses([classInit]);
    } else if (Array.isArray(classInit)) {
      addClasses(classInit);
    } else if (typeof classInit === 'object' && classInit !== null) {
      const classes = Object.keys(classInit).filter((_class) => !!classInit[_class]);
      addClasses(classes);
    }
  });

  return classArray.join(' ');
};

export const inlineStyle = (styleObject: Record<string, string>): string => {
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

export const isPromise = (obj: any): boolean => {
  return obj && typeof obj.then === 'function';
};
