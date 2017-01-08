export class Alert {

  private _type: string;
  private _text: string;

  constructor(type: string, text: string) {
    this._type = type;
    this._text = text;
  }

  public get type(): string {
    return this._type;
  }

  public set type(value: string) {
    this._type = value;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
  }

}
