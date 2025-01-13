import { loginResponseSchema, userResponseSchema } from "../schema/wpgraphql";

export function validateLoginResponse(json: unknown) {
  return loginResponseSchema.parse(json);
}

export function validateUserResponse(json: unknown) {
  return userResponseSchema.parse(json);
}
