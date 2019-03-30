# SkyMan
Simple but expandable.

## API

### Settings

- statics
	- `/static` = "static"
- bodyparser
	- `json`
		- `limit` = "10mb"
	- `urlencoded`
		- `extended` = `true`
		- `limit` = "10mb"
		- `parameterLimit` = 1000000
- cookieparser
- helmet
- session
	- `secret` = "skymansecret"
	- `resave` = `true`
	- `saveUninitialized` = `true`
- redis = `false`
- flash
- auth
	- `strategy` = "local",
	- `fields` 
		- `usernameField` = "username"
		- `passwordField` = "password"
	- `provider` = `default`
- view
	- `autoescape` = `true`
- db
	- `directory` = "database"
	- `type` = "sql" ( sql |  nosql | both )

### Option
- `session` = true
- `flash` = true
- `auth` = false
- `view` = true
- `db` = false
- `port` = `process.env.PORT` or `8000`

### class Skyman

#### constructor([options])

#### load([path to application])

#### fly(callbackFn)

### class SQLDatabase

#### createModel(name, definition[, option])

#### type(name[, arg1][, arg2] ...)

### class NoSQLDatabase

#### createModel(name, definition[, option])

#### type(name)

### class View

#### render(view_path[, context])

### class Auth

#### authenticate(req, res, next, cb)
