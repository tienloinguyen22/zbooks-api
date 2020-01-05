import * as yup from 'yup';

export const validateUpdatedSchema = async <T>(schema: yup.Schema<T>, payload: T): Promise<void> => {
  await Promise.all(
    Object.keys(payload)
      .filter((key) => key !== 'commandId')
      .map((key) => {
        return schema.validateAt(key, payload);
      }),
  );
};
