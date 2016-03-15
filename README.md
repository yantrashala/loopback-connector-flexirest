# loopback-connector-flexirest

LoopBack FLEXIREST connector allows loopback application to interact with backend REST APIs. It leverages [loopback-connector-rest] for basic building blocks and adds additional "flexible" features to allow interaction with backend services.

# Installation

```sh
npm install loopback-connector-flexirest
```

# Features

- Use custom folder (endpoints) to organize operations

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
- Use connector hooks to execute JSON transformation
- Externalize Trasformation and configuration during connector initialization
- Test coverage

See Also
--------------------------

- [loopback-connector-rest][loopback-connector-rest]

[template]: https://docs.strongloop.com/display/public/LB/REST+connector#RESTconnector-Definingacustommethodusingatemplate
[loopback-connector-rest]: https://docs.strongloop.com/display/public/LB/REST+connector
