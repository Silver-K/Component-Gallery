<script setup lang="ts">
import { TagResolved } from "~/utils";
definePageMeta({
  layout: "provide",
});

const getHtml = () => {
  return new Promise<string>((res) => {
    globalThis.setTimeout(() => {
      res(
        `<div class="flex">
          <div class="placeholder-v">占位</div>
          <div class="placeholder-v">占位</div>
          <div class="placeholder-v">占位</div>
          <div class="placeholder-v">占位</div>
          <div class="placeholder-v">占位</div>
          <a href="https://gitee.com/ascend/pytorch/releases/download/v5.0.rc3-pytorch2.0.1/torch_npu-2.0.1-cp38-cp38-linux_aarch64.whl">下载地址</a>
          <a href="https://gitee.com/ascend/pytorch/releases/tag/v5.0.rc3-pytorch2.0.1">gitee下载中心</a>
          <a href="https://gitee.com/ascend/pytorch/blob/master/cmake/Torch_npuConfig.cmake.in">Torch_npuConfig.cmake.in</a>
        </div>`
      );
    }, 120);
  });
};
const htmlResolved = ref("");
const scrollerRef = ref<HTMLElement | null>(null);
const arcRef = ref<HTMLElement | null>(null);
let ob: IntersectionObserver | null = null;
onMounted(async () => {
  const html = await getHtml();
  htmlResolved.value = await resolveHtml(html, async (tag: TagResolved) => {
    if ("a" === tag.token) {
      // 设置lazy标记
      tag.attrs["lazy-download"] = tag.attrs.href as string;
    }
  });
  ob = new IntersectionObserver(
    (entries) => {
      console.log("intersection trigger", entries);
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const url = el.getAttribute("lazy-download");
          if (url) {
            const canDownload = await isDownloadable(url);
            if (canDownload) {
              el.setAttribute("able-to-download", "true");
            }
            el.removeAttribute("lazy-download");
            ob?.unobserve(el);
          }
        }
      });
    },
    {
      root: scrollerRef.value,
      rootMargin: "0px 0px 400px 0px",
    }
  );
});
watch(htmlResolved, (h) => {
  nextTick(() => {
    if (h && arcRef.value) {
      Array.from(arcRef.value.querySelectorAll("[lazy-download]")).forEach(
        (el) => {
          if (ob) {
            ob.observe(el);
          }
        }
      );
    }
  });
});
</script>

<template>
  <div>
    <div ref="scrollerRef" class="scroller">
      <div class="scroller-wrapper">
        <div ref="arcRef" v-html="htmlResolved"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.flex {
  display: flex;
  flex-direction: column;
}
.scroller {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
}
.placeholder-v {
  height: 200px;
  border-bottom: 1px solid #000;
}
a[able-to-download] {
  color: red;
}
</style>
