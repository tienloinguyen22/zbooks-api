import * as yup from 'yup';
import { AppError } from './app_error';

export const validateSchema = async <T>(schema: yup.Schema<T>, payload: T): Promise<void> => {
  try {
    await schema.validate(payload, {
      stripUnknown: true,
    });
  } catch (error) {
    throw new AppError(error.message, error.message);
  }
};
