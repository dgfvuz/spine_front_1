# spine_front_1

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### 关于跨域
在开发环境下，更改src/config.js的 apiBaseUrl: '/api',
在打包成为应用的情况下，更改src/config.js的 apiBaseUrl: 'http://localhost:8000',这里的localhost:8000应该是后端的ip和端口

### 关于build
npm run build 作为vue的打包
npm run electron:build 作为electron的打包
在进行electron:build 的打包时注意:   
        1. 需要将electron/main.js 的 let env = 'pro1' 只要不是'pro'就可以了
        2. 在打包成为应用程序时应该将src/config.js中  apiBaseUrl: "/api",改为  apiBaseUrl: "http://{后端的ip}:{后端的端口}" 例如: "http://192.168.2.1:8000"
        3. src/config.js中 transformedUrl : "http://localhost:8000", 也应该改为 "http://{ip}:{port}" 例如： "http://192.168.2.1:8000"
        4. src/config.js中 replace:true, 应该改为false  


### 关于功能列表
user(已完成)  主要完成用户登录,token,鉴权等功能

patient(已完成)  主要完成病人管理的功能

report(已完成)  主要完成报告生成的功能(这也是系统的主要功能)

collect(已完成)  收藏功能, 使得用户能够收藏患者

advice(已完成)  建议功能, 使得用户能够向系统开发这提供建议, 管理员能够查看所有建议

患者时间轴(未完成) 详情请见需求报告书

数据统计功能(完成) 完成年龄,性别,地区的统计功能

报告审核功能(粗略完成) 仅仅能对结果修改, 我希望做的是能够让用户标出点来(因为算法标记点的时候会有误差), 然后程序自动计算修改

报告导出功能(完成) 能够导出报告, 将指标可视化

患者批量excel导出(未完成) 能够将患者的检测结果批量导出到excel文件中

### 没有要求但是想做的内容
数据标记功能(未完成) 让用户能够为数据做标记, 可以用于后端数据集生成和模型训练


### 说明
上述完成的功能还需与甲方交流优化