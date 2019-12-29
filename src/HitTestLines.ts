import { Line, Point } from '@/Vector'

export default class HitTestLines {
  static lines () : Array<Line> {
    let lines: Array<Line> = []
    const house: Array<Line> = [
      {
        p1: { x: 250, y: 50 },
        p2: { x: 500, y: 200 }
      },
      {
        p1: { x: 500, y: 200 },
        p2: { x: 250, y: 350 }
      },
      {
        p1: { x: 250, y: 350 },
        p2: { x: 0, y: 200 }
      },
      {
        p1: { x: 0, y: 200 },
        p2: { x: 250, y: 50 }
      }
    ]

    const desk: Array<Line> = [
      {
        p1: { x: 300, y: 200 },
        p2: { x: 250, y: 170 }
      },
      {
        p1: { x: 250, y: 170 },
        p2: { x: 200, y: 200 }
      },
      {
        p1: { x: 200, y: 200 },
        p2: { x: 250, y: 230 }
      },
      {
        p1: { x: 250, y: 230 },
        p2: { x: 300, y: 200 }
      }
    ]

    lines = lines.concat(house)
    lines = lines.concat(desk)
    return lines
  }
}
