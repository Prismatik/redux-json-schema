/* @flow */
import Ajv from 'ajv';

type Action = { type: string };
type State = any;
type Reducer = (state: State, action: Action) => State;
type Schema = {};

class SchemaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'SchemaValidationError';
  }
}

const createValidatedReducer =
  (reducer: Reducer, schema: Schema | string, options: ?{}): Reducer => {
    const ajv = new Ajv(options);
    const validate = typeof schema === 'string' ? ajv.getSchema(schema) : ajv.compile(schema);

    const validatedReducer = (state: State, action: Action) => {
      const futureState = reducer(state, action);

      if (!validate(futureState)) {
        throw new SchemaValidationError(ajv.errorsText(validate.errors));
      }

      return futureState;
    };
    return validatedReducer;
  };

createValidatedReducer.SchemaValidationError = SchemaValidationError;

export default createValidatedReducer;
