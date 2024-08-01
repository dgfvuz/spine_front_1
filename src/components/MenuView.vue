<template>
      <el-menu class="verticalMenu">
          <el-menu-item v-for="subItem in menuData " 
          :index="subItem.name" @click="handleClick(subItem)">
            {{ subItem.name }}
          </el-menu-item>
      </el-menu>
  </template>
  
  <script lang="ts" setup>
  import router from '@/router'
  import {onMounted} from 'vue'
  import { ref } from 'vue'
  import { useUserStore } from "@/stores/user";
  const menuData = ref(router.options.routes.filter(route => (route.path === '/default'))[0].children.filter(subItem => (subItem.meta.isAdmin === useUserStore().user.is_superuser) && subItem.meta.showMenu))
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
  const handleClick = (subItem: any) => {
    router.push('/default/'+subItem.path)
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