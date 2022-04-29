<template>
  <div>
    <div>原理：利用高德地图的巡航器</div>
    <!-- 飞机图 -->
    <div id="test-map" />
    <input type="text" readonly="true" id="lnglat" />
  </div>
</template>

<script>
// 自定义图片
import planeUrl from '../../../assets/icon/plane.png'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
import { format } from 'echarts'
export default {
  data () {
    return {
      map: '', // 地图
      // 轨迹数组，格式[{},{},...]
      path: [
        // {
        //   path: [
        //     [116.368904, 39.913423],
        //     [116.382122, 39.901176],
        //     [116.387271, 39.912501],
        //     [116.398258, 39.904600],
        //     [116.368904, 39.913423]
        //   ]
        // },
        {
          name: '北京 -> 乌鲁木齐',
          path: [
            [116.405289, 39.904987],
            [113.964458, 40.54664],
            [111.47836, 41.135964],
            [108.949297, 41.670904],
            [106.380111, 42.149509],
            [103.774185, 42.56996],
            [101.135432, 42.930601],
            [98.46826, 43.229964],
            [95.777529, 43.466798],
            [93.068486, 43.64009],
            [90.34669, 43.749086],
            [87.61792, 43.793308]
          ]
        },
        {
          name: '北京 -> 佳木斯',
          path: [
            [116.405289, 39.904987],
            // [121.361221, 43.509494],
            [121.384956, 43.81677],
            [122.361221, 44.509494],
            [122.371221, 44.609494],
            [130.361221, 46.809494]
          ]
        },
        {
          name: '北京 -> 漠河',
          path: [
            [116.405289, 39.904987],
            [122.536209, 52.972134]
          ]
        },
        {
          name: '北京 -> 拉萨',
          path: [
            [116.405289, 39.904987],
            [91.131851, 29.660595]
          ]
        },
        {
          name: '北京 -> 丽江',
          path: [
            [116.405289, 39.904987],
            [100.233002, 26.872053]
          ]
        },
        {
          name: '北京 -> 贵阳',
          path: [
            [116.405289, 39.904987],
            [106.713516, 26.57832]
          ]
        },
        {
          name: '北京 -> 深圳',
          path: [
            [116.405289, 39.904987],
            [114.085938, 22.546988]
          ]
        },
        {
          name: '北京 -> 福州',
          path: [
            [116.405289, 39.904987],
            [119.306816, 26.075317]
          ]
        },
        {
          name: '北京 -> 佳木斯',
          path: [
            [116.405289, 39.904987],
            [130.361221, 46.809494]
          ]
        }
      ]
    }
  },
  mounted () {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.map = new AMap.Map('test-map', {
        // zooms: [13, 18], // 地图缩放范围
        zoom: 4, // 地图缩放范围
        center: new AMap.LngLat(116.397428, 39.90923)
      })

      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        // 创建组件实例
        var pathSimplifierIns = new PathSimplifier({
          map: this.map,
          zIndex: 100, // 图层叠加顺序
          data: this.path, // 巡航路径
          // 获取巡航路径中的路径坐标数组
          getPath: (pathData, pathIndex) => {
            return pathData.path
          },
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: '#46bee9',
              lineWidth: 1,
              dirArrowStyle: true
            },
            // 航线选中样式
            pathLineSelectedStyle: {
              strokeStyle: 'white',
              lineWidth: 3,
              borderWidth: 1,
              borderStyle: '#46bee9',
              dirArrowStyle: null
            }
          }
        })

        function onload () {
          pathSimplifierIns.renderLater()
        }

        function onerror (e) {
          alert('图片加载失败！')
        }
        // 创建巡航器
        // var pathNavigator = pathSimplifierIns.createPathNavigator(0, { // 关联第一条轨迹
        //   loop: true, // 是否循环
        //   speed: 2000000, // 速度(km/h)
        //   pathNavigatorStyle: {
        //     width: 24,
        //     height: 24,
        //     // 使用图片
        //     content: PathSimplifier.Render.Canvas.getImageContent(planeUrl, onload, onerror),
        //     strokeStyle: null,
        //     fillStyle: null,
        //     // 经过路径的样式
        //     pathLinePassedStyle: {
        //       lineWidth: 1,
        //       strokeStyle: 'white',
        //       dirArrowStyle: null
        //     }
        //   }
        // })
        // pathNavigator.start()
        // 创建巡航器
        for (var i = 0; i < 9; i++) {
          var pathNavigator = pathSimplifierIns.createPathNavigator(i, {
            // 关联第一条轨迹
            loop: true, // 是否循环
            speed: 2000000, // 速度(km/h)
            pathNavigatorStyle: {
              width: 24,
              height: 24,
              // 使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(
                planeUrl,
                onload,
                onerror
              ),
              strokeStyle: null,
              fillStyle: null,
              // 经过路径的样式
              pathLinePassedStyle: {
                lineWidth: 1,
                strokeStyle: 'white',
                dirArrowStyle: null
              }
            }
          })
          pathNavigator.start()
        }
      })
    })
  }
}
</script>

<style scoped>
#test-map {
  height: 645px;
  margin-top: 20px;
}
</style>
<style scoped>
.amap-page-container {
  width: 100%;
  height: 645px;
}
</style>
