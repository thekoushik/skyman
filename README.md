# express-starter
Starter project for express web app

## Prerequisites

Node 6.9.0 or higher and Mongo 3.2.0 or higher

## Install

```
npm install
```
and
```
npm install -g nodemon
```

## Start Server

```
npm start
```

## Help

### Config

Change ***config.js*** for database connection and email credentials

### Directory Structure

|Directory|Description|
|:----:|----|
|**controllers**|Functions for routing endpoints|
|**middlewares**|Routing middlewares|
|**models**|DB schema definitions|
|**routes**|Router in json format|
|**services**|DB operations(used by controllers)|
|**static**|Static contents like css, js, images for client ui|
|**system**|Internal functions used to manage application modules|
|**utils**|Common utility functions used throughout the application|
|**views**|Html files|

## Features

* Sign Up (with [vuejs](https://vuejs.org) and [axios](https://github.com/axios/axios))
* Account activation through email
* Sign In
* Password reset through email
* Basic Dashboard
