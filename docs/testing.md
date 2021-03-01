## Testing

Tests for Sequelize Slugify use the Jest test framework.

#### Local
Unit tests run without external database dependencies using SQLite.
```shell
npm run test-unit
```
#### Docker
Testing the supported databases uses Docker and docker-compose.

These commands start up containers for postgres, mysql, mariadb and mssql.
```shell
docker-compose up
```

Using the container name on the command line will start single database containers.
```shell
docker-compose up [postgres|mysql|mariadb|mssql]
```

Tests can run against these containers using these commands.
```shell
npm run test-unit-postgres
```
```shell
npm run test-unit-mysql
```
```shell
npm run test-unit-mariadb
```
```shell
npm run test-unit-mssql
```
