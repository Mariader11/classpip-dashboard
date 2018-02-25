export class Match {

  private _id: string;
  private _player1: number;
  private _player2: number;
  private _winner: number;
  private _journeyId: number;

  constructor(id?: string, player1?: number, player2?: number, winner?: number, journeyId?: number) {
    this._id = id;
    this._player1 = player1;
    this._player2 = player2;
    this._winner = winner;
    this._journeyId = journeyId;
  }

  /* tslint:disable */
  static toObject(object: any): Match {
    /* tslint:enable */
    const result: Match = new Match();
    if (object != null) {
      result.id = object.id;     /* result.id  no me dara error en .id, .name, .type, etc cuando lo defina en set*/
      result.player1 = object.player1;
      result.player2 = object.player2;
      result.winner = object.winner;
      result.journeyId = object.journeyId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Match> {
    /* tslint:enable */
    const resultArray: Array<Match> = new Array<Match>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Match.toObject(object[i]));
      }
    }
    return resultArray;
  }


  /*  Getters and Setters  */

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get player1(): number {
    return this._player1;
  }

  public set player1(value: number) {
    this._player1 = value;
  }

  public get player2(): number {
    return this._player2;
  }

  public set player2(value: number) {
    this._player2 = value;
  }

  public get winner(): number {
    return this._winner;
  }

  public set winner(value: number) {
    this._winner = value;
  }

  public get journeyId(): number {
    return this._journeyId;
  }

  public set journeyId(value: number) {
    this._journeyId = value;
  }
}
