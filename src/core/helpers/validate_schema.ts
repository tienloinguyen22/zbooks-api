import * as yup from 'yup';

export const validateSchema = async <T>(schema: yup.Schema<T>, payload: T): Promise<void> => {
  await schema.validate(payload);
};
