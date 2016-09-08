/* @flow */
const createValidatedReducer = require('../lib/main.js');
const assert = require('assert');

describe('Basic', () => {
  describe('specifying a schema', () => {
    const identityReducer = (state) => state;

    it('accepts a simple schema as an object', () => {
      const schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "empty"
      };
      createValidatedReducer(identityReducer, schema)({}, {});
    });

    it('accepts an entry point id as a string and multiple schemas as an object', () => {
      const schemas = {
        empty1: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty1"
        },
        empty2: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty1"
        }
      };
      createValidatedReducer(identityReducer, 'empty1', { schemas })({}, {});
      createValidatedReducer(identityReducer, 'empty2', { schemas })({}, {});
    });

    it('accepts a main schema as an object and multiple secondary schemas as an object', () => {
      const schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "empty"
      };
      const schemas = {
        empty1: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty1"
        },
        empty2: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty2"
        }
      };
      createValidatedReducer(identityReducer, schema, { schemas })({}, {});
    });

    it('accepts a main schema as an object even if it appears in the secondary schemas', () => {
      const schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "empty1"
      };
      const schemas = {
        empty1: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty1"
        },
        empty2: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty2"
        }
      };
      createValidatedReducer(identityReducer, schema, { schemas })({}, {});
    });

    it('throws if the main schema is specified differently in the secondary schemas', () => {
      const schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "empty1",
        "required": ["fhqwgads"]
      };
      const schemas = {
        empty1: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty1"
        },
        empty2: {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "id": "empty2"
        }
      };
      assert.throws(() => {
        createValidatedReducer(identityReducer, schema, { schemas })({}, {});
      });
    });
  });

  describe('checking a schema', () => {
    const overwriteReducer = (state, action) => action;
    const fooSchema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "id": "foo",
      "properties": {
        "foo": {
          "type": "string"
        }
      },
      "required": ["foo"],
      "additionalProperties": false
    };
    const fooState = {
      foo: 'hello'
    };
    const barSchema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "id": "bar",
      "properties": {
        "bar": {
          "type": "number"
        }
      },
      "required": ["bar"],
      "additionalProperties": false
    };
    const barState = {
      bar: 3
    };
    const foobarSchema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "id": "foobar",
      "properties": {
        "foobar": {
          "type": "object",
          "properties": {
            "foo": {
              "$ref": "foo"
            },
            "bar": {
              "$ref": "bar"
            }
          },
          "required": ["foo", "bar"]
        }
      },
      "requiredProperties": ["foobar"],
      "additionalProperties": false
    };
    const foobarState = {
      foobar: {
        foo: fooState,
        bar: barState
      }
    };

    it('does not throw if the reducer returns a valid state', () => {
      createValidatedReducer(overwriteReducer, fooSchema)({}, fooState);
    });
    it('returns the state if the reducer returns a valid state', () => {
      const result = createValidatedReducer(overwriteReducer, fooSchema)({}, fooState);
      assert.deepStrictEqual(result, fooState);
    });
    it('throws if the reducer returns an invalid state', () => {
      assert.throws(() => {
        createValidatedReducer(overwriteReducer, fooSchema)({}, barState);
      });
    });
    it('does not throw if the schema contains references', () => {
      const schemas = {
        foo: fooSchema,
        bar: barSchema
      };
      createValidatedReducer(overwriteReducer, foobarSchema, { schemas })({}, foobarState);
    });
    it('throws if references are missing', () => {
      assert.throws(() => {
        createValidatedReducer(overwriteReducer, foobarSchema)({}, foobarState);
      });
    });
  });
});
