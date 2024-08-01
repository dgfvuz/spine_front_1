<template>
  <div id="allData">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="ageData">年龄统计</el-menu-item>
      <el-menu-item index="genderData">性别统计</el-menu-item>
      <el-menu-item index="RegionData">地区统计</el-menu-item>
    </el-menu>
    <div id="other">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { ref } from "vue";
import router from "@/router";
const activeIndex = ref("1");
const activeIndex2 = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  router.push("/default/data/" + keyPath);
  // zmzhemenanshoua
};
onMounted(() => {
  router.push("/default/data/ageData");
});
</script>
<style>
#allData {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
#other {
  flex: 1;
}
</style>
