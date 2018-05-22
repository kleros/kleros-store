# Kleros store

## Table of Contents

* [Getting started](#getting-started)
  * [Usage](#usage)
    * [Auth](#auth)
  * [Development](#development)
    * [Install dependancies](#install-dependancies)
    * [Run tests](#run-tests)
    * [Database](#database)
      * [Set mongo network](#set-mongo-network)
      * [Run mongo in local](#run-mongo-in-local)
    * [Set environment variables](#set-environment-variables)
    * [Add profile](#add-profile)
* [Deployment](#deployment)
  * [Redeployment](#redeployment)
* [Set https](#set-https)
* [Api documentation](#api-documentation)
  * [Generate api documentation](#generate-api-documentation)
  * [Go to api documentation](#go-to-api-documentation)
  * [Regenerate api documentation](#regenerate-api-documentation)


## Getting started

### Usage

####

#### Auth

In order to use POST or PUT http verb a user must:
- Be interacting with their own user profile.
- Include an `Authorization` header with a token that is signed using the same private key associated with the address.

In order to get a token to sign call the auth endpoint:
```
curl -X GET https://kleros.in/<ADDRESS>/authToken
```

This will return a hex string that you should sign with your cryptographic keys. Each token includes a timestamp that tells the server when the token will expire. Once signed by the user this key can be used to make requests for the users profile until the token expires or a new token is requested by the user.

E.g.
updating a user profile with the signed token:
```
curl -X POST -H "Accept: application/json" -H "Authorization: <SIGNED_TOKEN>" -d "<JSON>" https://kleros.in/<ADDRESS>
```

### Development

#### Quickstart

- Install dependancies:
```
yarn
```

- Start Mongo:
```
sudo mongod
```

- Run in developemnt:
```
yarn start:dev
```

GOTO http://localhost:3000.

### Run tests

At first, run `mongo` with
```
mongod # use sudo if necessary
```

And run the tests with
```
yarn test
```

### Database

#### Set mongo network

If necessary, set the value of `config.database` in `config.js`.

#### Run mongo in local

Assumed mongo is installed

```
sudo mongod
mongo # in another terminal
```

In mongo terminal (JS shell)
```
db.getMongo().getDBNames() # list db
# if `kleros` not exists
use kleros # create `kleros` database
db.getCollectionNames() #list collections
db.profiles.find({}) # list profiles
```

### Set environment variables

Create `.env` file in the root directory with these keys:
```
SECRET={secure secret e.g. dontusethisasyoursecret}
DB_URI={uri of mongo instance e.g. mongodb://localhost/kleros}
IPS_ALLOWED={add a comma separated list with no spaces of ips to allow e.g. ::1,127.0.0.1}
```

### Add a profile

To add an user you can use the software `compass` and add an entry in the
`kleros` collection.

## API

Kleros store API provides a backend to store the documents
(evidences, contracts).

The api endpoints are describe in `apiDoc`.

### Log requests

All requests are saved in `access.log` file.

## Deployment

### Install node

```
apt-get update
sudo apt-get install nodejs-legacy
sudo apt-get install npm
sudo npm install -g n
sudo n stable
node --version # get at least ths version 8.0.0
sudo ln -sf /usr/local/n/versions/node/<version>/bin/node /usr/bin/node
```

### Install yarn

```
npm install -g yarn
apt install cmdtest
```

### Install pm2

```
npm install pm2 -g
```

### Build and run in production:
```
yarn start:prod
```

### Redeployment

```
pm2 stop www # or id like 0
git pull
pm2 start bin/www
```

### Set up database

Set database in `config.js`.

## Set https

```
# Install tools that Let’s Encrypt requires
sudo apt-get install bc

# Clone the Let’s Encrypt repository to your server
sudo apt-get install letsencrypt

sudo letsencrypt certonly

dig +short kleros-store.com
# output should be your droplet’s IP address, e.g. 138.68.11.65

# Update the SSL certificate
sudo letsencrypt certonly --standalone -d

```

## Api documentation

### Generate api documentation

```
yarn add global apidoc
apidoc -f "routes/.*\\.js$" -i ./  -o public/apidoc/ # bug with fish terminal (use bash)
```

### Go to api documentation

See it locally http://localhost:3000/apidoc/.
See it live https://kleros.io/kleros-store.

### Regenerate api documentation

```
rm -rf public/apidoc
apidoc -f "routes/.*\\.js$" -i ./  -o public/apidoc/ # bug with fish terminal (use bash)
```
