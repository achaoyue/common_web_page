<template>
  <div style="width: 100%;height: 100% ;display: inline-block;min-height: 200px">
    <div :id="'echat-line'+(this.stockNum || this.randomId)+(this.fixId || '')" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import globalFunction from "@/globalFunction";

/*{
  x:[]
  y:[[]]
}*/

export default {
  name: "LineChart",
  props:{
    stockNum:String,
    fixId:String,
    data:Object
  },
  data(){
    return {
      kChart:null,
      randomId:Math.round(Math.random()*10000000),
      options:{
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#ff5a1e',
            }
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          scale: true,
          type: 'value'
        },
        dataZoom:[
          {
            type:"slider"
          },
          {
            type:"slider",
            yAxisIndex: [0],
          }
        ],
        series: [
          {
            data: [],
            type: 'bar',
            animation:false,
            itemStyle:{
              color:'blue'
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
    var dom = document.getElementById('echat-line' + (this.stockNum || this.randomId) + (this.fixId || ''));
    this.kChart = this.echarts.init(dom);
    this.initK();
  },
  watch:{
    data(o){
      this.initK();
    }
  },
  methods:{
    initK(){
      console.log(this.data);
      if (!this.data){
        this.kChart.clear();
        return;
      }
      this.options.xAxis.data = this.data.x;
      this.options.series = this.data.y.map(e=>{
        return {
          data: e,
          type: 'line',
          animation:false
        }
      })
      this.kChart.clear();
      this.kChart.setOption(this.options)
    }
  },
}
</script>

<style scoped>

</style>