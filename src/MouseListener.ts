import { Point } from '@/Vector'

export default class MouseListener {
  static listenMousePos (parent: HTMLElement, excludeChildren: Array<HTMLElement>, mousePos: Point) {
    parent.addEventListener('mousemove', function (evt) {
      mousePos.x = evt.offsetX
      mousePos.y = evt.offsetY
    })

    // マウスの上にペットのアイコンがくるとマウスの位置が狂うので無効化する
    excludeChildren.forEach(child => {
      child.addEventListener('mousemove', function (evt) {
        evt.stopPropagation()
      })
    })
  }
}
