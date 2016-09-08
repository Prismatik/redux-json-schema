/* @flow */
const createValidatedReducer = require('../lib/main.js');
const assert = require('assert');
const redux = require('redux');

describe('Integration', () => {
  describe('usage with redux', () => {
    const FOO = 'FOO';
    const BAR = 'BAR';
    const defaultState = { foo: 'foo', bar: 3 };
    const simpleReducer = (state = defaultState, action) => {
      switch (action.type) {
        case FOO:
          return Object.assign({}, state, { foo: action.payload });
        case BAR:
          return Object.assign({}, state, { bar: action.payload });
        default:
          return state;
      }
    };


    const stateSchema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "id": "appState",
      "type": "object",
      "properties": {
        "foo": {
          "type": "string"
        },
        "bar": {
          "type": "number"
        }
      },
      required: ['foo', 'bar'],
      "additionalProperties": true
    };

    const reducer = createValidatedReducer(simpleReducer, stateSchema);
    const fooAction = (payload) => ({ type: FOO, payload });
    const barAction = (payload) => ({ type: BAR, payload });

    it('throws if the store is created with invalid data', () => {
      assert.throws(() => {
        redux.createStore(reducer, {});
      });
    });

    it('does not throw if the store is created with valid data', () => {
      const data = { foo: 'foo', bar: 3 };
      const store = redux.createStore(reducer, data);
      assert.deepStrictEqual(store.getState(), data);
    });

    it('does not throw on an action that leads to a valid state', () => {
      const store = redux.createStore(reducer);
      store.dispatch({ type: 'DUMMY' });
    });

    it('allows the reducer to affect the store if it returns a valid state', () => {
      const data = { foo: 'foo', bar: 3 };
      const store = redux.createStore(reducer, data);
      store.dispatch(fooAction('hello'));
      assert.deepStrictEqual(store.getState(), { foo: 'hello', bar: 3 });
    });

    it('throws if the reducer would return an invalid state', () => {
      const data = { foo: 'foo', bar: 3 };
      const store = redux.createStore(reducer, data);
      assert.throws(() => {
        store.dispatch(barAction('hello'));
      });
    });
  });
});
