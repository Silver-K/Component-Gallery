<script lang="ts" setup>
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import "swiper/css";

function handleClick() {
  // swiper.value.slideNext();
}
</script>

<template>
  <div class="circle-cards">
    <swiper direction="horizontal">
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
    </swiper>
    <button @click="handleClick">next</button>
  </div>
</template>

<style lang="scss">
.swiper-wrapper {
  transform-style: preserve-3d;
  perspective: 1800px;
  height: 300px;
}
.swiper-slide {
  width: 300px !important;
  &:nth-child(1) {
    transform: rotateY(60deg) translateZ(-200px);
  }
  &:nth-child(2) {
    transform: rotateY(0deg) translateZ(-200px);
  }
  &:nth-child(3) {
    transform: rotateY(-60deg) translateZ(-200px);
  }
}
.circle-cards__scroll-list {
  // position: relative;
  // height: 300px;
  // margin: 0 auto;
  // transform-style: preserve-3d;
  // perspective: 1800px;
  // list-style: none;
}
.circle-cards__card-item {
  // position: absolute;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // cursor: grab;

  // &:nth-child(1) {
  //   transform: rotateY(60deg) translateZ(-200px);
  // }
  // &:nth-child(2) {
  //   transform: rotateY(0deg) translateZ(-200px);
  // }
  // &:nth-child(3) {
  //   transform: rotateY(-60deg) translateZ(-200px);
  // }
}
.circle-cards__card-item:active {
  cursor: grabbing;
}

.event-through {
  pointer-events: none;
}
</style>
