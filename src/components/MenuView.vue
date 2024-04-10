<template>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
        <el-sub-menu v-for="item in menuData" :key="item.path" :index="item.name" class="el-submenu-demo">
          <template #title>
              <!-- <el-icon><location /></el-icon> -->
              <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.name" @click="handleClick(item,subItem)" class="el-menuItem-demo">
            <span>{{ subItem.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        </el-menu>
  </template>
  
  <script lang="js" setup>
  import router from '@/router'
  import {onMounted} from 'vue'
  import { ref } from 'vue'
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
  } from '@element-plus/icons-vue'
  const menuData = ref(router.options.routes.filter(route => (route.path !== '/login')&& (route.path !== '/register')&& (route.path !== '/')))
  // 在加载页面的时候执行的函数
  onMounted(() => {
    //console.log(menuData)
    // 递归生成菜单
  })
  const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath)
  }
  const handleClose = (key, keyPath) => {
    // console.log(key, keyPath)
  }
  const handleClick = (item,subItem) => {
    router.push(item.path + '/'+subItem.path)
  }
  </script>
  <style>
  .el-menu-vertical-demo{
    height: 100%;
  }
  </style>