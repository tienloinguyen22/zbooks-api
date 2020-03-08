import { Genders, LoginTypes, execMySqlQuery, getConditionOperator, PaginationTypes } from '@app/core';
import _ from 'lodash';
import { config } from '@app/config';
import { UserRepository } from '../interfaces';

export const usersRepository: UserRepository = {
  createTable: async () => {
    await execMySqlQuery(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(32) NOT NULL UNIQUE PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      fullName VARCHAR(100) NOT NULL,
      countryCode VARCHAR(10),
      phoneNo VARCHAR(15),
      address VARCHAR(255),
      avatarUrl VARCHAR(2083),
      dob TIMESTAMP,
      gender ENUM('${Genders.female}', '${Genders.male}', '${Genders.other}'),
      loginUid VARCHAR(100) NOT NULL UNIQUE,
      loginType ENUM('${LoginTypes.facebook}', '${LoginTypes.google}'),
      isActive BOOLEAN DEFAULT true,
      firebaseId VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`);
  },
  create: async (payload) => {
    let query = `INSERT INTO users SET `;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(payload)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query += `${key} = ${(payload as any)[key]}`;
    }
    query += `;`;

    return execMySqlQuery(query);
  },
  update: async (payload) => {
    let query = `UPDATE users SET `;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(payload)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query += `${key} = ${(payload as any)[key]}`;
    }
    query += ` WHERE ID = ${payload.id};`;

    return execMySqlQuery(query);
  },
  findById: async (id) => {
    const query = `SELECT * FROM users WHERE id = ${id};`;
    return execMySqlQuery(query);
  },
  findOne: async (conditions) => {
    let query = `SELECT * FROM users`;

    // Add conditions
    if (conditions && conditions.length > 0) {
      query += ` WHERE `;
      // eslint-disable-next-line no-restricted-syntax
      for (const condition of conditions) {
        query += `${condition.field} ${getConditionOperator(condition.operator)} ${condition.value}`;
      }
    }
    query += `;`;

    return execMySqlQuery(query);
  },
  findWithOffsetPagination: async (pagination, conditions, orderBy) => {
    let dataQuery = `SELECT * FROM users`;
    let countQuery = `SELECT COUNT(*) FROM users`;

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
        total,
      },
    };
  },
};
