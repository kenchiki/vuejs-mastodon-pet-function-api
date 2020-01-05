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
import LinesDrawer from '@/LinesDrawer'
import MouseListener from '@/MouseListener'
import HitTestLines from '@/HitTestLines'
import { getModule } from 'vuex-module-decorators'
import Pet from '@/Pet'
import Account from '@/store/Account'

enum PetStatus { Move, Sleep, Delivery }

export default createComponent({
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store
    })
    const mousePos: Point = { x: 0, y: 0 }
    enum Statuses { Free, Delivery }
    let curStatus: Statuses = Statuses.Free
    let linesWithNormal: Array<Line> = HitTestLines.linesWithNormal()
    const pet: Pet = new Pet()

    // 当たり判定の視覚化
    function drawLines () {
      const canvas = document.getElementById('hitTest') as HTMLCanvasElement
      // CSSだけでなく横幅、高さ指定しないと解像度がおかしくなる
      canvas.width = 500
      canvas.height = 400
      LinesDrawer.drawHitTest(canvas, linesWithNormal)
    }

    function delivery () {
    }

    function interval () {
      switch (curStatus) {
        case Statuses.Free:
          return pet.free()
        case Statuses.Delivery:
          return delivery()
      }
    }

    onMounted(() => {
      // 当たり判定を視覚化
      drawLines()

      // ペットの見た目設定
      pet.setAvatar()

      // マウスの位置を取得
      MouseListener.listenMousePos(document.getElementById('house')!, [document.getElementById('pet')!], mousePos)

      window.setInterval(interval, 20)
    })

    function account (): Account { return getModule(Account, state.store) }
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
    background-size: 100% 100%;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 10px;
  }
</style>
