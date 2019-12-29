<template>
  <div id="house">
    <canvas id="hitTest">
      図形を表示するには、canvasタグをサポートしたブラウザが必要です。
    </canvas>
    <div id="pet"></div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, ref, computed, SetupContext, onMounted } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
import Vector, { Point, Line } from '@/Vector'

export default createComponent({
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store
    })
    let petPos: Point = { x: 100, y: 200 }
    const mousePos: Point = { x: 0, y: 0 }
    const RADIUS: number = 10
    const MOVE: number = 3
    let linesWithNormal: Array<Line> = []

    // 当たり判定
    function lines (): Array<Line> {
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

    // 当たり判定を視覚化
    function drawHitTest () {
      const canvas = document.getElementById('hitTest') as HTMLCanvasElement
      // CSSだけでなく横幅、高さ指定しないと解像度がおかしくなる
      canvas.width = 500
      canvas.height = 400
      lines().forEach(function (line) {
        drawLine(line)
      })
    }

    // キャンバスに線を引く
    function drawLine ({ p1, p2 }: {p1: Point, p2: Point}) {
      const canvas = document.getElementById('hitTest') as HTMLCanvasElement
      const cc = canvas.getContext('2d') as CanvasRenderingContext2D

      cc.beginPath()
      cc.lineWidth = 2 // 線の太さを指定
      cc.lineTo(p1.x, p1.y) // 開始位置の指定
      cc.lineTo(p2.x, p2.y) // 終了位置の指定
      cc.stroke()
    }

    // マウスの位置を取得
    function listenMousePos () {
      const house = document.getElementById('house')!
      house.addEventListener('mousemove', function (evt) {
        mousePos.x = evt.offsetX
        mousePos.y = evt.offsetY
      })

      // マウスの上にペットのアイコンがくるとマウスの位置が狂うので無効化する
      const pet = document.getElementById('pet')!
      pet.addEventListener('mousemove', function (evt) {
        evt.stopPropagation()
      })
    }

    // 法線を作る
    function addNormal (): Array<Line> {
      const normalLines = lines()
      normalLines.forEach(function (line) {
        line.normal = Vector.normal(line)
      })
      return normalLines
    }

    function interval (): void {
      // 移動すべきベクトル
      let purpose: Point = { x: mousePos.x - petPos.x, y: mousePos.y - petPos.y }
      const purposeNor: Point = Vector.normalize(purpose)

      // MOVE分ペット移動
      if (Vector.pLength(purpose) < MOVE) return
      purpose = Vector.scale(purposeNor, MOVE)
      petPos = Vector.add(petPos, purpose)

      // 交差していたら線より手前に戻す
      linesWithNormal.forEach(function (line) {
        // ボールの中心から線の法線とは逆向きの半径のベクトル
        const rad = Vector.scale(line.normal!, -RADIUS) // normalは必須じゃないので!で値があることを示してあげる必要がある

        const t = Vector.t(line, petPos, rad)
        // 無限線を交差してる
        if (t > 0 && t <= 1) {
          // ボールの中心が交戦になるよう進むベクトルを調整する
          let c = Vector.scale(rad, t)

          // 交差している座標を求める
          // t < 0は通り過ぎた後。t > 1は線の手前。t > 0 && t <= 1は線と半径（進む力）が交わっている
          // t > 0 && t <= 1に半径（進む力）を掛けたベクトルを足して進めてボールの中心が線と交わった座標を求める
          c = Vector.add(c, petPos)

          const ac = Vector.sub(c, line.p1)
          const bc = Vector.sub(c, line.p2)
          // 内積から交点が線分の中に入っているか調べる※きちんと線の上にいるか
          // 内積 > 0の場合、ベクトルとベクトルの間は90°以内。内積 < 0の場合、ベクトルとベクトルは90°より開いている。つまり、内積 < 0の場合は、お互い外向きの方向になっている。
          if (Vector.inner(bc, ac) <= 0) {
            // 上にいるのでボールの半径の法線の分戻す（法線は時計回り90°回転させた方向のベクトルなので戻る方向を向いている）
            const re = Vector.scale(line.normal!, RADIUS)
            petPos = Vector.add(re, c)
          }
        }
      })

      const pet = document.getElementById('pet') as HTMLElement
      pet.style.left = `${petPos.x - RADIUS}px`
      pet.style.top = `${petPos.y - RADIUS}px`
    }

    onMounted(() => {
      // 当たり判定を視覚化
      drawHitTest()

      // マウスの位置を取得
      listenMousePos()

      // 法線を含むラインを取得
      linesWithNormal = addNormal()

      window.setInterval(interval, 20)
    })
  }
})
</script>

<style scoped lang="scss">
  #house {
    width: 500px;
    height: 400px;
    position: relative;
  }

  #hitTest {
    width: 100%;
    height: 100%;
  }

  #pet {
    position: absolute;
    background: #000;
    width: 20px;
    height: 20px;
  }
</style>
