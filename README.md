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

You can configure the Flexirest connector by editing datasources.json manually.
```js

"myNewDataSource": {
    "name": "myNewDataSource",
    "connector": "flexirest",
    "endpoints": "endpoints"
}

```
Now create a new folder under application root as "endpoints" and store all your operation JSON files. Each operation file should have one template defined. For understanding the [template] structure, follow the documentation provided.

Roadmap
--------------------------

- Add promises in place of callbacks
- Test coverage

See Also
--------------------------

- [loopback-connector-rest][loopback-connector-rest]

[template]: https://docs.strongloop.com/display/public/LB/REST+connector#RESTconnector-Definingacustommethodusingatemplate
[loopback-connector-rest]: https://docs.strongloop.com/display/public/LB/REST+connector
