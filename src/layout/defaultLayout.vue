
<template>
<div class="common-layout">
    <el-container>
      <el-container>
        <el-aside width="200px">
          <MenuView/>
        </el-aside>
        <el-container>
          <el-main>
            <RouterView />
          </el-main>
          <el-footer style="text-align: center;">@Copyright: HITSZ-yasiare</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="js" setup>
import MenuView from '../components/MenuView.vue'
import { RouterView } from 'vue-router';
</script>
<style>
.common-layout{
  height: 100%;
  width: 100%;
  background-color: white;
}
.header-text{
    margin-left: 20px;
}
</style>