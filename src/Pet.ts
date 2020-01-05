import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import Account from '@/store/Account'
import Vue from 'vue'
import Vector, { Line, Point } from '@/Vector'
import HitTestLines from '@/HitTestLines'
enum PetStatus { Move, Sleep }

export interface FreeInfo {
  action: PetStatus;
  weight: number;
  calcedWeight: number;
  message: string;
  frame: number;
  init?: Function;
  before?: Function;
  after?: Function;
}

export default class Pet {
  private pos: Point = { x: 100, y: 200 };
  static readonly MOVE: number = 1;
  static readonly RADIUS: number = 20;
  private frame: number = 0;
  private frees: Array<FreeInfo> = this.calcedFrees()
  private freeStatus: FreeInfo = this.randomFree();
  private purposePos: Point = { x: 0, y: 0 };
  private readonly hitTestLines: Array<Line> = HitTestLines.linesWithNormal();

  moveInit () {
    const randomRange = 150
    const randomX = Math.random() * randomRange * 2 - randomRange
    const randomY = Math.random() * randomRange * 2 - randomRange
    const move: Point = { x: randomX, y: randomY }
    this.purposePos = Vector.add(this.pos, move)
  }

  moveBefore () {
    if (this.move({ purposePos: this.purposePos, linesWithNormal: this.hitTestLines })) {
      this.setRandomFree()
    }
  }

  move ({ purposePos, linesWithNormal }: { purposePos: Point, linesWithNormal: Array<Line> }): boolean {
    let moveFin: boolean = false

    // 移動すべきベクトル
    let purpose: Point = { x: purposePos.x - this.pos.x, y: purposePos.y - this.pos.y }
    const purposeNor: Point = Vector.normalize(purpose)

    // 目的地に到着している
    if (Vector.pLength(purpose) < Pet.MOVE) return true

    // MOVE分ペット移動
    purpose = Vector.scale(purposeNor, Pet.MOVE)
    this.setPos(Vector.add(this.pos, purpose))

    // 交差していたら線より手前に戻す
    linesWithNormal.forEach((line) => {
      // ボールの中心から線の法線とは逆向きの半径のベクトル
      const rad = Vector.scale(line.normal!, -Pet.RADIUS) // normalは必須じゃないので!で値があることを示してあげる必要がある

      const t = Vector.t(line, this.pos, rad)
      // 無限線を交差してる
      if (t > 0 && t <= 1) {
        // ボールの中心が交戦になるよう進むベクトルを調整する
        let c = Vector.scale(rad, t)

        // 交差している座標を求める
        // t < 0は通り過ぎた後。t > 1は線の手前。t > 0 && t <= 1は線と半径（進む力）が交わっている
        // t > 0 && t <= 1に半径（進む力）を掛けたベクトルを足して進めてボールの中心が線と交わった座標を求める
        c = Vector.add(c, this.pos)

        const ac = Vector.sub(c, line.p1)
        const bc = Vector.sub(c, line.p2)
        // 内積から交点が線分の中に入っているか調べる※きちんと線の上にいるか
        // 内積 > 0の場合、ベクトルとベクトルの間は90°以内。内積 < 0の場合、ベクトルとベクトルは90°より開いている。つまり、内積 < 0の場合は、お互い外向きの方向になっている。
        if (Vector.inner(bc, ac) <= 0) {
          // 上にいるのでボールの半径の法線の分戻す（法線は時計回り90°回転させた方向のベクトルなので戻る方向を向いている）
          const re = Vector.scale(line.normal!, Pet.RADIUS)
          this.setPos(Vector.add(re, c))
          moveFin = true
        }
      }
    })

    this.element().style.left = `${this.pos.x - Pet.RADIUS}px`
    this.element().style.top = `${this.pos.y - Pet.RADIUS}px`

    return moveFin
  }

  sleepAfter () {
    if (this.frame > this.freeStatus.frame) {
      this.setRandomFree()
    }
  }

  randomFree (): FreeInfo {
    const totalWeight = this.frees[this.frees.length - 1].calcedWeight
    const pickedWeight = Math.random() * totalWeight
    const free: FreeInfo = this.frees.find(free => pickedWeight <= free.calcedWeight)!
    if (free.init) free.init.apply(this)
    this.clearFrame()
    return free
  }

  factoryFrees (): Array<FreeInfo> {
    return [
      { action: PetStatus.Move, weight: 7, calcedWeight: 0, message: '', frame: 0, init: this.moveInit, before: this.moveBefore },
      { action: PetStatus.Sleep, weight: 7, calcedWeight: 0, message: `${this.account().name}は眠たいみたいです`, frame: 20, after: this.sleepAfter }
    ]
  }

  calcedFrees (): Array<FreeInfo> {
    const frees: Array<FreeInfo> = this.factoryFrees()
    let curWeight = 0
    frees.forEach(free => {
      curWeight += free.weight
      free.calcedWeight = curWeight
    })
    return frees
  }

  setAvatar () {
    this.element().style.backgroundImage = `url(${this.account().avatar})`
  }

  setRandomFree () {
    this.freeStatus = this.randomFree()
  }

  element (): HTMLElement {
    return document.getElementById('pet')!
  }

  account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  clearFrame () {
    this.frame = 0
  }

  setPos (pos: Point) {
    this.pos = pos
  }

  free () {
    if (this.freeStatus.before) this.freeStatus.before.apply(this)
    this.frame++
    if (this.freeStatus.after) this.freeStatus.after.apply(this)
  }
}
