export class LoginLocalStorage {

  public id: string;
  public ttl: number;
  public created: Date;
  public userId: number;

  /* tslint:disable */
  static toObject(object: any): LoginLocalStorage {
    /* tslint:enable */
    object = JSON.parse(object);
    let result: LoginLocalStorage = new LoginLocalStorage();
    if (object != null) {
      result.id = object.id;
      result.ttl = object.ttl;
      result.created = object.created;
      result.userId = object.userId;
    }
    return result;
  }
}
