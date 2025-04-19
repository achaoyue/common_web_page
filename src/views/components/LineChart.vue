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
  legend:[],
  color:[]
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
        color:["#E6194B","#3CB44B","#4363D8","#FFE119","#F58231","#911EB4","#42D4F4","#F032E6","#BFEF45","#000075"],
        grid: {
          bottom: '100px',
          containLabel: true
        },
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
        legend: {
          selector:true,
          itemWidth: 6,
          itemHeight: 6,
          width:'80%',
          bottom:40,
          xorient:'vertical',
          data: ['a','b']
        },
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
      if (this.data.color!=null){
        this.color = this.data.color;
      }
      this.options.xAxis.data = this.data.x;
      if (this.data.legend != undefined){
        this.options.legend.data = this.data.legend;
      }else{
        let i = 0;
        this.options.legend.data = this.data.y.map(e=>{return ""+i++} );
      }

      let i = 0;
      this.options.series = this.data.y.map(e=>{
        return {
          data: e,
          type: 'line',
          animation:false,
          name: this.data.legend ? this.data.legend[i++] : ""+i++
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