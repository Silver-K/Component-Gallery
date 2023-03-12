<script lang="ts" setup>
interface CircleCardsPropT {
  displayLength: number;
  dataList: any[];
  itemWidth: number;
  viewHeight: number;
  angle?: number;
  delay?: number;
}

const props = withDefaults(defineProps<CircleCardsPropT>(), {
  angle: 144,
  delay: 2500,
});
const emits = defineEmits(["click"]);
const viewHeightCss = computed(() => `${props.viewHeight}px`);

function angleSin(angle: number) {
  const radian = transAngleToRadian(angle);
  return Math.sin(radian);
}
const angleRatio = 360 / props.angle;
const nSide = (props.displayLength - 1) * angleRatio;
const eachSideAngle = 360 / nSide;
const radius = props.itemWidth / (2 * angleSin(eachSideAngle / 2));
const loopList = props.dataList.concat(
  props.dataList.slice(0, props.displayLength)
);
interface DisplayItemT {
  item: any;
  key: number;
}
const displayList = ref<DisplayItemT[]>(
  loopList.map((item, index) => ({
    item: item,
    key: index,
  }))
);

function transAngleToRadian(angle: number) {
  return (angle / 360) * 2 * Math.PI;
}

function computeTranslateZ() {
  return -1 * radius;
}
function computeRotateY(index: number) {
  const _i = index;
  // return 0;
  return (props.angle / 2 - _i * eachSideAngle).toFixed(2);
}
let shouldTransition = true;
function isInvisible(key: number) {
  return key >= props.displayLength || key < 0;
}
function getStyle(index: number) {
  const transform = `rotateY(${computeRotateY(
    index
  )}deg) translateZ(${computeTranslateZ()}px)`;
  const width = `${props.itemWidth}px`;

  return {
    transform,
    width,
    opacity: isInvisible(index) ? 0 : 1,
    transition: shouldTransition ? "1s" : "none",
  };
}
function computeScrollStyle() {
  return {
    width: `${props.itemWidth}px`,
  };
}
const viewRef = shallowRef();
const cardItemRef = shallowRef<HTMLElement[]>([]);
let counter = props.dataList.length;
let timer: NodeJS.Timer | undefined = undefined;
function animate() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    shouldTransition = true;
    displayList.value.forEach((item) => {
      item.key = item.key - 1;
    });
    counter--;
  }, props.delay);
}
let animationEnd = 0;
function handleTransitionEnd() {
  if (!shouldTransition) {
    return;
  }
  animationEnd++;
  if (animationEnd === displayList.value.length) {
    animationEnd = 0;
    if (counter === 0) {
      displayList.value.forEach((item) => {
        item.key = item.key + props.dataList.length;
      });
      counter = props.dataList.length;
      shouldTransition = false;
    }

    animate();
  }
}
onMounted(() => {
  animate();
});
function handleClick(item: DisplayItemT) {
  emits("click", item);
}
</script>

<template>
  <div class="circle-cards">
    <div ref="viewRef" class="circle-cards__view">
      <ul class="circle-cards__scroll-list" :style="computeScrollStyle()">
        <li
          ref="cardItemRef"
          class="circle-cards__card-item"
          v-for="(item, idx) in displayList"
          :key="idx"
          :style="getStyle(item.key)"
          :class="{ 'event-through': isInvisible(item.key) }"
          @transitionend="handleTransitionEnd"
          @click="handleClick(item)"
        >
          <slot :data="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.circle-cards {
  &__view {
    height: v-bind("viewHeightCss");
  }
  &__scroll-list {
    position: relative;
    height: 100%;
    margin: 0 auto;
    transform-style: preserve-3d;
    perspective: 800px;
    list-style: none;
  }
  &__card-item {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.event-through {
  pointer-events: none;
}
</style>
