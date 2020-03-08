import mysql from 'mysql';
import { promisify } from 'util';
import { config } from '@app/config';

const mysqlConnection = mysql.createConnection(config.mysqlConnectionString);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const execMySqlQuery: any = promisify(mysqlConnection.query).bind(mysqlConnection);

export { mysqlConnection, execMySqlQuery };
