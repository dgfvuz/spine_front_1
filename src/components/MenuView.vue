<template>
      <el-menu class="verticalMenu">
        <el-sub-menu v-for="item in menuData" :index="item.name" class="fatherMenu">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="subItem in item.children" :index="subItem.name" @click="handleClick(item,subItem)" class="sonMenu">
            {{ subItem.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
  </template>
  
  <script lang="ts" setup>
  import router from '@/router'
  import {onMounted} from 'vue'
  import { ref } from 'vue'
  import { useUserStore } from "@/stores/user";
  const menuData = ref(router.options.routes.filter(route => (route.meta.isAdmin === useUserStore().user.is_superuser)&&(route.path !== '/login')&& (route.path !== '/register')&& (route.path !== '/')))
  // 在加载页面的时候执行的函数
  const subMenuVisibility = ref({})
  const toggleSubMenu = (path) => {
    subMenuVisibility.value[path] = !subMenuVisibility.value[path]
  }
  const isSubMenuVisible = (path) => {
    return subMenuVisibility.value[path]
  }
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
  .verticalMenu {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .fatherMenu {
    width: 100%;
  }
  .sonMenu {
    width: 100%;
  }

  </style>