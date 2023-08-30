<script setup lang="ts">
import { TouchState } from "~/composables/useTouch";
interface ZoomPropT {
  minScale?: number;
  maxScale?: number;
  scale?: number;
}
const props = withDefaults(defineProps<ZoomPropT>(), {
  minScale: 0.6,
  maxScale: 2,
  scale: 1,
});
interface EmitsT {
  (event: "update:scale", value: number): void;
}
const emits = defineEmits<EmitsT>();

const zoomRef = shallowRef();
const {
  changeX,
  changeY,
  scale,
  changeScale,
  lastOrigin,
  changeOriginX,
  changeOriginY,
  start,
  move,
  currentState,
} = useTouch();
const zeroX = ref(0);
const zeroY = ref(0);
const bounding = {
  min: {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
  },
  max: {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
  },
  x: 0,
  y: 0,
  x1: 0,
  y1: 0,
  centerX: 0,
  centerY: 0,
};

const matrix = ref([1, 0, 0, 1, 0, 0]);
watch(matrix, (m) => {
  emits("update:scale", m[0]);
});
watch(
  () => props.scale,
  (scl) => {
    matrix.value = toScale(matrix.value, scl / matrix.value[0], {
      x: bounding.centerX,
      y: bounding.centerY,
    });
  }
);
const transformStyle = computed(() => `matrix(${matrix.value.join()})`);
watch(transformStyle, (style) => {
  setTransformStyle(style);
});
let setTransformStyle = (style: string) => {};

function limitMatrix(matrix: number[], oldMatrix: number[]) {
  let minBeyond = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
  let maxBeyond = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  const nx = Number((bounding.x * matrix[0] + matrix[4]).toFixed(4));
  const ny = Number((bounding.y * matrix[0] + matrix[5]).toFixed(4));
  if (nx > bounding.min.x) {
    minBeyond.left = true;
  }
  if (nx < bounding.max.x) {
    maxBeyond.left = true;
  }
  if (ny > bounding.min.y) {
    minBeyond.top = true;
  }
  if (ny < bounding.max.y) {
    maxBeyond.top = true;
  }
  const nx1 = Number((bounding.x1 * matrix[0] + matrix[4]).toFixed(4));
  const ny1 = Number((bounding.y1 * matrix[0] + matrix[5]).toFixed(4));
  if (nx1 < bounding.min.x1) {
    minBeyond.right = true;
  }
  if (nx1 > bounding.max.x1) {
    maxBeyond.right = true;
  }
  if (ny1 < bounding.min.y1) {
    minBeyond.bottom = true;
  }
  if (ny1 > bounding.max.y1) {
    maxBeyond.bottom = true;
  }
  if (
    (minBeyond.left && minBeyond.right) ||
    (maxBeyond.left && maxBeyond.right)
  ) {
    matrix[0] = oldMatrix[0];
    matrix[3] = oldMatrix[3];
    matrix[4] = oldMatrix[4];
    matrix[5] = oldMatrix[5];
  } else if (minBeyond.left) {
    matrix[4] = bounding.min.x - bounding.x * matrix[0];
  } else if (minBeyond.right) {
    matrix[4] = bounding.min.x1 - bounding.x1 * matrix[0];
  } else if (maxBeyond.left) {
    matrix[4] = bounding.max.x - bounding.x * matrix[0];
  } else if (maxBeyond.right) {
    matrix[4] = bounding.max.x1 - bounding.x1 * matrix[0];
  }

  if (
    (minBeyond.top && minBeyond.bottom) ||
    (maxBeyond.top && maxBeyond.bottom)
  ) {
    matrix[0] = oldMatrix[0];
    matrix[3] = oldMatrix[3];
    matrix[4] = oldMatrix[4];
    matrix[5] = oldMatrix[5];
  } else if (minBeyond.top) {
    matrix[5] = bounding.min.y - bounding.y * matrix[0];
  } else if (minBeyond.bottom) {
    matrix[5] = bounding.min.y1 - bounding.y1 * matrix[0];
  } else if (maxBeyond.top) {
    matrix[5] = bounding.max.y - bounding.y * matrix[0];
  } else if (maxBeyond.bottom) {
    matrix[5] = bounding.max.y1 - bounding.y1 * matrix[0];
  }
  return matrix.map((item) => Number(item.toFixed(4)));
}
function toScale(
  state: number[],
  value: number,
  origin: { x: number; y: number }
) {
  const s = value;
  const ox = origin.x - zeroX.value;
  const oy = origin.y - zeroY.value;
  const tx = ox - ox * s;
  const ty = oy - oy * s;
  const newMatrix = resolveTransformMatrix(
    matrixTimes(
      makeTransformMatrix([s, 0, 0, s, tx, ty]),
      makeTransformMatrix(state)
    )
  ).map((item) => Number(item.toFixed(4)));
  return limitMatrix(newMatrix, state);
}

let isTouched = false;

function onStart(evt: Event) {
  start(evt);
  isTouched = true;
}
function onMove(evt: Event) {
  if (!isTouched) {
    return;
  }
  move(evt);
  let newMatrix = [...matrix.value];
  if (TouchState.SINGLE === currentState.value) {
    newMatrix[4] += changeX.value[0];
    newMatrix[5] += changeY.value[0];
  } else {
    if (Math.abs(scale.value - 1) < 0.001) {
      // 认为是移动
      newMatrix[4] += changeOriginX.value;
      newMatrix[5] += changeOriginY.value;
    } else {
      // 缩放
      matrix.value = toScale(matrix.value, changeScale.value, lastOrigin.value);
    }
  }
  matrix.value = limitMatrix(newMatrix, matrix.value);
}
function onEnd(evt: Event) {
  isTouched = false;
}
function onWheel(evt: WheelEvent) {
  const { deltaY, clientX, clientY } = evt;
  let scaleNum = 1;
  if (deltaY > 0) {
    scaleNum = 0.99;
  } else {
    scaleNum = 1 / 0.99;
  }

  matrix.value = toScale(matrix.value, scaleNum, { x: clientX, y: clientY });
}

function setCoordinate(el: HTMLElement) {
  const { x, y, width, height } = el.getBoundingClientRect();
  zeroX.value = x;
  zeroY.value = y;
  const centerX = (x + width + x) / 2;
  const centerY = (y + height + y) / 2;
  bounding.centerX = centerX;
  bounding.centerY = centerY;
  bounding.x = x;
  bounding.y = y;
  bounding.x1 = x + width;
  bounding.y1 = y + height;

  bounding.min.x = centerX - (centerX - x) * props.minScale;
  bounding.min.y = centerY - (centerY - y) * props.minScale;
  bounding.min.x1 = (x + width - centerX) * props.minScale + centerX;
  bounding.min.y1 = (y + height - centerY) * props.minScale + centerY;

  bounding.max.x = centerX - (centerX - x) * props.maxScale;
  bounding.max.y = centerY - (centerY - y) * props.maxScale;
  bounding.max.x1 = (x + width - centerX) * props.maxScale + centerX;
  bounding.max.y1 = (y + height - centerY) * props.maxScale + centerY;
}
function bindEventListener(el: HTMLElement) {
  el.addEventListener("touchstart", onStart);
  el.addEventListener("mousedown", onStart);
  el.addEventListener("touchmove", onMove);
  el.addEventListener("mousemove", onMove);
  el.addEventListener("touchend", onEnd);
  el.addEventListener("mouseup", onEnd);
  el.addEventListener("mouseleave", onEnd);
  el.addEventListener("wheel", onWheel);
}
function initScale() {
  matrix.value = toScale(matrix.value, props.scale, {
    x: bounding.centerX,
    y: bounding.centerY,
  });
}
onMounted(() => {
  if (zoomRef.value) {
    const mo = new MutationObserver(() => {
      const child = zoomRef.value.children[0] as HTMLElement;
      child.style.transformOrigin = "0 0";
      setTransformStyle = (style) => {
        child.style.transform = style;
      };
      bindEventListener(child);
      setCoordinate(child);
      initScale();
      mo.disconnect();
    });
    mo.observe(zoomRef.value, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    zoomRef.value.children[0].setAttribute("data-zoom", "true");
  }
});
</script>

<template>
  <div ref="zoomRef" class="the-zoom">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.the-zoom {
  display: inline-flex;
}
</style>
