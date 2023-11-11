<script setup lang="ts">
interface PropT {
  maxRows?: number | string;
}
const props = withDefaults(defineProps<PropT>(), {
  maxRows: 2,
});

const blockLineHeightCss = ref("0px");
const blockRef = ref();
const getLineHeight = (el?: Element) => {
  if (!blockRef.value) {
    return "0px";
  }
  let target: Element | null = null;
  if (el) {
    target = el;
  } else {
    target = blockRef.value;
  }
  return window.getComputedStyle(target).lineHeight;
};

// suppose can hold first, if cannot , turn to false
const textIsHoldable = ref(true);

const ofRef = ref();
const afterComputeHide = ref(false);
const computeShouldHidden = () => {
  if (ofRef.value) {
    return ofRef.value.clientHeight < ofRef.value.scrollHeight;
  } else {
    return false;
  }
};
const reset = () => {
  afterComputeHide.value = false;
  textIsHoldable.value = true;
};
const compute = () => {
  blockLineHeightCss.value = getLineHeight();
  textIsHoldable.value = !computeShouldHidden();
  afterComputeHide.value = true;
};
const restartCompute = () => {
  reset();
  nextTick(() => {
    compute();
  });
};
watch(() => props.maxRows, restartCompute);
let ob: MutationObserver = null;

onMounted(() => {
  ob = new MutationObserver((entries) => {
    if (entries.length) {
      restartCompute();
    }
  });
  blockLineHeightCss.value = getLineHeight();
  textIsHoldable.value = !computeShouldHidden();

  // nextTick text HTMLElement mounted and then observe it to adapt its content
  nextTick(() => {
    if (ofRef.value) {
      ob.observe(ofRef.value, {
        subtree: true,
        childList: true,
      });
    }
  });

  afterComputeHide.value = true;
});
onBeforeUnmount(() => {
  ob.disconnect();
  ob = null;
});
</script>

<template>
  <div class="of-block" :class="{ 'should-hide': !afterComputeHide }">
    <div ref="blockRef" class="of-main-block">
      <template v-if="textIsHoldable">
        <div
          ref="ofRef"
          :class="[
            {
              'text-overflow': !afterComputeHide,
              'text-overflow-n': !afterComputeHide,
            },
          ]"
        >
          <slot></slot>
          <slot name="suffix"></slot>
        </div>
      </template>
      <template v-else>
        <div ref="ofRef" class="hidden-text text-overflow text-overflow-n">
          <div class="suffix-h float-r clear-both">
            <slot name="suffix"></slot>
          </div>
          <slot></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.of-block {
  --overflow-row: v-bind("props.maxRows");
  --lh: v-bind(blockLineHeightCss);
  --lcount: v-bind("props.maxRows");
}
.of-block {
  word-break: break-all;
  &.should-hide {
    opacity: 0;
  }
}
.of-main-block {
  line-height: calc(1em + 8px);
}

.text-overflow {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.text-overflow-n {
  -webkit-line-clamp: var(--overflow-row);
}

.float-r {
  float: right;
}
.clear-both {
  clear: both;
}
</style>

<style lang="scss" scoped>
.mt-lh {
  margin-top: calc((var(--lcount) - 1) * var(--lh));
}
.hidden-text {
  &::before {
    content: "";
    float: right;
    width: 1px;
    height: calc((var(--lcount) - 1) * var(--lh));
  }
}
.suffix-h {
  max-height: var(--lh);
}
</style>
