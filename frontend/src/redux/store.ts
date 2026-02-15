import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
  type Middleware,
} from "redux";
import { createLogger } from "redux-logger";

import { userReducer } from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

declare global {
  interface Window {
    // Legacy Redux DevTools compose hook for non-RTK store setup.
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware: Middleware[] = [];

// `redux-logger` types are stricter than Redux middleware generics (UnknownAction vs AnyAction).
// Cast keeps the runtime behavior while satisfying Redux's `applyMiddleware` typing.
const logger = createLogger() as unknown as Middleware;

if (import.meta.env.DEV) {
  middleware.push(logger);
}

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware)),
);
export type AppDispatch = typeof store.dispatch;
