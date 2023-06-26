enum CellType {
  Empty,
  Wall,
  BreakableWall,
  Bomb,
  Player,
  Enemy,
}

export class Gird {
  public rows: number = 15;
  public cols: number = 13;
  public map: CellType[][] = [];

  constructor() {
    for (let i = 0; i < this.rows; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.map[i][j] = 0;
      }
    }
  }
}
