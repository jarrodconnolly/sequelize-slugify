#!/usr/bin/env sh
. .env
docker exec mssql-2022 /bin/bash -c "/opt/mssql-tools/bin/sqlcmd -S 127.0.0.1 -U 'sa' -d 'master' -P '$SEQ_SLUG_MSSQL_PW' -Q \"DROP DATABASE IF EXISTS [$SEQ_SLUG_DB]; CREATE DATABASE [$SEQ_SLUG_DB]; ALTER DATABASE [$SEQ_SLUG_DB] SET READ_COMMITTED_SNAPSHOT ON;\""
