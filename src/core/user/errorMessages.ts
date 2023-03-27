export const incorrectSize = (min: number, max: number) => ({
  message: `must be ${min} to ${max} Characters Long.`,
});

export const noUppercaseCharacterFound = () => ({
  message: `must have at least one Uppercase Character.`,
});

export const noLowercaseCharacterFound = () => ({
  message: ` must have at least one Lowercase Character.`,
});

export const noDigitFound = () => ({
  message: ` must have at least one Digit.`,
});

export const noSpecialSymbolFound = () => ({
  message: ` must have at least one Special Symbol.`,
});

export const forbiddenSpaces = () => ({
  message: ` cannot contain spaces.`,
});
