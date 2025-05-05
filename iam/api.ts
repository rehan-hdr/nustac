import { FunctionReference, anyApi } from "convex/server";
import { GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  queryData: {
    getUserByEmail: FunctionReference<
      "query",
      "public",
      { email: string },
      any
    >;
  };
  userLogin: {
    userLogin: FunctionReference<
      "action",
      "public",
      { email: string; password: string },
      any
    >;
  };
  userRegistration: {
    checkEmail: FunctionReference<"action", "public", { email: string }, any>;
    sendMessage: FunctionReference<
      "action",
      "public",
      { email: string; password: string },
      any
    >;
  };
  userQueries: {
    getUserByEmail: FunctionReference<
      "query",
      "public",
      { email: string },
      any
    >;
  };
  userMutation: {
    updateUserPassword: FunctionReference<
      "mutation",
      "public",
      { hashedPassword: string; userId: Id<"Users"> },
      any
    >;
  };
};
export type InternalApiType = {};
