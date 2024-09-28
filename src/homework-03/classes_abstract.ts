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

  protected checkLength(value: number): number {
    if (value < 0) {
      throw new Error(`Lenth must be > 0, but get ${value}`);
    }
    return value;
  }
}

class Circle extends BaseFigure implements ICircle {
  private _radius!: number;

  constructor(name: string, color: Colors, radius: number) {
    super(name, color);
    this.radius = radius;
  }

  set radius(value: number) {
    this._radius = this.checkLength(value);
  }

  get radius(): number {
    return this._radius;
  }

  calculateArea(): number {
    return 2 * Math.PI * this._radius;
  }
}

class Square extends BaseFigure implements ISquare {
  public _sideA!: number;

  constructor(name: string, color: Colors, sideA: number) {
    super(name, color);
  }

  set sideA(value: number) {
    this._sideA = this.checkLength(value);
  }

  get sideA(): number {
    return this._sideA;
  }

  public calculateArea(): number {
    return Math.sqrt(this.sideA);
  }

  public print(): string {
    return 'S =  sqrt( sideA )';
  }
}

class Rectangle extends BaseFigure implements IRectangle {
  private _sideA!: number;
  private _sideB!: number;

  constructor(name: string, color: Colors, sideA: number, sideB: number) {
    super(name, color);
    this.sideA = sideA;
    this.sideB = sideB;
  }

  set sideA(value: number) {
    this._sideA = this.checkLength(value);
  }

  get sideA() {
    return this._sideA;
  }

  set sideB(value: number) {
    this._sideB = this.checkLength(value);
  }

  get sideB() {
    return this._sideB;
  }

  public calculateArea(): number {
    return this._sideA * this._sideB;
  }

  public print(): string {
    return 'S = sideA * sideB';
  }
}

class Triangle extends BaseFigure implements ITriangle {
  private _sideA: number = 0;
  private _sideB: number = 0;
  private _sideC: number = 0;

  constructor(name: string, color: Colors, sideA: number, sideB: number, sideC: number) {
    super(name, color);
    this.sideA = sideA;
    this.sideB = sideB;
    this.sideC = sideC;
  }

  private exists(): boolean {
    if (
      !(this._sideA && this._sideB && this._sideC) ||
      2 * Math.max(this._sideA, this._sideB, this._sideC) >= this._sideA + this._sideB + this._sideC
    ) {
      return true;
    }
    throw new Error(`Triangle with sides ${this._sideA} ${this._sideB} ${this._sideC} does not exists`);
  }

  set sideA(value: number) {
    this._sideA = this.checkLength(value);
    this.exists();
  }

  get sideA() {
    return this._sideA;
  }

  set sideB(value: number) {
    this._sideB = this.checkLength(value);
    this.exists();
  }

  get sideB() {
    return this._sideB;
  }

  set sideC(value: number) {
    this._sideB = this.checkLength(value);
    this.exists();
  }

  get sideC() {
    return this._sideB;
  }

  public calculateArea(): number {
    const p = (this.sideA + this.sideB + this.sideC) / 2;
    return Math.sqrt(p * (p - this.sideA) * (p - this.sideB) * (p - this.sideC));
  }
}
