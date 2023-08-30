<script setup lang="ts">
import { useHistory } from "~~/composables/useHistory";

const pageNum = ref(1);
const { pushState, replaceState, registerHook } = useHistory();
registerHook((state) => {
  const { page } = state;
  pageNum.value = page;
});
const resolvePageNum = (url: string) => {
  const _url = new URL(url);
  const page = _url.searchParams.get("page") || "1";
  return Number(page);
};

onMounted(() => {
  replaceState(
    {
      page: resolvePageNum(window.location.href),
    },
    ""
  );
});
const go = (n: number) => {
  const newUrl = new URL(window.location.href);
  if (n > 0) {
    const temp = pageNum.value + n;
    const newPage = temp > 3 ? 1 : temp;
    newUrl.searchParams.set("page", `${newPage}`);
    pushState(
      {
        page: newPage,
      },
      newUrl.href
    );
  } else if (n !== 0) {
    const temp = pageNum.value + n;
    const newPage = temp < 1 ? 3 : temp;
    newUrl.searchParams.set("page", `${newPage}`);
    pushState(
      {
        page: newPage,
      },
      newUrl.href
    );
  }
};
</script>

<template>
  <div class="view-port">
    <a href="/another-page" @click="jump">/another-page</a>
    <hr />
    <div>页数： {{ pageNum }}</div>
    <div v-show="1 === pageNum" class="page-one">
      <div class="jump" @click="go(1)">去第二页</div>
      <div class="jump disable">上一页</div>
    </div>
    <div v-show="2 === pageNum" class="page-two">
      <div class="jump" @click="go(1)">下一页</div>
      <div class="jump" @click="go(-1)">上一页</div>
    </div>
    <div v-show="3 === pageNum" class="page-three">
      <div class="jump disable">下一页</div>
      <div class="jump" @click="go(-1)">去第二页</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
hr {
  margin-top: 24px;
  margin-bottom: 24px;
}
.view-port {
  padding-top: 160px;
  padding-left: 280px;
  padding-right: 280px;
}
.jump {
  color: blue;
  font-size: 16px;
  line-height: 22px;
  user-select: none;
  &:not(.disable) {
    cursor: pointer;
  }

  &.disable {
    color: grey;
    cursor: default;
  }
}
</style>
