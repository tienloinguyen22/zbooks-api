import * as yup from 'yup';

export const validateUpdatedSchema = async <T>(schema: yup.Schema<T>, payload: T): Promise<void> => {
  await Promise.all(
    Object.keys(payload).map((key) => {
      return schema.validateAt(key, payload);
    }),
  );
};
