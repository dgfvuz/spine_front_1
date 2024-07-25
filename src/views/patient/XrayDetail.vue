<template>
  <div class="xray-detail">
    <el-image
      style="width: 100px; height: 100px"
      :src="
        config.replace
          ? selectedReport.X_ray.replace(
              config.transformedUrl,
              config.apiBaseUrl
            )
          : selectedReport.X_ray
      "
      fit="contain"
    />
    <p>患者名称: {{ selectedReport.patient_name }}</p>
    <div>
      <span>报告结果:</span>
      <el-input v-model="selectedReport.result"></el-input>
      <div v-for="key in parts">
        <span>{{ key }}</span>
        <el-input v-model="selectedReport.results[key]['cobb']"></el-input>
      </div>
      <div v-for="key in others">
        <span>{{ key }}</span>
        <el-input v-model="selectedReport.results[key]['result']"></el-input>
      </div>
    </div>
    <p>报告状态: {{ selectedReport.status }}</p>
    <p>更新时间: {{ selectedReport.update_time }}</p>
    <el-button type="primary" @click="handleUpdate">更新</el-button>
    <el-button type="primary" @click="downloadReport">导出报告</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import axiosInstance from "@/http";
import { ElMessage } from "element-plus";
import jsPDF from "jspdf";
import "jspdf-autotable";
import config from "@/config";
import { ElLoading } from "element-plus";

const selectedReport = ref(useUserStore().selectedReport);
const patient = ref(null);
const parts = ref(["颈胸弯", "上胸弯", "胸弯", "胸弯2", "胸腰弯", "腰弯"]);
const others = ref([
  "冠状面平衡",
  "锁骨角",
  "csvl",
  "c7pl",
  "顶椎偏距",
  "胸廓躯干倾斜",
  "影像学肩高度",
  "胸1锥体倾斜角",
]);

type RequestHandler = (img_with_bbox: string) => Promise<string>;

const handlers: { [key: string]: RequestHandler } = {
  冠状面平衡: draw_Cornal_balance,
  csvl: draw_csvl,
  c7pl: draw_c7pl,
  胸1锥体倾斜角: draw_T1_tile_angle,
  顶椎偏距: draw_avt,
  影像学肩高度: draw_rsh,
  锁骨角: draw_clavicle_angle,
};

async function processOthers(
  resultType: string,
  img_with_bbox: string
): Promise<string> {
  if (handlers[resultType]) {
    return handlers[resultType](img_with_bbox);
  }
  return img_with_bbox;
}
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // 处理跨域问题
    if (config.replace) {
      img.src = url.replace(config.transformedUrl, config.apiBaseUrl);
    } else {
      img.src = url;
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${url}`));
  });
}


async function draw_clavicle_angle(image_with_bbox:string):Promise<string>{
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image_with_bbox;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        let points = selectedReport.value.results["锁骨角"]["points"];
        let y = Math.max(points[0][1], points[1][1]);
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.moveTo(points[0][0], y);
        ctx.lineTo(points[1][0], y);
        let topLeftX = points[0][0];
        let topLeftY = points[0][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `锁骨角${selectedReport.value.results["锁骨角"]["result"]}度`,
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${image_with_bbox}`));
  });
};


async function draw_rsh(image_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image_with_bbox;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        let points = selectedReport.value.results["影像学肩高度"]["points"];
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[1][0], points[2][1]);
        ctx.moveTo(points[1][0], points[1][1]);
        ctx.lineTo(points[3][0], points[3][1]);
        ctx.lineTo(points[0][0], points[3][1]);
        let topLeftX = points[0][0];
        let topLeftY = points[0][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `影像学肩高度${selectedReport.value.results["影像学肩高度"]["result"]}mm`,
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${image_with_bbox}`));
  });
}

async function draw_T1_tile_angle(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = img_with_bbox;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        let horizontal_x: number, horizontal_y: number;
        if (
          selectedReport.value.results["胸1锥体倾斜角"]["points"][0][1] >
          selectedReport.value.results["胸1锥体倾斜角"]["points"][1][1]
        ) {
          horizontal_x =
            selectedReport.value.results["胸1锥体倾斜角"]["points"][0][0];
          horizontal_y =
            selectedReport.value.results["胸1锥体倾斜角"]["points"][0][1];
        } else {
          horizontal_x =
            selectedReport.value.results["胸1锥体倾斜角"]["points"][1][0];
          horizontal_y =
            selectedReport.value.results["胸1锥体倾斜角"]["points"][1][1];
        }
        ctx.moveTo(horizontal_x - 50, horizontal_y);
        ctx.lineTo(horizontal_x + 50, horizontal_y);
        ctx.moveTo(
          selectedReport.value.results["胸1锥体倾斜角"]["points"][0][0],
          selectedReport.value.results["胸1锥体倾斜角"]["points"][0][1]
        );
        ctx.lineTo(
          selectedReport.value.results["胸1锥体倾斜角"]["points"][1][0],
          selectedReport.value.results["胸1锥体倾斜角"]["points"][1][1]
        );
        let topLeftX =
          selectedReport.value.results["胸1锥体倾斜角"]["points"][0][0];
        let topLeftY =
          selectedReport.value.results["胸1锥体倾斜角"]["points"][0][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `胸1锥体倾斜角${selectedReport.value.results["胸1锥体倾斜角"]["result"]}度`,
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}

async function draw_avt(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = img_with_bbox;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(
          selectedReport.value.results["顶椎偏距"]["points"][2][0],
          selectedReport.value.results["顶椎偏距"]["points"][2][1]
        );
        ctx.lineTo(
          selectedReport.value.results["顶椎偏距"]["points"][2][0],
          selectedReport.value.results["顶椎偏距"]["points"][3][1]
        );
        ctx.moveTo(
          selectedReport.value.results["顶椎偏距"]["points"][3][0],
          selectedReport.value.results["顶椎偏距"]["points"][3][1]
        );
        ctx.lineTo(
          selectedReport.value.results["顶椎偏距"]["points"][3][0],
          selectedReport.value.results["顶椎偏距"]["points"][2][1]
        );
        ctx.moveTo(
          selectedReport.value.results["顶椎偏距"]["points"][0][0],
          selectedReport.value.results["顶椎偏距"]["points"][0][1]
        );
        ctx.lineTo(
          selectedReport.value.results["顶椎偏距"]["points"][3][0],
          selectedReport.value.results["顶椎偏距"]["points"][0][1]
        );
        let topLeftX = selectedReport.value.results["顶椎偏距"]["points"][0][0];
        let topLeftY = selectedReport.value.results["顶椎偏距"]["points"][0][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `顶椎偏距 胸部顶椎${selectedReport.value.results["顶椎偏距"]["result"][0]}`,
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.moveTo(
          selectedReport.value.results["顶椎偏距"]["points"][1][0],
          selectedReport.value.results["顶椎偏距"]["points"][1][1]
        );
        ctx.lineTo(
          selectedReport.value.results["顶椎偏距"]["points"][2][0],
          selectedReport.value.results["顶椎偏距"]["points"][1][1]
        );
        topLeftX = selectedReport.value.results["顶椎偏距"]["points"][1][0];
        topLeftY = selectedReport.value.results["顶椎偏距"]["points"][1][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `顶椎偏距 腰部顶椎${selectedReport.value.results["顶椎偏距"]["result"][1]}`,
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.stroke();
      }
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}
async function draw_csvl(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = img_with_bbox;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(
          selectedReport.value.results["csvl"]["points"][2][0],
          selectedReport.value.results["csvl"]["points"][2][1]
        );
        ctx.lineTo(selectedReport.value.results["csvl"]["points"][2][0], 200);
        let topLeftX = selectedReport.value.results["csvl"]["points"][2][0];
        let topLeftY = 200;
        ctx.font = "30px STKAITI";
        ctx.fillText("csvl参考线", topLeftX + 5, topLeftY + 20);
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}

async function draw_c7pl(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = img_with_bbox;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(
          selectedReport.value.results["c7pl"]["points"][0][0],
          selectedReport.value.results["c7pl"]["points"][0][1]
        );
        ctx.lineTo(selectedReport.value.results["c7pl"]["points"][0][0], 200);
        ctx.lineTo(
          selectedReport.value.results["c7pl"]["points"][0][0],
          img.height - 200
        );
        let topLeftX = selectedReport.value.results["c7pl"]["points"][0][0];
        let topLeftY = 200;
        ctx.font = "30px STKAITI";
        ctx.fillText("c7pl参考线", topLeftX + 5, topLeftY + 20);
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}

async function draw_Cornal_balance(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = img_with_bbox;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(
          selectedReport.value.results["冠状面平衡"]["points"][0][0],
          selectedReport.value.results["冠状面平衡"]["points"][0][1]
        );
        ctx.lineTo(
          selectedReport.value.results["冠状面平衡"]["points"][0][0],
          selectedReport.value.results["冠状面平衡"]["points"][1][1]
        );
        ctx.moveTo(
          selectedReport.value.results["冠状面平衡"]["points"][1][0],
          selectedReport.value.results["冠状面平衡"]["points"][1][1]
        );
        ctx.lineTo(
          selectedReport.value.results["冠状面平衡"]["points"][1][0],
          selectedReport.value.results["冠状面平衡"]["points"][0][1]
        );
        let topLeftX =
          selectedReport.value.results["冠状面平衡"]["points"][0][0];
        let topLeftY =
          (selectedReport.value.results["冠状面平衡"]["points"][0][1] +
            selectedReport.value.results["冠状面平衡"]["points"][1][1]) /
          2;
        ctx.font = "30px STKAITI";
        ctx.fillText(
          "冠状面平衡: " + selectedReport.value.results["冠状面平衡"]["result"],
          topLeftX + 5,
          topLeftY + 20
        );
        ctx.stroke();
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}

async function drawCobb(img_with_bbox: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = img_with_bbox;
    img.onload = () => {
      for (let item of parts.value) {
        if (selectedReport.value.results[item]["result"] !== "正常") {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "red";
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(
              selectedReport.value.results[item]["points"][0][0][0],
              selectedReport.value.results[item]["points"][0][0][1]
            );
            ctx.lineTo(
              selectedReport.value.results[item]["points"][0][1][0],
              selectedReport.value.results[item]["points"][0][1][1]
            );
            ctx.lineTo(
              selectedReport.value.results[item]["points"][0][2][0],
              selectedReport.value.results[item]["points"][0][2][1]
            );
            ctx.moveTo(
              selectedReport.value.results[item]["points"][0][0][0],
              selectedReport.value.results[item]["points"][0][0][1]
            );
            ctx.lineTo(
              selectedReport.value.results[item]["points"][0][3][0],
              selectedReport.value.results[item]["points"][0][3][1]
            );
            ctx.lineTo(
              selectedReport.value.results[item]["points"][0][0][0],
              selectedReport.value.results[item]["points"][0][0][1]
            );
            // 在selectedReport.value.results[item]["points"][0][0][0],selectedReport.value.results[item]["points"][0][0][1] 处添加文本
            let topLeftX =
              selectedReport.value.results[item]["points"][0][1][0];
            let topLeftY =
              selectedReport.value.results[item]["points"][0][1][1];
            ctx.font = "30px STKAITI";
            ctx.fillText(
              item + " " + selectedReport.value.results[item]["cobb"],
              topLeftX + 5,
              topLeftY + 20
            );
            ctx.stroke();
          }
          resolve(canvas.toDataURL("image/jpeg"));
        }
      }
    };
    img.onerror = (e) =>
      reject(new Error(`Failed to load image: ${img_with_bbox}`));
  });
}

const fetchPatient = async () => {
  try {
    const res = await axiosInstance.get(
      "/patient/detail/" + selectedReport.value.patient + "/"
    );
    patient.value = res.data;
    console.log(patient.value);
  } catch (error) {
    ElMessage.error("获取患者信息失败");
  }
};
fetchPatient();

const handleUpdate = async () => {
  try {
    selectedReport.value.status = "已审核";
    await axiosInstance.patch(
      "/report/detail/" + selectedReport.value.id + "/",
      {
        results: selectedReport.value.results,
        status: "已审核",
      }
    );
    ElMessage.success("更新成功");
  } catch (error) {
    ElMessage.error("更新失败");
  }
};

async function drawImageBoundingBox(img: HTMLImageElement): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    if (ctx) {
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.beginPath();
      for (const key in selectedReport.value.results.bone_box) {
        for (let i = 1; i <= 4; i++) {
          ctx.moveTo(
            selectedReport.value.results.bone_box[key][i - 1][0],
            selectedReport.value.results.bone_box[key][i - 1][1]
          );
          ctx.lineTo(
            selectedReport.value.results.bone_box[key][i % 4][0],
            selectedReport.value.results.bone_box[key][i % 4][1]
          );
        }
        // 在这里添加绘制文本的代码
        // 获取左上角的点的坐标
        let topLeftX = selectedReport.value.results.bone_box[key][0][0];
        let topLeftY = selectedReport.value.results.bone_box[key][0][1];
        // 设置文本样式
        ctx.font = "20px STKAITI";
        // 调整文本位置，以避免与矩形边框重叠
        ctx.fillText(key, topLeftX + 5, topLeftY - 5);
      }
      ctx.stroke();
    }
    return canvas.toDataURL("image/jpeg"); // 返回 Base64 编码的图片数据
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const downloadReport = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    console.log("download report");
    // 创建PDF文档实例
    const doc = new jsPDF();

    // 添加标题
    doc.setFont("STKAITI");
    ElMessage.success("成功使用setFont");
    // 页面宽度
    const pageWidth = doc.internal.pageSize.getWidth();
    // 添加图片并居中
    let header_image = await loadImage(`${config.transformedUrl}/X_ray/reportHeader.JPG`);
    doc.addImage(header_image, "JPEG", 50, 10, 110, 19);
    ElMessage.success("成功添加图片Header");

    // 空出一个图片大小
    // 添加标题并居中对齐
    const title = "医学映像科数字化X线诊断报告书";
    doc.setFontSize(18);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2; // 计算居中对齐的X坐标
    doc.text(title, titleX, 34);

    // 添加一条分割线
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 40, pageWidth - 10, 40);

    // 添加患者信息
    doc.setFontSize(12);
    doc.text(`患者姓名: ${selectedReport.value.patient_name}`, 10, 45);
    doc.text("性别: " + patient.value.gender, 50, 45);
    doc.text("年龄: " + patient.value.age, 80, 45);
    doc.text("报告生成时间: " + patient.value.create_time, 10, 55);
    doc.text("报告审核时间: " + selectedReport.value.update_time, 10, 65);
    doc.line(10, 68, pageWidth - 10, 68);

    doc.setFontSize(14);
    // 添加报告内容
    doc.text(
      `报告结果: ${selectedReport.value.result}
详细结果:
    颈胸弯  Cobb角: ${selectedReport.value.results["颈胸弯"]["cobb"]}度 
    上胸弯  Cobb角: ${selectedReport.value.results["上胸弯"]["cobb"]}度 
    胸弯    Cobb角: ${selectedReport.value.results["胸弯"]["cobb"]}度 
    胸弯2   Cobb角: ${selectedReport.value.results["胸弯2"]["cobb"]}度 
    胸腰弯  Cobb角: ${selectedReport.value.results["胸腰弯"]["cobb"]}度 
    腰弯    Cobb角: ${selectedReport.value.results["腰弯"]["cobb"]}度
    `,
      10,
      75
    );
    ElMessage.success("成功添加报告内容");
    const image = await loadImage(selectedReport.value.X_ray);
    let rate = Math.min(200 / image.height, (pageWidth - 80) / image.width);
    let image_with_bbox = await drawImageBoundingBox(image);
    let image_with_cobb = await drawCobb(image_with_bbox);
    doc.addImage(
      image_with_cobb,
      "JPEG",
      70,
      75,
      image.width * rate,
      image.height * rate
    );
    ElMessage.success("成功添加图片");
    // 冠状面平衡: ${selectedReport.value.results["冠状面平衡"]["result"]}
    // 锁骨角: ${selectedReport.value.results["锁骨角"]["result"]}
    // csvl: ${selectedReport.value.results["csvl"]["result"]}
    // c7vl: ${selectedReport.value.results["c7pl"]["result"]}
    // 顶椎偏距: ${selectedReport.value.results["顶椎偏距"]["result"]}
    // 胸廓躯干倾斜: ${selectedReport.value.results["胸廓躯干倾斜"]["result"]}
    // 影像学肩高度: ${selectedReport.value.results["影像学肩高度"]["result"]}
    // 胸1锥体倾斜角: ${selectedReport.value.results["胸1锥体倾斜角"]["result"]}
    // 添加一条分割线
    // 添加一个图片
    const list = [
      "冠状面平衡",
      "锁骨角",
      "csvl",
      "c7pl",
      "顶椎偏距",
      "胸廓躯干倾斜",
      "影像学肩高度",
      "胸1锥体倾斜角",
    ];
    for (let i = 0; i < list.length; i++) {
      doc.addPage();
      doc.addImage(header_image, "JPEG", 50, 10, 110, 19);
      doc.setFontSize(18);
      doc.text(title, titleX, 34);
      doc.line(10, 40, pageWidth - 10, 40);
      doc.setFontSize(12);
      doc.text(
        `${list[i]}: ${selectedReport.value.results[list[i]]["result"]}`,
        10,
        45
      );
      rate = Math.min(230 / image.height, (pageWidth - 20) / image.width);
      let img = await processOthers(list[i], image_with_bbox);
      doc.addImage(
        img,
        "JPEG",
        pageWidth / 2 - (image.width * rate) / 2,
        50,
        image.width * rate,
        image.height * rate
      );
    }

    // 添加页码
    const totalPagesExp = "{total_pages_count_string}";
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.line(10, 285, pageWidth - 10, 285);
      doc.text(`Page ${i} of ${totalPagesExp}`, 10, 290);
    }
    doc.putTotalPages(totalPagesExp);

    // 保存PDF
    ElMessage.success("成功添加页码");
    doc.save("medical-report.pdf");
    ElMessage.success("导出报告成功");
    loading.close();
  } catch (error) {
    loading.close();
    ElMessage.error("导出报告失败");
  }
};
</script>
<style>
.xray-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
