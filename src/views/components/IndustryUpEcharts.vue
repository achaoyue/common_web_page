<!-- 个行业涨跌比 -->
<template>
  <div >
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
    <el-button @click="initIndustryLine">查询</el-button>
    <div id="k-chart" style="width: 100%;height: 600px"></div>
  </div>
</template>

<script>
import {queryIndustryLine} from "@/request/stock";

export default {
  name: "IndustryUpEcharts",
  data(){
    return {
      echarts:{},
      kChart:null,
      param:{
        startDate:"2023-10-01",
        endDate:new Date(),
      },
      chartsData: {
        title: {
          text: '各行业涨跌比列走势'
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
        grid: {
          left: '20px',
          right: '150px',
          bottom: '150px',
          containLabel: true
        },
        dataZoom:[
          {
            type:"slider"
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
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: 'line',
            stack: 'x',
            name:'a'
          },
          {
            data: [5, 4, 3, 5, 10],
            type: 'line',
            stack: 'x',
            name:'b'
          }
        ]
      }
    }
  },
  created(){
    this.echarts = require("echarts");
  },
  mounted(){
    var dom = document.getElementById("k-chart");
    this.kChart = this.echarts.init(dom);
    // this.kChart.setOption(this.chartsData)
    this.initIndustryLine();
  },
  methods:{
    initIndustryLine(){
      queryIndustryLine(this.param).then((resp)=>{
        resp = resp.data;
        this.chartsData.xAxis.data = resp.xaxis;
        resp.series.forEach(e=>{e.type='line';e.emphasis = {focus: 'series'}})
        this.chartsData.series = resp.series;
        this.chartsData.legend.data = this.chartsData.series.map(e=>e.name).sort(function compareFunction(param1, param2) {
          return param1.localeCompare(param2,"zh");
        });
        this.kChart.clear();
        this.kChart.setOption(this.chartsData)
      })
    }
  }
}
</script>

<style scoped>

</style>