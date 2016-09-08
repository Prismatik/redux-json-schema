redux-json-schema
=================

Schema Checking for your Redux state
------------------------------------

`redux-json-schema` is a library that lets you bring all the magic of [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/) to your amazing [Redux](http://redux.js.org/) app. By checking your state tree with JSON Schema, you can easily catch many classes of bugs that might cause your state to become invalid. If you're using JSON Schema elsewhere, you can even reuse your existing schema definitions right in your app!

To read more about the rationale behind `redux-json-schema`, you can check out our blog post about it [here](http://zombo.com).

How to use it
-------------

First, `npm install --save redux-json-schema`, then pick a reducer you would like to schema check and wrap it like this:

```Javascript
  import createValidatedReducer from 'redux-json-schema';

  const wayBetterReducer = createValidatedReducer(reducer, schema);
```

Now any time that reducer would return an invalid state as specified in the schema, it will instead throw a helpful exception!

The easiest way to integrate it with Redux is to create one schema for your whole state tree and validate everything at once:

```Javascript
  import { createStore } from 'redux'
  import createValidatedReducer from 'redux-json-schema';

  import reducer from './reducers';
  import schema from '../schemas/app.json';

  const store = createStore(createValidatedReducer(reducer, schema));
```

But you may want to split that schema out into multiple subschemas, like so:

```Javascript
  import { createStore } from 'redux'
  import createValidatedReducer from 'redux-json-schema';

  import reducer from './reducers';
  import schema from '../schemas'; //An object containing all your schemas

  const store = createStore(createValidatedReducer(reducer, schemas.app, { schemas }));
```

That third argument to `createValidatedReducer` is passed straight to [Ajv](https://github.com/epoberezkin/ajv), so you can specify any options it understands. However, keep in mind that async validation won't work because reducers are always synchronous.

You can see an example of this library in action in our [todomvc example](https://github.com/Prismatik/redux-json-schema-todomvc)
