<template>
  <div class="hello">
   <ul>
     <li>
       <!-- 跳转链接 -->
       <router-link to="/echartsList">echarts图例子</router-link>
     </li>
   </ul>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>

</style>
