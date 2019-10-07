[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Coverage Status](https://coveralls.io/repos/github/andela/eagle-bn-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/eagle-bn-backend?branch=develop)
[![Build Status](https://travis-ci.org/andela/eagle-bn-backend.svg?branch=develop)](https://travis-ci.org/andela/eagle-bn-backend)
[![Maintainability](https://api.codeclimate.com/v1/badges/76edd60530e9f71edb4a/maintainability)](https://codeclimate.com/github/andela/eagle-bn-backend/maintainability)

Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======

## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## Docker set up
 . [Install docker](https://docs.docker.com/docker-for-mac/install/)
 . Clone repository to your local machine and run `npm install` to install all dependancies
 . In .env file, provide variables for database ` GB-USER-NAME`, `DB-PASS` and `DB-DATABASE`
 . While in development run `npm run dockerDev`
 . While in production run `npm run dockerProd`
