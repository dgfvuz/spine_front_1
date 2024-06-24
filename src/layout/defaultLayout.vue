
<template>
  <div class="default-layout">
    <el-page-header
          class="header"
          @back="handleBack"
          :icon="null"
          >
          <template #title >
              <span class="headerTitle">脊柱侧弯X光系统</span>
          </template>
          <template #content >
              <el-avatar :src="useUserStore().user.avatar"  class="userAvatar"/>
              <span class="userName">{{ useUserStore().user.name }}</span>
            </template>
        </el-page-header>
    <div class="rest-content">
      <div class="menuBody">
        <aside class="menu">
          <MenuView />
        </aside>
        <main class="main">
          <div class="body">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Header from '../components/Header.vue'
import MenuView from '../components/MenuView.vue'
import { RouterView } from 'vue-router';
import router from '@/router'
import { useUserStore } from "@/stores/user";
const handleBack = () => {
  router.pop()
}
</script>
<style scoped>
.headerTitle{
  font-size: 1.5em;
}

.default-layout {
  height: 100vh;
  width: 100vw;
}
.menuBody {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.rest-content {
  height: 92%;
  width: 100%;
}
.menu {
  width: 10%;
  background-color: #ffffff;
}
.main {
  width: 80%;
  flex: 1;
}
.body {
    /* 右侧滚动条 */
  /* 占满父容器 */
  height: 100%;
  padding: 1em;
  width: 100%;
}
.nameAndAvatar{
  display: flex;
  flex-direction: row;
}
.avatarimg{
  height: 50px;
  /* 设置宽度和高度一样大 */
  width: 50px;
  border-radius: 50%;
  /* 靠右 */
  margin-right: 1em;
  object-fit: cover;
}
.content-title{
  height: 100%;
  font-size: 1.5em;
  margin-right: 1em;
  /* 字体竖直居中 */
}
/* 对header_name写样式 */
#header_name{
  margin-right: 1em;
  font-size: 1.5em;
}
.header{
  width: 100%;
  height: 8%;
  padding-right: 1em;
  display: flex;
  justify-content: space-between;
}
.userName{
  font-size: 1em;
  margin-left: 1em;
}
</style>