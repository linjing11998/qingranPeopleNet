<template>
  <!-- 搜索框、点击定位中心点 -->
  <div>
    <div class="amap-page-container">
      <el-amap-search-box
        class="search-box"
        ref="searchBox"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      >
      </el-amap-search-box>
      <el-amap
        ref="map"
        vid="amapDemo"
        :amap-manager="amapManager"
        :center="center"
        :zoom="zoom"
        :plugin="plugin"
        :events="events"
        class="amap-demo"
      >
        <el-amap-marker :position="center"></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>
<script>
//引入 获取实例
import { AMapManager } from "vue-amap";
let amapManager = new AMapManager();
let Geocoder; //先声明变量，
export default {
  props: {
    centers: [],
  },
  watch: {
    centers: {
      handler(val) {
        this.center = val;
        var input = "";
        Geocoder.getAddress(this.center, function (status, result) {
          //根据坐标获取位置
          if (status === "complete" && result.info === "OK") {
            input = result.regeocode.formattedAddress; // 坐标信息赋值给搜索框
            // 这里无法使用this
          }
        });
        setTimeout(() => {
          //设置延迟执行
          this.input = input;
          this.$refs.searchBox.keyword = this.input;
        }, 200);
      },
      deep: true,
    },
  },
  data() {
    let self = this;
    return {
      amapManager, // 对应地图
      zoom: 12, // 缩放比例
      input: "", // 搜索输入框
      markers: [], // 点标记
      searchOption: {
        city: "全国", // 搜索范围
        citylimit: false, // 城市限制
      },
      center: [120, 40], // 经度纬度为中心点
      events: {
        // 事件
        init: (o) => {
          o.getCity((result) => {});
        },
        moveend: () => {},
        zoomchange: () => {},
        click: (e) => {
          // 地图点击事件
          self.center = [e.lnglat.lng, e.lnglat.lat];
          Geocoder.getAddress(self.center, function (status, result) {
            //根据坐标获取位置
            if (status === "complete" && result.info === "OK") {
              self.input = result.regeocode.formattedAddress; // 坐标信息赋值给搜索框
              self.$refs.searchBox.keyword = self.input;
            }
          });
        },
      },
      plugin: [
        //
        {
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          pName: "Geolocation", // AMap-Geolocation 定位插件
          events: {
            init(o) {
              //getCurrentPosition 获取当前位置的方法
              //注意 虽然进页面就会调用这个方法，但是data()中center要有默认值，不然会报错
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  let lng = result.position.lng;
                  let lat = result.position.lat;
                  self.center = [lng, lat];
                  self.loaded = true;
                  self.zoom = 14;
                  self.$nextTick();
                }
              });
            },
          },
        },
        {
          pName: "Geocoder", //使用AMap.Geocoder插件
          events: {
            init(o) {
              Geocoder = o; // o 则是AMap.Geocoder的实例 对外部的Geocoder变量进行赋值，在任何地方就都可以使用了
              //self.center 具体坐标 （数组格式） ，function 回调函数
              o.getAddress(self.center, function (status, result) {
                if (status === "complete" && result.info === "OK") {
                  //result.regeocode.formattedAddress就是具体位置
                  self.input = result.regeocode.formattedAddress;
                  //对搜索组件的input进行赋值
                  self.$refs.searchBox.keyword = self.input;
                }
              });
            },
          },
        },
      ],
    };
  },
  methods: {
    //点击搜索后触发的事件
    onSearchResult(pois) {
      if (pois.length > 0) {
        this.$nextTick(() => {
          this.$refs.searchBox.keyword = pois[0].name;
        });
      }
      //这边类似模糊查询 会返回一个数组，我就直接取第一个值了。
      this.center = [pois[0].lng, pois[0].lat];
    },
    // 对应输入框
    hand() {
      Geocoder.getAddress(this.center, function (status, result) {
        //根据坐标获取位置
        if (status === "complete" && result.info === "OK") {
          var input = result.regeocode.formattedAddress; // 坐标信息赋值给搜索框
          console.log(result.regeocode.formattedAddress, "input");
          this.$refs.searchBox.keyword = input;
          console.log(this.$refs, "this.$refs");
        }
      });
    },
  },
};
</script>
<style scoped>
.amap-page-container {
  position: relative;
  width: 100%;
  height: 645px;
  margin-top: 20px;
}
</style>
<style>
.search-box {
  position: absolute !important;
  top: 30px;
  left: 30px;
  z-index: 200 !important;
}

.el-vue-search-box-container .search-tips ul li {
  color: #06164a;
}

.el-vue-search-box-container .search-box-wrapper .search-btn {
  color: #06164a;
  font-size: 16px;
  font-weight: 400;
}
</style>
