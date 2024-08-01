<template>
  <div id="genderData"></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import { ref } from "vue";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";

const genderDataOption = ref({
  title: {
    text: "脊柱侧弯性别统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    // 在这个配置中，{a}、{b}、{c} 和 {d} 是特殊的变量，分别代表系列名、数据项名称、数据项值和百分比。
    formatter: "表项及数目: {c} <br/>",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  dataset: {
    source: [
      ["Gender", "Count"],
      ["男", 10],
      ["女", 20],
    ],
  },
  yAxis: {
    type: "category",
  },
  xAxis: {
    type: "value",
  },
  series: [
    {
      name: "性别统计数据",
      type: "bar",
      label: {
        show: true,
        position: "inside",
      },
      itemStyle: {
        color: function (params) {
          var colorlist = ["#32585a", "#00ff77"];
          return colorlist[params.dataIndex % 2];
        },
      },
    },
  ],
});

const fetchData = async () => {
  const source = ref(genderDataOption.value.dataset.source);
  try {
    for (let i = 1; i < genderDataOption.value.dataset.source.length; i++) {
      const gender = genderDataOption.value.dataset.source[i][0];
      if (typeof gender !== "string") {
        continue;
      }
      const res = await axiosInstance.get(`/report/analysis/`, {
        params: {
          gender: gender,
          result: "异常",
        },
      });
      genderDataOption.value.dataset.source[i][1] = res.data.count;
    }
  } catch (e) {
    ElMessage({
      message: "获取性别信息失败",
      type: "error",
    });
  }
  render();
};

const render = () => {
  const genderData = echarts.init(document.getElementById("genderData"));
  genderData.setOption(genderDataOption.value);
};

onMounted(() => {
  fetchData();
});
</script>

<style>
#genderData {
  width: 100%;
  height: 100%;
}
</style>
