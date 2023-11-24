const knex = require('knex')({
    client: 'pg',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
    }
});

module.exports = knex;