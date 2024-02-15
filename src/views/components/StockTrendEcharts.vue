<!--多只股走势组件 -->
<template>
  <div>
    <IndustrySelector :change="(val)=>{param.industry = val}"/>
    <StockSelector :multiple='true' :change="(val)=>{param.stockNums = val}"/>

    <el-date-picker
        v-model="param.startDate"
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择开始日期">
    </el-date-picker>
    <el-date-picker
        v-model="param.endDate"
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择结束日期">
    </el-date-picker>
    <el-button @click="initK">查询</el-button>
    <div id="stock-trend-chart" style="width: 100%;height: 900px"></div>
  </div>
</template>

<script>

import {queryKLine} from "@/request/stock";
import StockSelector from "@/views/components/StockSelector";
import IndustrySelector from "@/views/components/IndustrySelector";

export default {
  name: "StockTrendEcharts",
  components: {IndustrySelector, StockSelector},
  data(){
    return {
      echarts:{},
      kChart:null,
      param:{
        industry:"",
        stockNums:"600408",
        startDate:"2023-10-01",
        endDate:new Date(),
      },
      chartsData: {
        title: {
          text: 'K线图'
        },
        tooltip:{
          trigger:'item',
          axisPointer:{
            type:'line',
            label:{
              backgroundColor:'#6a7985'
            }
          }
        },
        dataZoom:[
          {
            type:"slider"
          }
        ],
        grid: {
          left: '20px',
          right: '150px',
          bottom: '150px',
          containLabel: true
        },
        legend: {
          selector:true,
          itemWidth: 6,
          itemHeight: 6,
          width:'80%',
          bottom:40,
          data: ['a','b']
        },
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {
          scale: true,
        },
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: 'line',
            name:'a'
          },
          {
            data: [5, 4, 3, 5, 10],
            type: 'line',
            name:'b'
          },
          {
            data: [
                ['B', 30],
                ['D',20],
                ['E',20]
            ],
            type: 'line',
            name:'c'
          }
        ]
      }
    }
  },
  created(){
    this.echarts = require("echarts");
  },
  mounted(){
    var dom = document.getElementById("stock-trend-chart");
    this.kChart = this.echarts.init(dom);
    // this.kChart.setOption(this.chartsData)
    this.initK()
  },
  methods:{
    initK(){
      console.log(this.param)
      queryKLine(this.param).then((resp)=>{
        resp = resp.data;
        this.chartsData.xAxis.data = resp.xaxis;
        // this.chartsData.yAxis.min = Math.min(...(resp.series[0].data))
        resp.series.forEach(e=>{e.type='line';e.emphasis = {focus: 'series'}})
        this.chartsData.series = resp.series;
        this.chartsData.legend.data = this.chartsData.series.map(e=>e.name).sort();
        this.kChart.clear();
        this.kChart.setOption(this.chartsData)
      })
    }
  }

}
</script>

<style scoped>

</style>