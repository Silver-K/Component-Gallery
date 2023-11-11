<script setup lang="ts">
const innerContent = ref("");

const lines = [
  ".double-line { word-break: break-all; overflow: hidden; display:",
  "-webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }",
  "两行省略 作者：潇湘羽西 链接：https://juejin.cn/post/7016631393165770759",
  "来源：稀土掘金",
  "著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。",
  "著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。",
];
const i = ref(0);
const n = ref(1);
const displayLines = computed(() => {
  return lines.slice(i.value);
});
const addToContent = () => {
  if (i.value < lines.length) {
    i.value += 1;
  }
};
const revertToList = () => {
  if (i.value > 0) {
    i.value -= 1;
  }
};
watchEffect(() => {
  innerContent.value = lines.slice(0, i.value).join("");
});
const increaseN = () => {
  n.value = n.value + 1;
};
const decreaseN = () => {
  if (n.value > 1) {
    n.value = n.value - 1;
  }
};
</script>

<template>
  <div class="demo">
    <ul>
      <li v-for="(txt, ix) in displayLines" :key="ix">{{ txt }}</li>
    </ul>
    <hr />
    <button @click="addToContent">将上方文字添加到下方</button>
    <button @click="revertToList">将下方文字还原回上方</button>
    <hr />
    <div class="title">含跟随tag的文字隐藏组件：</div>
    <hr />
    <div class="opt">超过{{ n }}行隐藏</div>
    <button @click="increaseN">增加隐藏行数</button>
    <button @click="decreaseN">减少隐藏行数</button>
    <DemoOFBlock :max-rows="n">
      <span>{{ innerContent }}</span>
      <template #suffix>
        <span v-if="innerContent.length" class="tag">这是一个Tag</span>
      </template>
    </DemoOFBlock>
  </div>
</template>

<style lang="scss">
.demo {
  margin-top: 24px;
  margin-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}
hr {
  margin-top: 16px;
  margin-bottom: 16px;
}
button + button {
  margin-left: 8px;
}
.tag {
  background-color: #cf0505;
  padding: 2px;
  margin-left: 8px;
  border-radius: 4px;
  color: white;
}
.title {
  color: #098;
  font-size: 32px;
  line-height: calc(1em + 8px);
  margin-bottom: 12px;
}
</style>
