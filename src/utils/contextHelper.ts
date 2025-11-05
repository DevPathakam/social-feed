export const getContextErrorText = (contextName: string, contextProvider: string) =>
  `${contextName} must be used within ${contextProvider}.`;
