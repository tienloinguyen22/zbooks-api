// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizePayload = <T>(payload: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizedPayload: any = {};
  Object.keys(payload).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (payload as any)[key];
    if (value && typeof value === 'string') {
      sanitizedPayload[key] = value.trim();
    } else {
      sanitizedPayload[key] = value;
    }
  });
  return sanitizedPayload;
};
