import dayjs from 'dayjs';
import { IsAuditable, Context } from '../interfaces';

export const addModificationInfo = (context: Context): IsAuditable => {
  return {
    lastModifiedBy: context.user ? context.user.id : undefined,
    lastModifiedAt: dayjs()
      .valueOf()
      .toString(),
  };
};
