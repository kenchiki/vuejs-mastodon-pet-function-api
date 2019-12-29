import { Line } from '@/Vector'

export default class LinesDrawer {
  // 当たり判定を視覚化
  static drawHitTest (canvas: HTMLCanvasElement, lines: Array<Line>) {
    lines.forEach(line => this.drawLine(canvas, line))
  }

  // キャンバスに線を引く
  private static drawLine (canvas: HTMLCanvasElement, line: Line) {
    const cc = canvas.getContext('2d') as CanvasRenderingContext2D
    cc.beginPath()
    cc.lineWidth = 2 // 線の太さを指定
    cc.lineTo(line.p1.x, line.p1.y) // 開始位置の指定
    cc.lineTo(line.p2.x, line.p2.y) // 終了位置の指定
    cc.stroke()
  }
}
