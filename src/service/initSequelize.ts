import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { remote } from 'electron';

let storagePath = '';
if (process.platform === 'win32') {
  storagePath = join(dirname(remote.app.getPath('exe')), '/resources/db/notes.db');
} else {
  storagePath = join(dirname(remote.app.getPath('userData')), '/resources/db/notes.db');
}

export const sequelize = new Sequelize({
  database: 'reading',
  dialect: 'sqlite',
  storage: storagePath,
  dialectModule: sqlite3,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const sequelizeInit = (): void => {
  console.log('-----------------------------------------------------------------');
  sequelize
    .authenticate()
    .then(() => {
      console.clear();
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.log('Unable to connect to the database', err);
    });

  // 根据 model自动创建表
  sequelize
    .sync()
    .then(() => {
      console.log('init db ok');
    })
    .catch(err => {
      console.log('init db error', err);
    });
};
