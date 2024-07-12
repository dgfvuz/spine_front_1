<!-- <template>
  <div class="guide">

    <div id="pdf-render"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getDocument } from 'pdfjs-dist'; // 导入 pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist'

// 设置 pdf.worker.js 路径

pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.mjs'
const pdfUrl = '/test.pdf';
const zoomLevel = ref(1.5); // 初始缩放级别


const zoomIn = async() => {
  zoomLevel.value += 0.1;
  console.log(zoomLevel.value);
  await renderPdfPage(); // 重新渲染 PDF 页面以应用新的缩放级别
};

const zoomOut = async() => {
  zoomLevel.value -= 0.1;
  await renderPdfPage(); // 重新渲染 PDF 页面以应用新的缩放级别
};

// 将渲染逻辑封装为函数以便重用
const renderPdfPage = async() => {
  console.log('zoomLevel', zoomLevel.value);
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  console.log(pdf);
  console.log('numPages', pdf.numPages);
  const numPages = pdf.numPages;
  // 清空之前的 canvas
  document.getElementById('pdf-render').innerHTML = '';

  for(let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber); // 获取当前页
    const viewport = page.getViewport({ scale: zoomLevel.value }); // 计算视口
    
    // 创建 canvas 元素并设置尺寸
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    // 将 canvas 添加到 DOM 中
    document.getElementById('pdf-render').appendChild(canvas);
    
    // 渲染页面
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

  }

}
renderPdfPage();
</script>

<style scoped>
.guide {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
}
#gpdf-render {
  display: flex;
  justify-content: center;
  
}


</style> -->



<template>
  <div class="about">
    <h1>帮助</h1>
  </div>
</template>

<style>
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

</style>
