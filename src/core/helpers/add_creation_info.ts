import dayjs from 'dayjs';
import { IsAuditable, Context } from '../interfaces';

export const addCreationInfo = (context: Context): IsAuditable => {
  return {
    createdBy: context.user ? context.user.id : undefined,
    createdAt: dayjs()
      .valueOf()
      .toString(),
  };
};
