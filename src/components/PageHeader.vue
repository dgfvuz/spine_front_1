<template>
    <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content ep-bg-purple" />
        <el-image  :src="'https://mail.hit.edu.cn/coremail/s?func=lp:getImg&org_id=&img_id=logo_001'" :fit="'cover'" />
    </el-col>
    <el-col :span="6"><div class="grid-content-ep-bg-purple" />
        <el-text class="mx-1" size="large">Large</el-text>
    </el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  </template>
  

<style>
.grid-content-ep-bg-purple{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
</style>