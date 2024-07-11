import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar'
    },
    password: {
      type: 'varchar'
    }
  },
  relations: {
    entries: {
      type: 'one-to-many',
      target: 'Entry',
      inverseSide: 'user',
      cascade: true
    }
  }
});
