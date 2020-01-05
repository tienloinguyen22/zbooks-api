import { Context, Repository, Aggregate, QueryById } from '../interfaces';

export const findById = <T extends Aggregate>(
  query: QueryById,
  context: Context,
  repoName: string,
): Promise<T | undefined> => {
  const repository = context.dataSources[repoName] as Repository<T>;
  return repository.findById(query.id, context.fields);
};
