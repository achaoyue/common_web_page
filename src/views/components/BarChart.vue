<template>
  <div style="width: 100%;height: 100%; display: inline-block">
    <div :id="'stock-bar'+this.stockNum+(this.fixId || '')" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import globalFunction from "@/globalFunction";

export default {
  name: "BarChart",
  props:{
    stockNum:String,
    fixId:String,
    data:Object
  },
  data(){
    return {
      kChart:null,
      options:{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#ff5a1e',
              show: false
            }
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            animation:false,
            itemStyle:{
              color:'blue'
            }
          },
          {
            data: [],
            type: 'bar',
            animation:false,
            itemStyle:{
              color:'red'
            }
          }
        ]
      }
    }
  },
  created() {
    this.echarts = require("echarts");
  },
  mounted() {
    var dom = document.getElementById('stock-bar' + this.stockNum + (this.fixId || ''));
    this.kChart = this.echarts.init(dom);
    this.initK();
  },
  watch:{
    data(o){
      console.log("bar chart",o)
      this.initK();
    }
  },
  methods:{
    initK(){
      let dataMap1 = globalFunction.toMap(this.data.value[0],"key");
      let dataMap2 = globalFunction.toMap(this.data.value[1],"key");
      let xAxis = Array.from({ length: 41 }, (_, index) => index -20);
      this.options.xAxis.data = xAxis;
      this.options.series[0].data = xAxis.map(e=>dataMap1[e+".0"]?dataMap1[e+".0"].value : "-")
      this.options.series[1].data = xAxis.map(e=>dataMap2[e+".0"]?dataMap2[e+".0"].value : "-")
      this.kChart.clear();
      this.kChart.setOption(this.options)
    }
  },
}
</script>

<style scoped>

</style>