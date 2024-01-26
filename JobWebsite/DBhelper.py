# This is a sample Python script.

from random import random

import psycopg2
from datetime import datetime
from gthubscrape import *

DATABASE_NAME="japp"
JOBS_TABLE="JOBS"
USERS_TABLE = "USERS"
APPLICATION_STATUS="APPLICATION_STATUS"

def create_database(dbname):
    """Connect to the PostgreSQL by calling connect_postgres() function
       Create a database named {DATABASE_NAME}
       Close the connection"""
    con = connect_potsgres("postgres")
    con.autocommit = True
    cur=con.cursor()
    sqlCreateDataBase="create database "+dbname+";"
    print(sqlCreateDataBase)
    cur.execute(sqlCreateDataBase)
    cur.close()
    con.close()

def create_jobs_table(conn):
    with conn.cursor() as cur:
        cur.execute(f"""
        CREATE TABLE {JOBS_TABLE} (
            id serial primary key,
            company Text,
            role Text,
            location Text,
            applicationLink Text,
            datePosted Date NOT NULL DEFAULT CURRENT_DATE
        );
    """)
        
def create_users_table(conn):
    with conn.cursor() as cur:
        cur.execute(f"""
        CREATE TABLE {USERS_TABLE} (
            id serial primary key,
            username Text,
            password Text
        );
    """)
def create_application_status_table(conn):
    with conn.cursor() as cur:
        cur.execute(f"""
        CREATE TABLE {APPLICATION_STATUS} (
            job_id integer REFERENCES {JOBS_TABLE},
            user_id integer REFERENCES {USERS_TABLE},
            status Text,
            comment Text
        );
    """)


def connect_potsgres(dbname):
    """Connect to the PostgreSQL using psycopg2 with default database
       Return the connection"""
    conn = psycopg2.connect(
        host="localhost",
        database=dbname,
        user="postgres",
        password="Gaya@1234")
    return conn


def insert_user_date(conn, username, password):
    insert_statement = f"""INSERT INTO {USERS_TABLE} (username, password) VALUES (%s, %s)"""
    with conn.cursor() as cur:
        cur.execute(insert_statement, (username, password))

def select_jobs_data(conn):
    select_statement = f"""SELECT * FROM {JOBS_TABLE} order by id desc LIMIT 1; """
    with conn.cursor() as cur:
        cur.execute(select_statement)
        res=cur.fetchall()
        if(res==[]):
            return res
        return list(res[0])[1:]

def insert_jobs_data(conn):
    res=select_jobs_data(conn)
    data = scrapeGitHub(res)
    print(len(data))
    if(data==None):
        print("failed to scrape data")
        return
    if(len(data)==0):
        print("No New Data")

    # insert_statement = f"""INSERT INTO {JOBS_TABLE} (company, role, location, applicationlink, datePosted) VALUES (%s, %s,%s, %s,%s);"""
    # for row in data:
    #     company,role,location, link, date = row
    #     if(len(date.split(' ')[1])<3):
    #         date_format = "%Y %b %d"
    #         date = "2023 "+ date
    #     else:
    #         date_format = "%d %b %Y"
    #         date = "01 " + date
    #     with conn.cursor() as cur:
    #         cur.execute(insert_statement, (company, role, location, link, datetime.strptime(date, date_format)))


# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    # create_database(DATABASE_NAME)

    with connect_potsgres(dbname=DATABASE_NAME) as conn:
        conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        # create_table(conn)
        # create_users_table(conn)
        # create_application_status_table(conn)
        # insert_user_date(conn,'sriram','Gaya@1234')
        insert_jobs_data(conn)

    #     list_partitioning(conn)
    #     insert_list_data(conn)
    #     select_list_data(conn)

    #     range_partitioning(conn)
    #     insert_range_data(conn)
    #     select_range_data(conn)

    #     print('Done')
    #     conn.close()




