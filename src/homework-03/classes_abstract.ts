enum Colors {
  red = '#ff000',
  green = '#00ff00',
  blue = '#0000ff',
}

interface IBaseFigure {
  readonly name: string;
  readonly color: Colors;
  calculateArea: () => number;
}

interface ICircle extends IBaseFigure {
  radius: number;
}

interface ISquare extends IBaseFigure {
  sideA: number;
  print: () => string;
}

interface IRectangle extends ISquare {
  sideA: number;
  sideB: number;
}

interface ITriangle extends IBaseFigure {
  sideA: number;
  sideB: number;
  sideC: number;
}

abstract class BaseFigure implements IBaseFigure {
  constructor(
    readonly name: string,
    readonly color: Colors
  ) {}

  abstract calculateArea(): number;
}

class Circle extends BaseFigure implements ICircle {
  private _radius: number;

  constructor(name: string, color: Colors, radius: number) {
    super(name, color);
    this._radius = radius;
  }

  set radius(value: number) {
    this._radius = value;
  }

  get radius(): number {
    return this._radius;
  }

  calculateArea(): number {
    return 2 * Math.PI * this._radius;
  }
}

class Square extends BaseFigure implements ISquare {
  constructor(
    name: string,
    color: Colors,
    public sideA: number
  ) {
    super(name, color);
  }

  public calculateArea(): number {
    return Math.sqrt(this.sideA);
  }

  public print(): string {
    return 'S =  sqrt( sideA )';
  }
}

class Rectangle extends BaseFigure implements IRectangle {
  constructor(
    name: string,
    color: Colors,
    public sideA: number,
    public sideB: number
  ) {
    super(name, color);
  }

  public calculateArea(): number {
    return Math.sqrt(this.sideA);
  }

  public print(): string {
    return 'S = sideA * sideB';
  }
}

class Triangle extends BaseFigure implements ITriangle {
  constructor(
    name: string,
    color: Colors,
    public sideA: number,
    public sideB: number,
    public sideC: number
  ) {
    super(name, color);
  }

  public calculateArea(): number {
    const p = (this.sideA + this.sideB + this.sideC) / 2;
    return Math.sqrt(p * (p - this.sideA) * (p - this.sideB) * (p - this.sideC));
  }
}
