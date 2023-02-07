export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const inlineClass = (
  defaultClasses: string,
  classObject: Record<string, boolean>
): string => {
  const validClasses: string[] = [];

  Object.keys(classObject).forEach((className) => {
    const value = classObject[className];

    if (!value) return;

    validClasses.push(className);
  });

  return `${defaultClasses} ${validClasses.join(' ')}`;
};
