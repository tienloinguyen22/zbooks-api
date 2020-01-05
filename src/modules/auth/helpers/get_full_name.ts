export const getFullName = (user: { firstName: string; middleName?: string; lastName: string }): string => {
  return [user.lastName, user.middleName, user.firstName].filter((m) => !!m).join(' ');
};
