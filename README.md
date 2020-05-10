# Back-end of GoBarber
> This repository contais the back-end part of the GoBarber App, it helps people make appointmets with their barber.

[![Build Status][travis-image]][travis-url]


This API can receive requests to create users, change an user's avatar and create appointmets.

![](header.png)

## Technologies used

* Express
* TypeORM
* Multer
* JWT
* cors


## Installation
> Requires Yarn to be installed

```sh
yarn
```
**You'll need a PostgreSQL server running on Docker in your local machine or on a external server (with or withouth Docker).**

The application connects to a PostgreSQL DB on the default port, and it needs a table named *gostack_gobarber* in the PostgreSQL DB

after Yarn has finished setting up run :
```sh
yarn typeorm migrations:run && yarn dev:server
```


## Made by

Davi Wendt – contato@daviwendt.com


## Contributing

1. Fork it (<https://github.com/yourname/gobarber-backend/fork>)
2. Create your feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->

[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
