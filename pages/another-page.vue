<script setup lang="ts">
import { useHistory } from "~~/composables/useHistory";

interface ScreenT {
  id: string;
  data: {
    name: string;
  };
}
const screenList = reactive<ScreenT[]>([]);
let id = 0;
const { pushState, replaceState, registerHook } = useHistory();
registerHook((state) => {
  const { screenList: list } = state as { screenList: ScreenT[] };

  list.forEach((e, idx) => {
    screenList[idx] = {
      id: "",
      data: {
        name: "",
      },
    };
    screenList[idx].id = e.id;
    screenList[idx].data = JSON.parse(JSON.stringify(e.data));
  });
  screenList.length = list.length;
});

const addScreen = () => {
  const newUrl = new URL(window.location.href);
  const p = `screen${++id}`;
  console.log(id);
  const name = `screen-${id}`;
  newUrl.searchParams.set(p, name);
  pushState(
    {
      screenList: [
        ...screenList,
        {
          id: p,
          data: {
            name,
          },
        },
      ],
    },
    newUrl.href
  );
};
const closeScreen = (screen: ScreenT) => {
  const newUrl = new URL(window.location.href);
  const p = screen.id;
  newUrl.searchParams.delete(p);
  pushState(
    {
      screenList: screenList.filter((e) => p !== e.id),
    },
    newUrl.href
  );
};
const toMain = (screen: ScreenT) => {
  const newUrl = new URL(window.location.href);
  const p = screen.id;
  newUrl.search = `?${p}=${screen.data.name}`;
  pushState(
    {
      screenList: screenList.filter((e) => p === e.id),
    },
    newUrl.href
  );
};

onMounted(() => {
  const url = new URL(window.location.href);
  const list: ScreenT[] = [];
  url.searchParams.forEach((value, key) => {
    const id = key.replace("screen", "");
    if (isNaN(Number(id))) {
      return;
    }
    list.push({
      id,
      data: {
        name: value,
      },
    });
  });
  if (!list.length) {
    list.push({
      id: "screen1",
      data: {
        name: "screen-1",
      },
    });
    url.searchParams.set("screen1", "screen-1");
  }
  id = list.length;
  replaceState(
    {
      screenList: list,
    },
    url.href
  );
});
</script>

<template>
  <div class="view-port">
    <a href="/home-page" @click="jump">/home-page</a>
    <hr />
    <div>分屏数： {{ screenList.length }}</div>
    <button @click="addScreen">增加分屏</button>
    <hr />
    <div class="screen-wrapper">
      <div
        v-for="(screen, ind) in screenList"
        :key="screen.id"
        class="screen-view"
      >
        <div class="flex-wrap">
          <button v-if="ind > 0" class="screen-btn" @click="toMain(screen)">
            作为主屏
          </button>
          <button class="screen-btn" @click="closeScreen(screen)">
            关闭该屏
          </button>
        </div>

        {{ screen.data.name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.view-port {
  padding-top: 160px;
  padding-left: 280px;
  padding-right: 280px;
}
hr {
  margin-top: 24px;
  margin-bottom: 24px;
}
.screen-wrapper {
  display: flex;
}
.screen-view {
  min-height: 560px;
  padding: 12px;
  flex: 1;
  + .screen-view {
    border-left: 1px solid #000;
  }
  transition: all 0.3s linear;
}
.flex-wrap {
  display: flex;
}
.screen-btn {
  + .screen-btn {
    margin-left: 12px;
  }
}
</style>
