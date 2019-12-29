export interface Point {
  x: number;
  y: number;
}

export interface Line {
  p1: Point;
  p2: Point;
  normal? :Point;
}

export default class Vector {
  static clone (p1: Point): Point {
    return { ...p1 }
  }

  static add (p1: Point, p2: Point): Point {
    const pNew: Point = this.clone(p1)
    pNew.x += p2.x
    pNew.y += p2.y
    return pNew
  }

  static sub (p1: Point, p2: Point): Point {
    const pNew: Point = this.clone(p1)
    pNew.x -= p2.x
    pNew.y -= p2.y
    return pNew
  }

  static scale (p1: Point, scale: number): Point {
    const pNew: Point = this.clone(p1)
    pNew.x *= scale
    pNew.y *= scale
    return pNew
  }

  // 内積
  static inner (p1: Point, p2: Point): number {
    return (p1.x * p2.x) + (p1.y * p2.y)
  }

  // 垂直なベクトルを返す（時計回りに90°）
  static vertical (p1: Point): Point {
    const pNew: Point = this.clone(p1)
    const x: number = -pNew.y
    const y: number = pNew.x
    pNew.x = x
    pNew.y = y
    return pNew
  }

  // lengthは予約語なのでpをつける
  static pLength (p1: Point): number {
    return Math.sqrt((p1.x ** 2) + (p1.y ** 2))
  }

  // 正規化
  static normalize (p1: Point): Point {
    let length: number = this.pLength(p1)
    if (length > 0) length = 1 / length
    const pNew: Point = this.clone(p1)
    pNew.x = pNew.x * length
    pNew.y = pNew.y * length
    return pNew
  }

  // 法線
  static normal (line: Line): Point {
    const sub = this.sub(line.p2, line.p1)
    const nor = this.normalize(sub)
    // 時計回りに90°回転させる
    return this.vertical(nor)
  }

  // 交差しているか判定を返す
  static t (line: Line, mousePos: Point, radius: Point): number {
    // normal?は存在するかわからないので!が必要
    const normal: Point = line.normal!
    return -(normal.x * (mousePos.x - line.p1.x) + normal.y * (mousePos.y - line.p1.y)) / (normal.x * radius.x + normal.y * radius.y)
  }
}
