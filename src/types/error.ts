type AuthErrorType = "NOT_AUTHENTICATED" | "ACCESS_DENIED";

export class AuthError extends Error {
  public readonly type;
  public readonly serverMessage;

  constructor(type: AuthErrorType, serverMessage?: string) {
    super(serverMessage || "Unknown error.");
    this.type = type;
    this.serverMessage = serverMessage;
  }
}
