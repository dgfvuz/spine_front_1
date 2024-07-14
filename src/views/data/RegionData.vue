<template>
  <div id="regionData"></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
import { ref } from "vue";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";

const activeIndex = ref("1");
const activeIndex2 = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const regions = ref([]);
const regionDataOption = ref({
  title: {
    text: "脊柱侧弯地区统计",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    // 在这个配置中，{a}、{b}、{c} 和 {d} 是特殊的变量，分别代表系列名、数据项名称、数据项值和百分比。
    formatter: "表项及数目: {c}",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  dataset: {
    source: [["Region", "Count"]],
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "地区统计数据",
      type: "bar",
      label: {
        show: true,
        position: "inside",
      },
      itemStyle: {
        color: function (params) {
          var colorlist = [
            "#DA251D",
            "#E67716",
            "#FBC300",
            "#11440f",
            "#32585a",
            "#00ff77",
          ];
          return colorlist[params.dataIndex % 6];
        },
      },
    },
  ],
});

const fetchData = async () => {
  // 先获取所有地区信息;
  try {
    const response = await axiosInstance.get("/patient/region/");
    regions.value = response.data;
  } catch (e) {
    ElMessage({
      message: "获取地区信息失败",
      type: "error",
    });
  }
  // 获取地区统计数据
  try {
    for (let i = 0; i < regions.value.length; i++) {
      const region = regions.value[i]["region"];
      const res = await axiosInstance.get(`/report/analysis/`, {
        params: {
          region: region,
          result: "异常",
        },
      });
      regionDataOption.value.dataset.source.push([region, res.data.count]);
    }
  } catch (e) {
    ElMessage({
      message: "获取地区统计信息失败",
      type: "error",
    });
  }
  render();
};
const render = () => {
  console.log("render");
  const regionData = echarts.init(document.getElementById("regionData"));
  regionData.setOption(regionDataOption.value);
};
onMounted(() => {
  fetchData();
});
</script>

<style>
#regionData {
  width: 100%;
  height: 100%;
}
</style>
