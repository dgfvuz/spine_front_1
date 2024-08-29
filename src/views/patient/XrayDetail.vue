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
    <el-button type="primary" @click="downloadReportDialog">导出报告</el-button>
  </div>
  <el-dialog v-model="dialogFormVisible" title="请选择报告的类型" width="300">
    <div>
      <el-checkbox
        v-model="downloadReport_summary"
        label="汇总页"
        size="large"
      />
      <el-checkbox
        v-model="downloadReport_detail"
        label="详细页"
        size="large"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadReportComfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
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

const dialogFormVisible = ref(false);
const formLabelWidth = "120px";
const selectedReport = ref(useUserStore().selectedReport);
const patient = ref(null);
const parts = ref(["上胸弯", "胸弯", "胸弯2", "胸腰弯", "腰弯"]);
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
const downloadReport_summary = ref(true);
const downloadReport_detail = ref(true);

type RequestHandler = (img_with_bbox: string) => Promise<string>;

type TextHandler = () => string;

const handlers: { [key: string]: RequestHandler } = {
  冠状面平衡: draw_Cornal_balance,
  csvl: draw_csvl,
  c7pl: draw_c7pl,
  胸1锥体倾斜角: draw_T1_tile_angle,
  顶椎偏距: draw_avt,
  影像学肩高度: draw_rsh,
  锁骨角: draw_clavicle_angle,
  胸廓躯干倾斜: draw_TTS,
};

const text_handlers: { [key: string]: TextHandler } = {
  冠状面平衡: Cornal_balance_text,
  csvl: csvl_text,
  c7pl: c7pl_text,
  胸1锥体倾斜角: T1_tile_angle_text,
  顶椎偏距: avt_text,
  影像学肩高度: rsh_text,
  锁骨角: clavicle_angle_text,
  胸廓躯干倾斜: TTS_text,
};

function Cornal_balance_text(): string {
  // 冠状面平衡:保留两位小数
  // 打印类型

  console.log(typeof selectedReport.value.results["冠状面平衡"]["result"]);
  return `冠状面平衡如图所示:  
    ${selectedReport.value.results["冠状面平衡"]["result"].toFixed(2)}mm
`;
}

function csvl_text(): string {
  // csvl:保留两位小数
  return `csvl如图所示: 
    csvl在整个图像的像素点的x坐标为: ${selectedReport.value.results["csvl"]["result"]}
`;
}

function c7pl_text(): string {
  // c7pl:保留两位小数
  return `c7pl如图所示: 
    c7pl在整个图像的像素点的y坐标为: ${selectedReport.value.results["c7pl"]["result"]}
`;
}

function T1_tile_angle_text(): string {
  // 胸1锥体倾斜角:保留两位小数
  return `胸1锥体倾斜角如图所示:
    ${selectedReport.value.results["胸1锥体倾斜角"]["result"].toFixed(2)}°
`;
}

function avt_text(): string {
  // 顶椎偏距:保留两位小数
  return `顶椎偏距如图所示:
    胸弯AVT: ${selectedReport.value.results["顶椎偏距"]["result"][0].toFixed(
      2
    )}mm, 
    胸腰弯/腰弯AVT: ${selectedReport.value.results["顶椎偏距"][
      "result"
    ][1].toFixed(2)}mm
`;
}

function rsh_text(): string {
  // 影像学肩高度:保留两位小数
  return `影像学肩高度如图所示:
    ${selectedReport.value.results["影像学肩高度"]["result"].toFixed(2)}mm
`;
}

function clavicle_angle_text(): string {
  // 锁骨角:保留两位小数
  return `锁骨角如图所示:
    ${selectedReport.value.results["锁骨角"]["result"].toFixed(2)}°
`;
}

function TTS_text(): string {
  // 胸廓躯干倾斜:保留两位小数
  return `胸廓躯干倾斜如图所示:
    ${selectedReport.value.results["胸廓躯干倾斜"]["result"].toFixed(2)}mm
`;
}

async function draw_TTS(image_with_bbox: string): Promise<string> {
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
        let points = selectedReport.value.results["胸廓躯干倾斜"]["points"][0];
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.moveTo(points[0][0], points[0][1] - 50);
        ctx.lineTo(points[0][0], points[0][1] + 50);
        ctx.moveTo(points[1][0], points[1][1] - 50);
        ctx.lineTo(points[1][0], points[1][1] + 50);
        ctx.moveTo(points[2][0], points[2][1] - 50);
        ctx.lineTo(points[2][0], points[2][1] + 50);
        ctx.moveTo(points[3][0], points[3][1] - 50);
        ctx.lineTo(points[3][0], points[3][1] + 50);
        let topLeftX = points[2][0];
        let topLeftY = points[2][1];
        ctx.font = "30px STKAITI";
        ctx.fillText(
          `TTS${selectedReport.value.results["胸廓躯干倾斜"]["result"]}mm`,
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
function loadHeaderImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // 处理跨域问题
    img.src = url.replace(config.transformedUrl, config.apiBaseUrl);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      }
    };
    img.onerror = (e) => reject(new Error(`Failed to load image: ${url}`));
  });
}

async function draw_clavicle_angle(image_with_bbox: string): Promise<string> {
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
          `锁骨角${selectedReport.value.results["锁骨角"]["result"]}°`,
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
          `胸1锥体倾斜角${selectedReport.value.results["胸1锥体倾斜角"]["result"]}°`,
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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        for (let item of parts.value) {
          if (selectedReport.value.results[item]["result"] !== "正常") {
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
            ctx.stroke();
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
          }
        }
        resolve(canvas.toDataURL("image/jpeg"));
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
  console.log(selectedReport.value);
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
    let header_image = await loadHeaderImage(
      `${config.transformedUrl}/X_ray/reportHeader.JPG`
    );
    // 设置一些常量
    let rate = 0;
    const image = await loadImage(selectedReport.value.X_ray);
    let image_with_bbox = await drawImageBoundingBox(image);

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
    doc.text("患者地区: " + patient.value.region, 10, 55);
    doc.text("患者地址: " + patient.value.address, 110, 55);
    doc.text("报告状态: " + selectedReport.value.status, 110, 45);
    doc.text("报告生成时间: " + patient.value.create_time, 10, 65);
    doc.text("报告审核时间: " + selectedReport.value.update_time, 90, 65);
    doc.line(10, 68, pageWidth - 10, 68);
    if (downloadReport_summary.value) {
      // 这里填充总结内容
      doc.setFontSize(7);
      let drew_image = await drawCobb(image_with_bbox);
      rate = Math.min(200 / image.height, (pageWidth - 80) / image.width);
      for(let item of others.value){
        drew_image = await processOthers(item, drew_image);
      }
      doc.addImage(
        drew_image,
        "JPEG",
        pageWidth - image.width * rate - 25,
        72,
        image.width * rate,
        image.height * rate
      );
      ElMessage.success("成功添加图片");
      let y = 75;
      let num = 0;
      for(let item of parts.value){
        if(selectedReport.value.results[item]["result"] === "正常"){
          continue;
        }
        doc.text(
          `${item}: 
          弯曲方向: ${selectedReport.value.results[item]["result"]}
          cobb角: ${selectedReport.value.results[item]["cobb"]}°
          上端椎: ${selectedReport.value.results[item]["上端椎"]}
          顶椎: ${selectedReport.value.results[item]["顶椎"]}
          下端椎: ${selectedReport.value.results[item]["下端椎"]}
          Nash-Moe旋转: ${selectedReport.value.results[item]["Nash-Moe旋转"]}`,
          20 + num * (pageWidth - image.width * rate - 25 - 20)/2,
          y
        );
        if(num === 0){
          num = 1;
        }else{
          num = 0;
          y += 20;
        }
        ElMessage.success("成功添加报告内容");
      }
      if (num === 1) {
        y += 20;
      }
      // 画一个分割线
      // 添加其他内容, others的text内容
      for(let item of others.value){
        doc.text(text_handlers[item](), 20, y + 5);
        y += 10;
      }
    }

    if (downloadReport_detail.value) {
      if (downloadReport_summary.value) {
        doc.addPage();
        doc.addImage(header_image, "JPEG", 50, 10, 110, 19);
        doc.setFontSize(18);
        doc.text(title, titleX, 34);
        doc.line(10, 40, pageWidth - 10, 40);
        doc.setFontSize(12);
        doc.text(`患者姓名: ${selectedReport.value.patient_name}`, 10, 45);
        doc.text("性别: " + patient.value.gender, 50, 45);
        doc.text("年龄: " + patient.value.age, 80, 45);
        doc.text("患者地区: " + patient.value.region, 10, 55);
        doc.text("患者地址: " + patient.value.address, 110, 55);
        doc.text("报告状态: " + selectedReport.value.status, 110, 45);
        doc.text("报告生成时间: " + patient.value.create_time, 10, 65);
        doc.text("报告审核时间: " + selectedReport.value.update_time, 90, 65);
        doc.line(10, 68, pageWidth - 10, 68);
      }
      // 添加报告内容
      doc.setFontSize(14);
      let y = 75;
      for (let item of parts.value) {
        if (selectedReport.value.results[item]["result"] === "正常") {
          continue;
        }
        doc.text(
          `${item}: 
          弯曲方向: ${selectedReport.value.results[item]["result"]}
          cobb角: ${selectedReport.value.results[item]["cobb"]}°
          上端椎: ${selectedReport.value.results[item]["上端椎"]}
          顶椎: ${selectedReport.value.results[item]["顶椎"]}
          下端椎: ${selectedReport.value.results[item]["下端椎"]}
          Nash-Moe旋转: ${selectedReport.value.results[item]["Nash-Moe旋转"]}`,
          10,
          y
        );
        y += 40;
        ElMessage.success("成功添加报告内容");
        rate = Math.min(200 / image.height, (pageWidth - 80) / image.width);
        let image_with_cobb = await drawCobb(image_with_bbox);
        doc.addImage(
          image_with_cobb,
          "JPEG",
          pageWidth - image.width * rate - 25,
          75,
          image.width * rate,
          image.height * rate
        );
        ElMessage.success("成功添加图片");
      }
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
        doc.text(text_handlers[list[i]](), 10, 45);
        rate = Math.min(230 / image.height, (pageWidth - 20) / image.width);
        let img = await processOthers(list[i], image_with_bbox);
        doc.addImage(
          img,
          "JPEG",
          pageWidth - image.width * rate - 25,
          45,
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
      ElMessage.success("成功添加页码");
    }
    // 保存PDF
    doc.save(`${selectedReport.value.patient_name}-X光检测报告.pdf`);
    ElMessage.success("导出报告成功");
    loading.close();
  } catch (error) {
    console.error(error);
    loading.close();
    ElMessage.error("导出报告失败");
  }
};
const downloadReportDialog = () => {
  dialogFormVisible.value = true;
};
const downloadReportComfirm = () => {
  dialogFormVisible.value = false;
  downloadReport();
};
</script>
<style>
.xray-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
