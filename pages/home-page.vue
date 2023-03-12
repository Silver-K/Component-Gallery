<script setup lang="ts">
import pic1 from "~/assets/p1.jfif";
import pic2 from "~/assets/p2.jfif";
import pic3 from "~/assets/p3.jfif";
import pic4 from "~/assets/p4.jfif";
import pic5 from "~/assets/p5.jfif";
import pic6 from "~/assets/p6.jfif";
import pic7 from "~/assets/p7.jfif";
import pic8 from "~/assets/item.jpg";

const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8];
const pictures = ref<any[]>(Array(8).fill(undefined));
pictures.value.forEach(
  (item, index) => (pictures.value[index] = images[index])
);
</script>

<template>
  <div class="demo">
    <circle-cards
      :view-height="300"
      :display-length="7"
      :item-width="300"
      :data-list="pictures"
    >
      <template v-slot="{ data }">
        <img class="img" :src="data.item" />
      </template>
    </circle-cards>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  padding-top: 60px;
  padding-left: 60px;
}
.img {
  max-width: 100%;
  max-height: 100%;
}
</style>
