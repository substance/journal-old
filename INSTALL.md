On Ubuntu 14.10

## Create a non-root user

```
adduser
```

Add new user to sudo group

```
sudo adduser <username> sudo
```

## Install Postgres 9.4

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## Create a substance user + databases for production and development

```
create user substance with password 'substance';

create database substance with owner = substance;
create database substance_development with owner = substance;

grant all privileges on database substance to substance;
grant all privileges on database substance_development to substance;
```

## Adjust pg_hba.conf

```
sudo pico /etc/postgresql/9.4/main/pg_hba.conf
```

## Allow remote connections

```
sudo pico /etc/postgresql/9.4/main/postgresql.conf
```

Find the lines:

```
[...]
#listen_addresses = 'localhost'
[...]
#port = 5432
[...]
```

Uncomment both lines, and set the IP address of your postgresql server or set ‘*’ to listen from all clients as shown below:

```
listen_addresses = '*'
port = 5432
```


Adjust pg_hba.conf

```
sudo pico /etc/postgresql/9.4/main/pg_hba.conf
```

```
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
host    all             all             all                     md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

Restart postgresql service to apply the changes

```
sudo service postgresql restart
```


## Test

Try login into postgres from remote

/Applications/Postgres.app/Contents/Versions/9.4/bin/psql -h 46.101.144.97 -p5432 -U substance



## Resources:

- http://www.unixmen.com/install-postgresql-9-4-phppgadmin-ubuntu-14-10/
- http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.VUJHVtOqqko
- http://www.redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html