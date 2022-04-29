<template>
  <el-container class="mainview">
    <!-- 根据巡航器改版 -->
    <el-header>
      <el-row type="flex" style="position: relative; top:50%; transform:translateY(-50%);">
        <span style="font-size: 30px;font-weight: 600;">轨迹回放</span>
      </el-row>
    </el-header>
    <el-container style="padding:20px;">
      <!-- <el-aside width="340px" style="padding:20px;background-color: white;">
        <el-row type="flex">
          <el-select v-model="user" placeholder="人员名称" clearable style="width:145px;margin-right: 10px;">
            <el-option v-for="item in userList" :key="item.ename" :label="item.ename" :value="item.ename">
            </el-option>
          </el-select>
          <el-date-picker v-model="dateOne" type="date" placeholder="选择日期" style="width:145px;" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle" style="margin-top: 10px;">
          <span class="searchspan">时间:</span>
          <el-time-picker is-range v-model="time" style="width:255px;" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm:ss">
          </el-time-picker>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-button icon="el-icon-search" size="small" class='btns' @click="gjSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" class='btns' @click="refreshSearch">刷新</el-button>
        </el-row>
        <el-row>
          <el-table :data="tableData.slice((this.page - 1) * 10, (this.page - 1) * 10 + 10)" style="width: 100%" height="528px" @cell-click="handle" :row-class-name="tableRowClassName" highlight-current-row>
            <el-table-column prop="egCreatetime" label="时间" :formatter="timeFormate"></el-table-column>
            <el-table-column prop="egLng" label="精度"></el-table-column>
            <el-table-column prop="egLat" label="纬度"></el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-pagination small background layout="total,prev, pager, next" :total="totalresult" @current-change="handleCurrentChange" :current-page.sync="page">
          </el-pagination>
        </el-row>
      </el-aside> -->

      <el-main style="position: relative;padding:0px;height:700px">
        <div id="container" style="height:100%; width:100%"></div>
        <div class="playSpeed">
          <!-- 开始暂停按钮 -->
          <i v-if="palyStatus == 0" class="el-icon-video-play" @click="navgControl('start')" style="font-size: 40px; color:#3378ff"></i>
          <i v-if="palyStatus == 1" class="el-icon-video-play" @click="navgControl('resume')" style="font-size: 40px;color:#3378ff"></i>
          <i v-if="palyStatus == 2" class="el-icon-video-pause" @click="navgControl('pause')" style="font-size: 40px;color:#3378ff"></i>
          <span style="font-size: 20px;padding:0 20px 0 10px;">{{passedTime}}</span>
          <el-slider class="map-slider" v-model="sliderVal" :disabled="beforeInit" @change="carReLocate" style="width:70%"></el-slider>
          <span style="font-size: 20px;padding:0 10px;">{{totalTime}}</span>
          <el-select v-model="markerSpeed" style="width:90px;" placeholder="倍速" class="markerSpeed">
            <el-option v-for="item in speedOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 自定义巡航器图片
import imgUrl from '../../../assets/icon/plane.png'
// import imgUrl from '../../assets/daohang.png'
// import { lazyAMapApiLoaderInstance } from 'vue-amap'
// import trailcopy from './trailcopy.vue'
export default {
  props: ['userid'],

  watch: {
    // 监听滑块的变化，值改变
    sliderVal (newVal) {
      if (!this.isOnSlider) {
        return false
      }
      this.sliderChange(newVal)
    }
  },
  data () {
    return {
      // 搜索栏
      user: '',
      dateOne: '',
      time: '',
      // 围栏成员列表
      userList: [{ // 需放空
        'id': 1,
        'label': '张三'
      },
      {
        'id': 2,
        'label': '李四'
      }
      ],
      page: 1,
      totalresult: 0, // 总条数
      tableData: [],
      tableData1: [{
        time: '09:02:03',
        lng: '116.478939',
        lat: '39.997825'
      }, {
        time: '08:57:03',
        lng: '116.478935',
        lat: '39.997761'
      }, {
        time: '09:07:03',
        lng: '116.478912',
        lat: '39.998549'
      }, {
        time: '09:17:03',
        lng: '116.478912',
        lat: '39.998549'
      }, {
        time: '09:22:03',
        lng: '116.478998',
        lat: '39.998555'
      }, {
        time: '09:27:03',
        lng: '116.478998',
        lat: '39.998555'
      }, {
        time: '09:32:03',
        lng: '116.479282',
        lat: '39.99856'
      }, {
        time: '09:37:03',
        lng: '116.479658',
        lat: '39.998528'
      }, {
        time: '09:42:03',
        lng: '116.480151',
        lat: '39.998453'
      }, {
        time: '09:47:03',
        lng: '116.480784',
        lat: '39.998302'
      }, {
        time: '09:52:03',
        lng: '116.480784',
        lat: '39.998302'
      }, {
        time: '09:57:03',
        lng: '116.481149',
        lat: '39.998184'
      }, {
        time: '10:02:03',
        lng: '116.481573',
        lat: '39.997997'
      }, {
        time: '10:07:03',
        lng: '116.481863',
        lat: '39.997846'
      }, {
        time: '10:12:03',
        lng: '116.482072',
        lat: '39.997718'
      }, {
        time: '10:17:03',
        lng: '116.482362',
        lat: '39.997718'
      }, {
        time: '10:22:03',
        lng: '116.483633',
        lat: '39.998935'
      }, {
        time: '10:27:03',
        lng: '116.48367',
        lat: '39.998968'
      }, {
        time: '10:32:03',
        lng: '116.484648',
        lat: '39.999861'
      } ],
      firstArr: [116.478935, 39.997761],
      // lineArr: [],
      lineArr: [
        [116.478935, 39.997761],
        [116.478939, 39.997825],
        [116.478912, 39.998549],
        [116.478912, 39.998549],
        [116.478998, 39.998555],
        [116.479282, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480784, 39.998302],
        [116.480784, 39.998302],
        [116.481149, 39.998184],
        [116.481573, 39.997997],
        [116.481863, 39.997846],
        [116.482072, 39.997718],
        [116.482362, 39.997718],
        [116.483633, 39.998935],
        [116.48367, 39.998968],
        [116.484648, 39.999861]
      ],

      // marker: null,
      // polyline: null,
      // curreGDPath: null, //存放（播放时点击倍数）抓取到的经纬度
      // passedPath: 0, // 存放（播放时点击倍数）抓取到的位置

      // value: 0, // 进度条初始化
      // int: null, // 定时器--进度条
      // timeInt: null, // 定时器--时间
      // ptm: 0,
      // passedPolyline: null,

      num: '', // 保存分页行，id不清空
      // 地图
      map: null,
      // 工具
      toolBar: null,
      // 巡航器
      pathSimplifierIns: null,
      navg1: null, // 第一个巡航器
      navgtrSpeed: 200, // 巡航速度 km/h
      currentPoint: null, // 巡航器点定位,地图中心点变化
      // 时间
      movedTime: 0, // 初始的移动时间为0 初始化
      passedTime: '', // 经过时间 格式化
      totalTime: '', // 总时间 格式化
      Times: '', // 总时间 初始化
      // 进度条
      beforeInit: true, // 滑块禁用状态
      palyStatus: 0, // 0开始 1继续 2暂停按钮状态
      isCursorAtPathEnd: false, // 判断是否到达终点
      sliderVal: 0, // 进度条滑块值
      markerSpeed: 1, // 倍速
      // 倍速选择器
      speedOptions: [{
        label: '2.0X',
        value: 2
      }, {
        label: '1.5X',
        value: 1.5
      }, {
        label: '1.25X',
        value: 1.25
      }, {
        label: '1.0X',
        value: 1
      },
      {
        label: '0.75X',
        value: 0.75
      },
      {
        label: '0.5X',
        value: 0.5
      }
      ]
    }
  },
  mounted () {
    // this.handleUserName()

    // 为滑动条版绑定监听事件
    let that = this
    let el = document.getElementsByClassName('el-slider__button-wrapper')[0]
    let el2 = document.getElementsByClassName('el-slider__runway')[0]
    el2.addEventListener('click', that.sliderChange, false)
    el.addEventListener('mousedown', that.openSlider, false)
    // 此处用document是因为，滑动较为随意时，mouseup可能不是作用在el上
    document.addEventListener('mouseup', that.closeSlider, false)
    // 初始化地图
    this.initMap()
    this.initPathSimplifier()
    // lazyAMapApiLoaderInstance.load().then(() => {

    // })
  },
  methods: {
    // 初始化地图
    initMap () {
      this.map = new AMap.Map('container', {
        rotateEnable: true,
        pitchEnable: true,
        zoom: 17,
        pitch: 50,
        rotation: -15,
        viewMode: '3D', // 开启3D视图,默认为关闭
        zooms: [2, 20],
        center: [116.333926, 39.997245],
        // viewMode: '3D', // 开启3D视图,默认为关闭
        resizeEnable: true // 窗口大小调整
        // center: this.firstArr, // 中心 firstArr: [116.478935, 39.997761],
        // zoom: 20
      })
      this.toolBar = new AMap.ToolBar({
        position: {
          right: '40px',
          top: '110px'
        }
      })
      toolBar.addTo(this.map)
      // 初始化开始时间\总时间
      this.passedTime = this.secondToTimeStr(this.movedTime)
      this.totalTime = this.secondToTimeStr(0)
    },
    // 初始化巡航器组件
    initPathSimplifier () {
      let that = this
      // 计算总时间
      var dis = AMap.GeometryUtil.distanceOfLine(this.lineArr) // 总路程 米
      this.Times = parseInt((dis / 1000 / 200) * 60 * 60) // 计算总时间：总路程÷速度,m÷1000÷200(km/h) ×60分 ×60秒
      this.totalTime = this.secondToTimeStr(this.Times)

      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }

        // 建立巡航器
        that.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          // autoSetFitView:false,
          map: that.map, // 所属的地图实例
          getPath: function (pathData, pathIndex) {
            return pathData.path // 返回节点坐标数组，经、纬度
          },
          // 鼠标悬停显示的内容
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            // if (pointIndex >= 0) {
            //   //point
            //   return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
            // }
            // return pathData.name + '，点数量' + pathData.path.length;
          },
          // 自定义样式
          renderOptions: {
            renderAllPointsIfNumberBelow: 100, // 绘制路线节点，小于绘制全部，如不需要可设置为-1
            // 轨迹线样式
            'pathLineStyle': {
              'lineWidth': 5,
              'strokeStyle': '#2288ff',
              'borderWidth': 1,
              'borderStyle': '#eeeeee',
              'dirArrowStyle': true // 轨迹上的箭头
            }
            // 鼠标移动
            // "pathLineHoverStyle": {
            // },
          },
          clickToSelectPath: false // 点击轨迹节点或者轨迹节点间的连线时，选中该轨迹，默认true。
        })
        function onload () {
          that.pathSimplifierIns.renderLater()
        }
        function onerror (e) {
          console.log('图片加载失败！')
        }

        // 设置数据
        that.pathSimplifierIns.setData([{
          name: '路线0',
          path: that.lineArr
        }])
        let image = PathSimplifier.Render.Canvas.getImageContent(imgUrl, onload, onerror)
        if (that.lineArr.length === 0) {

        } else {
        // 对第一条线路（即索引 0）创建一个巡航器
          that.navg1 = that.pathSimplifierIns.createPathNavigator(0, {
          // loop: true, //循环播放
            speed: that.navgtrSpeed, // 巡航速度，单位千米/小时 这里用倍速控制
            pathNavigatorStyle: {
            // 使用图片,自定义巡航样式
              width: 32,
              height: 32,
              content: image,
              // 巡航器经过的线
              pathLinePassedStyle: {
                'lineWidth': 6,
                'strokeStyle': '#109618',
                'borderWidth': 1,
                'borderStyle': '#cccccc',
                'dirArrowStyle': true
              }
            }
          })
          // 事件触发方法，执行内容
          that.navg1.on('start', function () {
            console.log('start')
          })
          that.navg1.on('resume', function () {
            console.log('resume')
          })
          that.navg1.on('pause', function () {
            console.log('pause')
          })
          that.navg1.on('stop', function () {
          // that.navg1._movedTime = 0; // 停止后，经过时间直接清空
            console.log('stop')
          })
          that.navg1.on('move', function (data, position) {
            console.log('move')
            that.isCursorAtPathEnd = false
            // 比如{idx: 1, tail:0.5}就表示当前处于节点1到节点2的中间位置
            let idx = position.dataItem.pointIndex // 走到了第几个点，节点索引
            let tail = position.tail // 至下一个节点的比例位置
            let totalIdx = idx + tail // 总节点比例
            let len = position.dataItem.pathData.path.length // 总长度

            // 进度条变化，时间变化
            that.movedTime = parseInt(that.Times * (that.sliderVal / 100))
            that.passedTime = that.secondToTimeStr(that.movedTime) // 经过时间
            console.log(that.sliderVal, '滑块值')
            console.log(that.passedTime, 'that.passedTime')
            // 移动的距离
            that.navg1._movedDist = this.getMovedDistance() // 移动距离
            // 进度条实时展示tail
            !that.isOnSlider && (that.sliderVal = (that.navg1._movedDist / dis) * 100)

            // 计算下一个距离速度
            if (idx < len - 1) {
            // that.navgtr.setSpeed(that.navgtr._realSpeed * that.times);
              that.navg1.setSpeed(that.navgtrSpeed * that.markerSpeed) // 巡航器速度×倍速
            }

            // 如果到头了，回到初始状态
            if (that.navg1.isCursorAtPathEnd()) {
              that.isCursorAtPathEnd = true
              // 初始化
              that.initPlayBox()
            }
            // 加载完成
            that.beforeInit = false
          })
        }
      })
    },

    /**
    * 轨迹回放重新定位
    */
    carReLocate () {
      // 鼠标从滑动条抬起时，重新定位
      if (this.currentPoint) {
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          this.map.setCenter(this.currentPoint)
        }, 0)
      }
    },

    // 控制播放器按钮
    navgControl (type) {
      if (!this.navg1 || !type) {
        return
      }
      if (type === 'start' || type === 'resume') {
        // 开始 || 继续点击后，变为暂停
        this.palyStatus = 2
        // 如果已经到了终点，重新定位坐标
        if (this.isCursorAtPathEnd && this.lineArr.length > 0) {
          this.map.setCenter(this.lineArr[0]) // 设置中心点为第一个点
        }
      } else if (type === 'pause') {
        // 暂停点击后，变为继续
        this.palyStatus = 1
      }
      this.navg1[type]() // 改变巡航器状态
    },
    // 初始化播放器状态
    initPlayBox () {
      // 这里要重新初始化巡航器,不能用暂停,得停止
      this.navgControl('stop')
      this.navg1.moveToPoint(0, 0) // 移动巡航器到初始位置
      this.palyStatus = 0 // 继续状态
      this.sliderVal = 0 // 进度条清0
      // 初始化开始时间
      this.movedTime = 0
      this.passedTime = this.secondToTimeStr(this.movedTime)
      console.log(this.passedTime, 'passed')
      console.log(this.sliderVal, 'sliderVal')
    },

    // 时间格式化
    secondToTimeStr (t) {
      if (!t) return '00:00:00'
      if (t < 60) return '00:00:' + ((i = t) < 10 ? '0' + i : i)
      if (t < 3600) {
        return '' + ((a = parseInt(t / 60)) < 10 ? '0' + a : a) + ':' + ((i = t % 60) < 10 ? '0' +
        i : i)
      }
      if (t >= 3600) {
        var a, i, e = parseInt(t / 3600)
        return (e < 10 ? '0' + e : e) + ':' + ((a = parseInt(t % 3600 / 60)) < 10 ? '0' + a : a) + ':' + ((i =
          t %
          60) < 10 ? '0' + i : i)
      }
    },

    // 滑块进度条
    openSlider () {
      this.isOnSlider = true
    },
    closeSlider () {
      this.isOnSlider = false
    },
    // 滑块改变位置
    sliderChange (val) {
      if (this.beforeInit) {
        return
      }
      this.navgControl('stop')
      this.navgControl('start')
      this.navgControl('pause')
      // 先改为播放状态
      if (this.palyStatus === 0) {
        this.navgControl('start')
        this.navgControl('pause')
      }
      // this.navgControl('pause')
      // 滑块值改变，移动巡航器
      let newVal = typeof (newVal) === 'number' ? val : this.sliderVal // 判断滑块值,赋值
      var dis = AMap.GeometryUtil.distanceOfLine(this.lineArr) // 总路程 米
      let num = (newVal / 100) * dis // 滑块移动的总距离
      this.navg1.moveByDistance(num) // 将巡航器移动指定的距离，单位米
      this.pathSimplifierIns.renderLater() // 重新绘制
      console.log(this.sliderVal, '滑块改变')
    },

    // 点击列表，对应点位
    handle (row, column, cell, event) {
      this.num = []
      // 分页数据id累加
      if (this.page !== 1) {
        this.num = row.index + (this.page - 1) * 10
      } else {
        this.num = row.index
      }
      // 先改为播放状态
      // if (this.palyStatus === 0) {
      this.navgControl('start')
      // }
      this.pathSimplifierIns.renderLater() // 重新绘制巡航器

      // 列表的点，直接对应节点
      this.navg1.moveToPoint(this.num, 0) // 点击列表点 move
      // 获取滑块值，对应经过时间
      this.movedTime = parseInt(this.Times * (this.sliderVal / 100))
      this.passedTime = this.secondToTimeStr(this.movedTime) // 经过时间
      this.navgControl('pause')
    },

    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
      // console.log(row.index, 'row')
      // 变更样式
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      }
      return ''
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
    },

    // 人员名称加载
    handleUserName () {
      let formD = new FormData()
      formD.append('companyId', this.$store.state.companyid) // 公司id还未获取
      this.$axios({
        method: 'post',
        url: '/dispatch_server/initMember',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false,
        data: formD
      }).then(res => {
        if (res.data.code === 0) {
          this.userList = res.data.data
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch(error => {
        this.$message.error('人员加载失败，请联系系统管理员！')
      })
    },
    // 搜索条件
    handleList (user, dateOne, time) {
      let formD = new FormData()
      if (user === '' || user === null || user === undefined) {
        this.$message.error('人员名称不能为空！')
      } else if (dateOne === '' || dateOne === null || dateOne === undefined) {
        this.$message.error('日期不能为空！')
      } else {
        if (time === '' || time === null || time === undefined) {
          // 如果时间为空,默认选择一天
          formD.append('eName', user)
          formD.append('date', dateOne)
          formD.append('begintime', '00:00:00')
          formD.append('endtime', '23:59:59')
        } else if (time !== '' && time !== null && time !== undefined) {
          formD.append('eName', user)
          formD.append('date', dateOne)
          formD.append('begintime', time[0])
          formD.append('endtime', time[1])
        }
        formD.append('companyid', this.$store.state.companyid) // 公司id还未获取
        formD.append('size', 1000) // 固定值每1000条一页
        formD.append('current', 1)
        this.$axios({
          method: 'post',
          url: '/eqgps/page',
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
          data: formD
        }).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.records
            this.totalresult = res.data.data.total
            // console.log(this.tableData, 'tableData')
            // 清空
            this.palyStatus = 0 // 按钮为开始
            this.sliderVal = 0 // 进度条清0
            this.movedTime = 0
            this.passedTime = this.secondToTimeStr(this.movedTime)
            this.lineArr = [] // 清空轨迹线
            this.pathSimplifierIns.setData() // 设定数据源数组，并触发重新绘制。data为空时将清除显示内容。
            for (let i = 0; i < this.tableData.length; i++) {
              this.lineArr.push([this.tableData[i].egLng, this.tableData[i].egLat])
            }
            // 重新绘制
            this.initPathSimplifier()
            this.$message({
              message: '一共查找到' + this.totalresult + '个轨迹点',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(error => {
          this.$message.error('加载失败，请联系系统管理员！')
        })
      }
    },
    // 搜索
    gjSearch (num) {
      if (num === undefined) {
        this.page = 1
      }
      this.handleList(this.user, this.dateOne, this.time)
    },
    // 刷新
    refreshSearch () {
      this.user = ''
      this.dateOne = ''
      this.time = ''
      this.tableData = []
      // this.lineArr = []
      // this.gjSearch(this.user, this.dateOne, this.time)
    },
    // 处理表格数据
    timeFormate (val) {
      if (val.egCreatetime === null) { return '' } else { return (val.egCreatetime.split(' ')[1]) }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    }
  }

}
</script>

<style>
.mainview {
  background-color: #d7d7d7;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0px;
}
</style>
<style scoped>
.btns {
  background-color: #4fc1fd;
  color: white;
}

.tracefoot {
  background: linear-gradient(to bottom, #ffffff 0%, #999999 50%);
  height: 100%;
}

.el-table .success-row {
  background: #f0f9eb;
}

.speedtype .el-input__inner {
  width: 50px;
  border: 0px;
}

.el-page-header__content {
  font-weight: 800;
}
.playSpeed {
  color: white;
  width: 100%;
  /* height: 100px; */
  align-items: center;
  justify-content: center;
  display: flex;
  height: 80px;
  position: absolute;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.63));
  z-index: 200;
}
</style>
