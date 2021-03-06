# SkyMan
The Open Web Framework for nodejs

# Documentation
[documentation.md](documentation.md)

## Prerequisites

| Technology | Minimum Version Required | Website |
| - | - |-|
|Nodejs| 6.9.0|[link](https://nodejs.org/en/download/)|
|Mongodb| 3.2.0|[link](https://www.mongodb.com/download-center)|
|Redis (optional)| 3.0|[linux/mac](https://redis.io/download) , [windows](https://github.com/microsoftarchive/redis/releases)|

**_Note_:** If you do not want to use Redis, remove the redis property in **config.js**

## Install Dependencies

```
npm install
```
and [Nodemon](https://nodemon.io/) for development server
```
npm install -g nodemon
```

## Start Server

```
npm start
```
then visit url [localhost:8000](localhost:8000)

### Production Server
With [pm2](http://pm2.keymetrics.io/)
```
pm2 start index
```

## Help

The following points will help you understand the project for further development

### Config

Change ***config.js*** for database connection and email credentials

### Directory Structure

|Directory|Description|
|:----:|----|
|**controllers**|Functions for routing endpoints|
|**middlewares**|Routing middlewares|
|**routes**|Router in json format|
|**database/models**|DB schema definitions|
|**database/seeders**|Database seeding|
|**database/providers**|DB operations(used by controllers, test-cases)|
|**services**|Application services such as email service|
|**static**|Static contents like css, js, images for client ui|
|**system**|Internal application management modules|
|**utils**|Common utility functions used throughout the application|
|**views**|Html files (with [nunjucks](https://mozilla.github.io/nunjucks))|
|**test**|[Mocha](https://mochajs.org/) Testcases|

### Generators
Generators are defined in **system/generator.js**

##### View list of generators
```
npm run gen
```
- ##### Model
   ```
   npm run gen model model_name
   ```
   will create **model_name.js** in **database/models** directory with name **ModelName**

### Seed
All seeders in **database/seeders** directory must be enlisted in the **allseeders** object in **database/seeders/index.js** so they can be run from npm scripts

#### View seeders
```
npm run seed
```
#### Run seeds
```
npm run seed seeder_name1 seeder_name2
```

### With working modules

* Sign Up (with [vuejs](https://vuejs.org) and [axios](https://github.com/axios/axios))
* Account activation through email
* Sign In
* Password reset through email
* Seperate Admin/User views
* Simple Blog ([**localhost:8000/blog**](localhost:8000/blog))
* Article CRUD from user account
