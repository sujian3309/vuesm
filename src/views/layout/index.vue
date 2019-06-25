<template>
    <!-- <div class="layout-wrap">
        <AppAside/>
        <AppHeader/>
        Home  内容管理  粉丝管理。。。都显示到这里
    </div> -->
<el-container>
  <el-aside width="200px">
      <AppAside/>
  </el-aside>
  <el-container>
    <el-header>
        <AppHeader/>
    </el-header>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>
<script>
    import AppAside from './components/AppAside.vue'
    import AppHeader from './components/AppHeader.vue'
    export default {
        name: 'AppLayout',
        components: {
            AppAside,
            AppHeader
        },
        data () {
            return{}
        }
    }
</script>
<style lang="less" scoped>
    .el-container {
        height: 100%;
    }
    .el-aside{
        background-color: #343a46;
    }
    .el-header{
        background-color: #aec0d1;
    }
    .el-main {
        background-color: #f3f4f6;
    }
</style>