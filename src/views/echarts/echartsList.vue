<template>
<el-container>
    <el-aside class="side">
        <el-menu default-active="this.$route.path" :router="true" active-text-color="#4fc1fd">
            <el-menu-item index="/search">搜索框、点击定位中心点</el-menu-item>
            <el-menu-item index="/plane">飞机图</el-menu-item>
            <el-menu-item index="/people">人口迁移，top10</el-menu-item>
            <el-menu-item index="/trail">轨迹回放</el-menu-item>
            <el-menu-item index="/3Dcity">3d</el-menu-item>
        </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
</el-container>
</template>

<script>
export default {
  name: 'echartsList',
  data () {
    return {}
  }
}
</script>

<style scoped>
.side{
  position: relative;
  width: 200px;
}
</style>
