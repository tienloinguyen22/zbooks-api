import { execMySqlQuery, getConditionOperator, PaginationTypes } from '@app/core';
import { config } from '@app/config';
import _ from 'lodash';
import { ProvinceRepository } from '../interfaces';

export const provincesRepository: ProvinceRepository = {
  createTable: async () => {
    await execMySqlQuery(`CREATE TABLE IF NOT EXISTS provinces (
      id VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`);
  },
  create: async (payload) => {
    let query = `INSERT INTO provinces SET `;

    const keys = Object.keys(payload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = keys.map((key) => (payload as any)[key]);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      query += `${key} = ?`;
      if (keys.indexOf(key) !== keys.length - 1) {
        query += `, `;
      }
    }
    query += `;`;

    await execMySqlQuery(query, values);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return provincesRepository.findById ? (provincesRepository.findById(payload.id) as any) : undefined;
  },
  findById: async (id) => {
    const query = `SELECT * FROM provinces WHERE id = ? LIMIT 1;`;
    const result = await execMySqlQuery(query, [id]);
    return result[0];
  },
  findWithOffsetPagination: async (pagination, conditions, orderBy) => {
    let dataQuery = `SELECT * FROM provinces`;
    let countQuery = `SELECT COUNT(*) AS total FROM provinces`;

    // Add conditions
    if (conditions && conditions.length > 0) {
      dataQuery += ` WHERE `;
      countQuery += ` WHERE `;
      // eslint-disable-next-line no-restricted-syntax
      for (const condition of conditions) {
        dataQuery += `${condition.field} ${getConditionOperator(condition.operator)} ${condition.value}`;
        countQuery += `${condition.field} ${getConditionOperator(condition.operator)} ${condition.value}`;
      }
    }

    // Add order by
    if (orderBy) {
      const [field, sort] = orderBy.split('_');
      dataQuery += ` ORDER BY ${field} ${sort.toUpperCase()}`;
    } else {
      dataQuery += ` ORDER BY createdAt DESC`;
    }

    // Add pagination
    const limit = pagination.itemsPerPage;
    const offset = _.get(pagination, 'pageIndex', 0) * _.get(pagination, 'itemsPerPage', config.itemsPerPage.default);
    dataQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    dataQuery += `;`;
    countQuery += `;`;

    const [data, total] = await Promise.all([execMySqlQuery(dataQuery), execMySqlQuery(countQuery)]);

    return {
      data,
      pagination: {
        type: PaginationTypes.OFFSET,
        total: total[0].total,
      },
    };
  },
  findRandom: async () => {
    const results = await execMySqlQuery(`SELECT * FROM provinces
      ORDER BY RAND()
      LIMIT 1;
    `);

    return results[0];
  },
};
