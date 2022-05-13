<template>
  <div>store功能解析</div>
</template>
<script>
import roles from './router'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    // 语法糖 4个
    ...mapState({}),
    ...mapActions({}),
    ...mapGetters({}),
    ...mapMutations({})
  },
  methods: {
    async click () {
      // 存储变量
      // 调用mutations中的方法
      this.$store.commit('savePath', this.path) // 触发savePath方法
      // 调用actions 中的方法(支持异步执行)
      await this.$store.dispatch('permission/generateRoutes', roles) // modules 模块化中的 permission.js
    },
    getState () {
      // 获取变量
      this.$store.state.pathName
    }
  }
}
</script>
