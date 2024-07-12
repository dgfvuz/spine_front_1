<template>
    <div id="regionData"></div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted } from 'vue';
  import * as echarts from 'echarts';
  import { ref } from 'vue'
  
  const activeIndex = ref('1')
  const activeIndex2 = ref('1')
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  
  const regionDataOption = {
    title: {
      text: '地区统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      // 在这个配置中，{a}、{b}、{c} 和 {d} 是特殊的变量，分别代表系列名、数据项名称、数据项值和百分比。
      formatter: '表项及数目: {c} <br/>占比: ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    dataset: {
      source: [
        ['Age', 'Count'],
        ['0-10', 10],
        ['11-20', 20],
        ['21-30', 30],
        ['31-40', 40],
        ['41-50', 50],
        ['51-60', 60],
        ['61-70', 70],
        ['71-80', 80],
        ['81-90', 90],
        ['91-100', 100],
      ]
    },
    series: [
      {
        name: 'Age Data',
        type: 'pie',
        radius: '50%',
        label: {
          formatter: '{b}: {d}%'
        },
      }
    ]
  };
  onMounted(() => {
    console.log('mounted');
    const regionData = echarts.init(document.getElementById('regionData'));
    regionData.setOption(regionDataOption);
  });
  </script>


  <style>
   #regionData{
  width: 100%;
  height: 100%;
}
  </style>
  