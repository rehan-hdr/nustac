/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as logAccess from "../logAccess.js";
import type * as queryData from "../queryData.js";
import type * as userLogin from "../userLogin.js";
import type * as userMutation from "../userMutation.js";
import type * as userQueries from "../userQueries.js";
import type * as userRegistration from "../userRegistration.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  logAccess: typeof logAccess;
  queryData: typeof queryData;
  userLogin: typeof userLogin;
  userMutation: typeof userMutation;
  userQueries: typeof userQueries;
  userRegistration: typeof userRegistration;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
