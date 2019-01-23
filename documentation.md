# SkyMan
Simple but expandable.

# Table of contents
-  [Overview](#overview)
-  [Controllers](#controllers)
-  [Middlewares](#middlewares)
-  [Database](#database)
	-  [Models](#models)
	-  [Services](#services)
	-  [Seeders](#seeders)
-  [Routes](#routes)
-  [Views](#views)
-  [Generators](#generators)
-  [Helpers](#helpers)

# Overview
SkyMan is the simplest nodejs open framework that runs on top of expressjs. Each and every module can be customized or overridable at any extent. You can even replace its modules with third-party libraries or your own code.

# Controllers
The **controllers** folder contains all the controllers and are exported from **controllers/index.js**. A controller endpoint is an exported express **handler function**.
#### Example
```javascript
exports.endpointA=(req,res,next)=>{
	res.send("Endpoint A");
}
```

# Middlewares
The **middlewares** folder contains route middlewares similar to controllers.

# Database
The **database/index.js** exports all the modules that relates to database operations. Throughout the application. The **database/connector.js** exports the database connection wrapper function ``` connect() ```.

#### Exports:
-  ``` connect(noseed) ``` - Function
	Initializes database connection. If ``` noseed ``` is true, it skips the admin seeding and returns a promise.
-  ``` models ``` - Object
	All the models, exported from **database/models/index.js**
-  ``` services ``` - Object
	All the database services, exported from **database/services/index.js**
-  ``` seeder ``` - Object
	Database seeding module, exported from **database/seeders/index.js**

## Models
[MongooseJS](https://mongoosejs.com) schemas are defined in the **database/models** folder and are exported from **database/models/index.js**.

## Providers
The **database/providers** folder contains functions to interact the database via the exported models from **database/models** folder.

## Seeders
Seeder is a javascript file containing a default export  that creates dummy data into the database. All seeders in **database/seeders** directory must be enlisted in the ``` allseeders ``` object in **database/seeders/index.js** so they can be run from npm scripts

#### View seeders
	npm run seed

#### Run seeds
	npm run seed seeder_name1 seeder_name2 ...
where _seeder_name1_ is a seeder from "view seeders"

#### Example
```javascript
var { article }=require('../models');
exports.getUserArticles=(user_id)=>{
    return article.find({user:user_id}).sort('-created_at').exec();
}
```

# Routes
The **routes** folder contains all the route endpoints of the application. The main route is exported as default from **index.js**. You may create module based files of routes and require them in **index.js** with a path.

#### Single Route
```javascript
{
	path: "route_path",
	method: "method_name",
	middleware: ["middleaware.function_name1", "middleaware.function_name2"],
	controller: "controller.function_name"
}
```

#### Example
##### routes/my_routes.js
```javascript
module.exports=[
	{
		path: "/",
		controller: "my_controller.my_function"
	}
]
```
##### routes/index.js
Add an array item in **routerJson** array as following:
```javascript
 . . .
const routerJson=[
 . . .
 } , { // add your route as an array item 
	path: "/my_route",
	children: require('./my_route')
 } , {
 . . .
```
> **Warning**: Beware of circular routes.

# Views
The **view** folder contains all the html files that are being rendered from controllers. [Nunjucks](https://mozilla.github.io/nunjucks) templating engine is used to render the html files. The reason for using Nunjucks is the **template inheritance** feature.

# Services
The **services** folder contains application services like Email, Chat etc.

# Generators

##### View list of generators
	npm run gen

- ##### Generate Model
   	npm run gen model model_name
   
   will create **model_name.js** in **database/models** directory with name **ModelName**


# Helpers
-  ``` config ``` - Object
	Application configuration object from **config.js**
-  ``` make404() ``` - Function
	Returns a 404 error to be thrown
	Example:
	```javascript
	throw make404()
	```
-  ``` goBackWithData(request_obj, response_obj) ``` - Function
	Redirects back to where the request has come from with request body available through ``` old() ``` function

### View helpers
-  ``` old(field_name, default_value) ``` - Function
	Returns last form data
	> Note: This function requires ``` goBackWithData() ``` function in controller
-  ``` request ``` - Object
	This is the current request object
-  ``` view ``` - Object
	This object provides access to all variables/functions exported from **utils/view.js**
