<script setup lang="ts">
import { RouterView } from "vue-router";

import Aside from "@/views/Root/Aside.vue";
import Header from "@/views/Root/Header.vue";
</script>

<template>
  <el-container class="home-container">

    <!-- 侧边栏 -->
    <el-aside style="width: 300px">
      <Aside />
    </el-aside>

    <el-container>

      <!-- 头部 -->
      <el-header style="width: 100%; height: 50px; padding: 0">
        <Header />
      </el-header>

      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>

    </el-container>

  </el-container>
</template>

<style scoped lang="scss">

.home-container {
  height: 100vh;

  .el-main {
    padding: 10px;
    background-color: #f3f3f3;
    height: calc(100vh - 50px);
  }

}
</style>