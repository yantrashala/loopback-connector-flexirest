# loopback-connector-flexirest

LoopBack FLEXIREST connector allows loopback application to interact with backend REST APIs. It leverages [loopback-connector-rest] for basic building blocks and adds additional "flexible" features to allow interaction with backend services.

# Installation

```sh
npm install loopback-connector-flexirest
```

# Features

- Use custom folder (endpoints) to organize operations
- Allow outgoing request parameters transformation
- Allow incoming response body transformation
- Allow use of templating library like handlebars for transformation
- Add new hooks before / after outgoing and incoming transformation
- Allow custom error handler for functions
- Extend operation template schema to allow errorHandler, incomingTransform and outgoingTransform to be added as configuration


# Usage

## Configuration in datasources.json

You can configure the Flexirest connector by editing datasources.json. The baseURL attribute gets prefixed to all the URLs defined in operation templates. All fields are required.

```js

"myNewDataSource": {
    "name": "myNewDataSource",
    "connector": "flexirest",
    "endpoints": "endpoints", // path to folder where Operation templates are placed. This is relative to application root.
    "baseURL" : "http://XXX.YYY.ZZZ/api" // The environment specific hostname and URI root
}

```

## Operation templates

Create a new folder under application root as "endpoints" and store all your operation JSON files. Each operation file should have one template defined. For understanding the [template] structure, follow the documentation provided by Strongloop. Also, look for [example-templates] in test folder.

## Error Handlers
Custom error handlers can be defined for each functions to allow better non-functional as well functional error handling for backend responses

## Outgoing Transformation

Outgoing transformation provides ability to transform the parameters before they are applied to the operation functions.

## Incoming Transformation

Incoming transformation provides ability to transform the response body received from the backend system

## Syntax to configure error handler & transformations
There are two ways in which the error handler, outgoing and incoming transformation functions can be added:

1. Adding script to boot folder - Functions are added after model association
2. Adding configuration to operation JSON templates - Functions are added to datasource

#### Adding Script to boot folder

Add boot script as follows:

```js

module.exports = function(app) {
  var customFunction = app.models.backend.customFunction;

  var errorHandler = function(err,body,response,callback) {
    if(err)
      return callback(err);

    if(body.error && body.error.errorCode) {
      var error = new Error(body.error.message);
      error.statusCode = 500;
      error.code = 'SYS' + body.error.errorCode;
      return callback(error);
    }
    return callback(null,body,response);
  }

  var outgoingTransformFn = function(parameters) {
      parameters.id = 'PRE' + parameters.id;
      return parameters;
  };

  var incomingTransformFn = function(body) {
      return body.query.results;
  };

  customFunction.errorHandler = errorHandler;
  customFunction.outgoingTransform = outgoingTransformFn;
  customFunction.incomingTransform = incomingTransformFn;
};

```
#### Adding configuration to operation JSON templates

First modify operation template with additional attributes: (errorHandler, outgoingTransform, incomingTransform)
```js
{
    "template": {
        "method": "GET",
        "url": "/api/backend/{id}",
        "query": {
            "id": "{id}"
        }
    },
    "functions": {
        "customFunction": ["id"]
    },
    "errorHandler": "customFunction.errorHandler",
    "outgoingTransform": "customFunction.outgoingTransform",
    "incomingTransform": "customFunction.incomingTransform"
}

```
Secondly, add JS file at the same location as of the operation template, with following code. The connector parses the handler string and splits by '.' (dot). First segment is considered as the filename to load and the second segment is considered as the function name.

```js

exports.errorHandler = function(err,body,response,callback){
    console.log('customFunction errorHandler called');

    if(!err) {
        if(!body.query.results) {
            err = new Error('No results found');
            err.statusCode = 404;
        }
    }
    callback(err,body,response);
};

exports.outgoingTransform = function(parameters){
    // can modify parameters before returning
    console.log('customFunction outgoingTransform called');
    return parameters;
};

exports.incomingTransform = function(body){
    // can modify body before returning
    console.log('customFunction incomingTransform called');
    return body;
};

```
#### Use of external transformation library
To use external library like handlebars:

1. Modify datasources.json as:

Add transformer attribute to datasource definition.

```js

"myNewDataSource": {
    "name": "myNewDataSource",
    "connector": "flexirest",
    "endpoints": "endpoints", // path to folder where Operation templates are placed. This is relative to application root.
    "baseURL" : "http://XXX.YYY.ZZZ/api" // The environment specific hostname and URI root
    "transformer" : {
        "library" : "handlebars", // library attribute is path to the transformation file or a npm module. Details are mentioned later
        "ext" : "hbs" // file extension for transformation templates
    }
}

```

2. Modify operation template

In place of mentioning the function name for outgoing and incoming transformation, specify the name of the transformation template. Check for examples at [example-templates].

```js

{
    "template": {
        "method": "GET",
        "url": "/api/backend/{id}",
        "query": {
            "id": "{id}"
        }
    },
    "functions": {
        "customFunction": ["id"]
    },
    "errorHandler": "customFunction.errorHandler",
    "outgoingTransform": "outgoing.hbs",
    "incomingTransform": "incoming.hbs"
}

```

## Transformation Hooks

Transformation hooks enable application to intercept the parameters during outgoing transformation and response during incoming transformation. All hooks are attached to the connector instance. The hooks leverages [observer] mixin methods that are available as part of the connector.

### before/after outgoingTransform

Context in case of outgoingTransform contains:
  - name : Function name
  - parameters : An Object carrying all function parameters

```js

connector.observe('before outgoingTransform', function(ctx, next) {

    // ctx - name, parameters
    console.log('before outgoingTransform');
    next();
});

connector.observe('after outgoingTransform', function(ctx, next) {

    // ctx - name, parameters
    console.log('after outgoingTransform');
    next();
});
```

### before/after incomingTransform

Context in case of incomingTransform contains:
  - name : Function name
  - response : Instance of the response object received from request module
  - body : JSON object received from the backend service

```js

connector.observe('before incomingTransform', function(ctx, next) {

    // ctx - name, response, body
    console.log('before incomingTransform');
    next();
});

connector.observe('after incomingTransform', function(ctx, next) {

    // ctx - name, response, body
    console.log('after incomingTransform');
    next();
});
```

## To debug
Start node with debug prefix as DEBUG=loopback:connector:flexirest node .

Roadmap
--------------------------
- Improve documentation
- Use of mixins to add transformer functions
- Add promises in place of callbacks
- Add cache hooks with full / partial-refresh strategy
- Ability to create a higher level function by orchestrating with multiple low level function
- Test coverage

See Also
--------------------------

- [loopback-connector-rest][loopback-connector-rest]

[template]: https://docs.strongloop.com/display/public/LB/REST+connector#RESTconnector-Definingacustommethodusingatemplate
[loopback-connector-rest]: https://docs.strongloop.com/display/public/LB/REST+connector
[example-templates]: https://github.com/yantrashala/loopback-connector-flexirest/tree/master/test/flexirestTest/endpoints
[observer]: http://apidocs.strongloop.com/loopback-datasource-juggler/#observermixin-notifyobserversaround
