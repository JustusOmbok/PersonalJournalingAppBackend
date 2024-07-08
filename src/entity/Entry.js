const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Entry',
  tableName: 'entries',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    title: {
      type: 'varchar'
    },
    content: {
      type: 'text'
    },
    category: {
      type: 'varchar'
    },
    date: {
      type: 'datetime'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true
    }
  }
});
