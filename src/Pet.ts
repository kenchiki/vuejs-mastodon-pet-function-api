import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import Account from '@/store/Account'
import Vue from 'vue'
import Vector, { Line, Point } from '@/Vector'
import HitTestLines from '@/HitTestLines'
import { SetupContext } from '@vue/composition-api'
enum PetStatus { Move, Sleep, Stroke, Hit }
enum ActionKind { All, Free }

export interface FreeInfo {
  action: PetStatus;
  weight?: number;
  calcedWeight?: number;
  message: string;
  frame: number;
  kind: ActionKind;
  init?: Function;
  before?: Function;
  after?: Function;
  finish?: Function;
}

export default class Pet {
  private pos: Point = { x: 100, y: 200 };
  static readonly MOVE: number = 1;
  static readonly MOVE_DISTANCE: number = 150;
  static readonly RADIUS: number = 30;
  private frame: number = 0;
  private actions: Array<FreeInfo> = this.factoryFrees();
  private frees: Array<FreeInfo> = this.calcedFrees();
  public freeStatus: FreeInfo = this.findAction(PetStatus.Move);
  private purposePos: Point = { x: 0, y: 0 };
  private readonly hitTestLines: Array<Line> = HitTestLines.linesWithNormal();
  private context: SetupContext;
  private touchDisabled: boolean = false;

  constructor (context: SetupContext) {
    this.context = context
    if (this.freeStatus.init) this.freeStatus.init.apply(this)
  }

  private factoryFrees (): Array<FreeInfo> {
    return [
      {
        action: PetStatus.Move,
        weight: 70,
        calcedWeight: 0,
        message: '迅速に遊んでいます。',
        frame: 0,
        kind: ActionKind.Free,
        init: this.moveInit,
        before: this.moveBefore
      },
      {
        action: PetStatus.Sleep,
        weight: 7,
        calcedWeight: 0,
        message: `${this.account().name}は眠たいみたいです。`,
        frame: 100,
        kind: ActionKind.Free,
        init: this.sleepInit,
        after: this.setRandomFreeByFrame
      },
      {
        action: PetStatus.Stroke,
        message: `${this.account().name}は喜んでいます。`,
        frame: 20,
        kind: ActionKind.All,
        init: this.strokeInit,
        after: this.setRandomFreeByFrame
      },
      {
        action: PetStatus.Hit,
        message: `${this.account().name}は怒っています！`,
        frame: 60,
        kind: ActionKind.All,
        init: this.hitInit,
        after: this.setRandomFreeByFrame,
        finish: this.hitFinish
      }
    ]
  }

  private calcedFrees (): Array<FreeInfo> {
    let frees: Array<FreeInfo> = this.factoryFrees()
    frees = frees.filter((free: FreeInfo) => free.kind === ActionKind.Free)
    let curWeight = 0
    frees.forEach(free => {
      curWeight += free.weight!
      free.calcedWeight = curWeight
    })
    return frees
  }

  private moveInit () {
    const randomX = Math.random() * Pet.MOVE_DISTANCE * 2 - Pet.MOVE_DISTANCE
    const randomY = Math.random() * Pet.MOVE_DISTANCE * 2 - Pet.MOVE_DISTANCE
    const move: Point = { x: randomX, y: randomY }
    this.purposePos = Vector.add(this.pos, move)
  }

  private moveBefore () {
    if (this.move({ purposePos: this.purposePos, linesWithNormal: this.hitTestLines })) {
      this.setFree()
    }
  }

  // 移動アルゴリズム
  private move ({ purposePos, linesWithNormal }: { purposePos: Point, linesWithNormal: Array<Line> }): boolean {
    let moveFin: boolean = false

    // 移動すべきベクトル
    let purpose: Point = { x: purposePos.x - this.pos.x, y: purposePos.y - this.pos.y }
    const purposeNor: Point = Vector.normalize(purpose)

    // 目的地に到着している
    if (Vector.pLength(purpose) < Pet.MOVE) return true

    // MOVE分ペット移動
    purpose = Vector.scale(purposeNor, Pet.MOVE)
    this.pos = Vector.add(this.pos, purpose)

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
          this.pos = Vector.add(re, c)
          moveFin = true
        }
      }
    })

    this.element().style.left = `${this.pos.x - Pet.RADIUS}px`
    this.element().style.top = `${this.pos.y - Pet.RADIUS}px`

    return moveFin
  }

  // 寝る開始で寝るアイコン表示
  private sleepInit () {
    this.element().classList.add('sleep')
  }

  // 喜ぶアイコン表示
  private strokeInit () {
    this.element().classList.add('stroke')
  }

  // 叩くアイコン表示
  private hitInit () {
    this.element().classList.add('hit')
    this.touchDisabled = true
  }

  // 叩く終了
  private hitFinish () {
    this.touchDisabled = false
  }

  // 重みから次のランダムの動きを取得
  private randomFree (): FreeInfo {
    const totalWeight = this.frees[this.frees.length - 1].calcedWeight!
    const pickedWeight = Math.random() * totalWeight
    return this.frees.find(free => pickedWeight <= free.calcedWeight!)!
  }

  // 自由行動
  public free () {
    if (this.freeStatus.before) this.freeStatus.before.apply(this)
    this.frame++
    if (this.freeStatus.after) this.freeStatus.after.apply(this)
  }

  // 初期化
  public init () {
    this.actionInit()
    this.setMessage()
    this.setAvatar()
    this.listenerStroke()
    this.listenerHit()
  }

  // なでる
  private listenerStroke () {
    this.element().addEventListener('mousemove', (evt) => {
      if (!this.touchDisabled) this.setFree(this.findAction(PetStatus.Stroke))
    })
  }

  // たたく
  private listenerHit () {
    this.element().addEventListener('mousedown', (evt) => {
      this.setFree(this.findAction(PetStatus.Hit))
    })
  }

  // 該当の行動を取得する
  private findAction (status: PetStatus) :FreeInfo {
    return this.actions.find(free => free.action === status)!
  }

  // アバター設定
  private setAvatar () {
    this.element().style.backgroundImage = `url(${this.account().avatar})`
    this.element().style.display = 'block'
  }

  private actionInit () {
    if (this.freeStatus.init) this.freeStatus.init.apply(this)
  }

  // ランダムで次の動きを取得して設定
  private setFree (action: FreeInfo = this.randomFree()) {
    if (this.freeStatus.finish) this.freeStatus.finish.apply(this)
    this.freeStatus = action
    this.setMessage()
    this.clearFrame()
    this.removeClass()
    this.actionInit()
  }

  private setMessage () {
    this.context.emit('setMessage', this.freeStatus.message)
  }

  private element (): HTMLElement {
    return document.getElementById('pet')!
  }

  private account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  private clearFrame () {
    this.frame = 0
  }

  // 表情をリセット
  private removeClass () {
    this.element().className = ''
  }

  private setRandomFreeByFrame () {
    if (this.frame > this.freeStatus.frame) {
      this.setFree()
    }
  }
}
