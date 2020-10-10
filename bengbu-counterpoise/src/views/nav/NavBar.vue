<template>
  <el-menu :router="true" :default-active="defaultActive" mode="horizontal">
    <el-menu-item index="/" key="/">组织管理</el-menu-item>
    <el-menu-item index="/sensor" key="/sensor">设备管理</el-menu-item>
    <el-menu-item index="/repo" key="/repo">比对库管理</el-menu-item>
    <el-menu-item index="/task" key="/task">分析任务</el-menu-item>
  </el-menu>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NavBar extends Vue {
  private get defaultActive() {
    return this.$route.path;
  }
}
</script>
<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  margin-bottom: 10px;
}
</style>
