<template>
  <div id="ageData"></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import axiosInstance from "@/http";
import { ref } from "vue";
import { ElMessage } from "element-plus";

const ageDataOption = ref({
  title: {
    text: "侧弯年龄统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    // 在这个配置中，{a}、{b}、{c} 和 {d} 是特殊的变量，分别代表系列名、数据项名称、数据项值和百分比。
    formatter: "表项及数目: {c} <br/>占比: ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  dataset: {
    source: [
      ["Age", "Count"],
      ["0-10", 10],
      ["11-20", 20],
      ["21-30", 30],
      ["31-40", 40],
      ["41-50", 50],
      ["51-60", 60],
      ["61-70", 70],
      ["71-80", 80],
      ["81-90", 90],
      ["91-100", 100],
    ],
  },
  series: [
    {
      name: "Age Data",
      type: "pie",
      radius: "50%",
      label: {
        formatter: "{b}: {d}%",
      },
    },
  ],
});

const fetchData = async () => {
  const source = ref(ageDataOption.value.dataset.source);
  try {
    for (let i = 1; i < ageDataOption.value.dataset.source.length; i++) {
      const age = ageDataOption.value.dataset.source[i][0];
      if (typeof age !== "string") {
        continue;
      }
      const age1 = age.split("-")[0];
      const age2 = age.split("-")[1];
      const res = await axiosInstance.get(`/report/analysis/`, {
        params: {
          min_age: age1,
          max_age: age2,
          result: "异常",
        },
      });
      ageDataOption.value.dataset.source[i][1] = res.data.count;
    }
  } catch (e) {
    ElMessage({
      message: "获取年龄信息失败",
      type: "error",
    });
  }
  render();
};

const render = () => {
  const ageData = echarts.init(document.getElementById("ageData"));
  ageData.setOption(ageDataOption.value);
};

onMounted(() => {
  fetchData();
});
</script>

<style>
#ageData {
  width: 100%;
  height: 100%;
}
</style>
