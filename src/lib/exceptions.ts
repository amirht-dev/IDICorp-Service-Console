export class UnauthenticatedError extends Error {
  constructor() {
    super('Access token is not exists try to sign in.');
  }
}
