"""PostgreSQL 연결과 SQL 실행 계층."""

import psycopg
from psycopg.rows import dict_row

from . import config


def connect():
    kwargs = {
        "host": config.ENV["PGHOST"],
        "port": config.ENV["PGPORT"],
        "user": config.ENV["PGUSER"],
        "dbname": config.ENV["PGDATABASE"],
        "row_factory": dict_row,
        "autocommit": True,
    }
    if config.ENV["PGPASSWORD"]:
        kwargs["password"] = config.ENV["PGPASSWORD"]
    return psycopg.connect(**kwargs)


def fetch_all(sql, params=()):
    with connect() as conn:
        return conn.execute(sql, params).fetchall()


def fetch_one(sql, params=()):
    with connect() as conn:
        return conn.execute(sql, params).fetchone()
