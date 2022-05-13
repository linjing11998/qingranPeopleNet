import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
/* state: 数据
actions:可以包含异步操作
mutations: 唯一可以修改state数据的场所
getters: 类似于vue组件中的计算属性，对state数据进行计算（会被缓存）
modules:模块化管理store（仓库），每个模块拥有自己的 state、mutation、action、getter
 */

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
// 无需写完整modules文件引入。调用modules内的单个模块只需要app
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  state: {
    pathName: ''
  },
  mutations: {
    // 类似：方法名（存储参数值，传递值）
    savePath (state, pathName) {
      state.pathName = pathName
    }
  },
  // 模块化，计算属性
  modules,
  getters,
  plugins: [ createPersistedState({
	  storage: window.sDessionStorage
  })]
})
export default store
