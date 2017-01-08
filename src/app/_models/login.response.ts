/**
 * This object is used to map the server response to
 * the login call. This object has information about the user
 * and the logged in session
 */
export class LoginResponse {

  public id: string;
  public ttl: number;
  public created: Date;
  public userId: number;

  /* tslint:disable */
  static toObject(object: any): LoginResponse {
    /* tslint:enable */
    object = JSON.parse(object);
    let result: LoginResponse = new LoginResponse();
    if (object != null) {
      result.id = object.id;
      result.ttl = object.ttl;
      result.created = object.created;
      result.userId = object.userId;
    }
    return result;
  }
}
