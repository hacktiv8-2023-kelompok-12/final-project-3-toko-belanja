module.exports = {
    "development": {
        "username": process.env.DB_USERNAME || "postgres",
        "password": process.env.DB_USERNAME || "secret",
        "database": process.env.DB_USERNAME || "toko_belanja",
        "host": process.env.DB_USERNAME || "localhost",
        "dialect": process.env.DB_USERNAME || "postgres"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.DB_USERNAME || "root",
        "password": process.env.DB_USERNAME || null,
        "database": process.env.DB_USERNAME || "database_production",
        "host": process.env.DB_USERNAME || "127.0.0.1",
        "dialect": process.env.DB_USERNAME || "mysql"
    }
}
