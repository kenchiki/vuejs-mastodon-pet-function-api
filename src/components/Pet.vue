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
import HitTestLines from '@/HitTestLines'
import { getModule } from 'vuex-module-decorators'
import Pet from '@/Pet'
import Account from '@/store/Account'

export default createComponent({
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store
    })
    enum Statuses { Free, Delivery }
    let curStatus: Statuses = Statuses.Free
    const pet: Pet = new Pet(context)

    // 当たり判定の視覚化
    function drawLines () {
      const canvas = document.getElementById('hitTest') as HTMLCanvasElement
      // CSSだけでなく横幅、高さ指定しないと解像度がおかしくなる
      canvas.width = 500
      canvas.height = 400
      const linesWithNormal: Array<Line> = HitTestLines.linesWithNormal()
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

      // ペットの初期化
      pet.init()

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
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: none;

    &:after {
      content: '';
      position: absolute;
      background-image: none;
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      left: -10px;
      top: -10px;
      display: block;
    }

    &.sleep:after {
      background-image: url('../assets/sleep.png');
    }

    &.stroke:after {
      background-image: url('../assets/stroke.png');
    }

    &.hit:after {
      background-image: url('../assets/hit.png');
    }
  }
</style>
