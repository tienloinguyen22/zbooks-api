import { QueryResult, Context, OffsetPaginationQuery, Repository, Aggregate } from '../interfaces';
import { buildConditions } from './build_conditions';

export const findWithOffsetPagination = <T extends Aggregate>(
  query: OffsetPaginationQuery,
  context: Context,
  repoName: string,
): Promise<QueryResult<T>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;
  const repository = context.dataSources[repoName] as Repository<T>;
  return repository.findWithOffsetPagination(
    {
      type: 'OFFSET',
      pageIndex,
      itemsPerPage,
    },
    buildConditions(conditionFields),
    orderBy,
    context.fields,
  );
};
