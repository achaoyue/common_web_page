<template>
  <div>
    <div style="width: 100%">
      <span>
        <el-button @click="init">测试</el-button>
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            placeholder="请输入内容"
            v-model="param.stockNums">
        </el-input>
      </span>

      <div id="k-chart" style="width: 100%;height: 1000px"></div>
    </div>
  </div>
</template>

<script>
import {
  getDayInfoList
} from '@/request/stock.js'
import moment from "moment";

export default {
  data() {
    return {
      param: {
        stockNums: ["603216", "603215", "002508"],
        startTime: "2022-07-01",
        endTime: "2022-09-30"
      },
      kChart: {},
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  mounted() {
    var dom = document.getElementById("k-chart");
    this.kChart = this.echarts.init(dom);
    this.kChart.setOption(this.option, true)
    this.init();
  },
  created() {
    this.echarts = require("echarts");
  },
  methods: {
    init() {
      getDayInfoList(this.param).then(resp => {
        var lines = [];
        var dates = {};
        var legend = [];
        var data = resp.data;
        for (let stock in data) {
          var line = [];
          for (let item of data[stock]) {
            line.push(item.close)
            dates[item.date] = "";
          }
          lines.push({
            name: stock + "_close",
            type: 'line',
            data: line
          })
          legend.push(stock + "_close")

          // line = [];
          // for (let item of data[stock]) {
          //   line.push(item.upDownRange*10  + 10)
          //   dates[item.date] = "";
          // }
          // lines.push({
          //   name: stock + "_upDown",
          //   type: 'line',
          //   data: line
          // })
          // legend.push(stock + "_upDown")


          // line = [];
          // for (let item of data[stock]) {
          //   line.push(item.low)
          //   dates[item.date] = "";
          // }
          // lines.push({
          //   name: stock + "_low",
          //   type: 'line',
          //   data: line
          // })
          // legend.push(stock + "_low")
          //
          // line = [];
          // for (let item of data[stock]) {
          //   line.push(item.high)
          //   dates[item.date] = "";
          // }
          // lines.push({
          //   name: stock + "_high",
          //   type: 'line',
          //   data: line
          // })
          // legend.push(stock + "_high")
        }
        var dateX = [];
        for (let item in dates) {
          dateX.push(item)
        }
        dateX.sort()
        this.option.xAxis.data = dateX;
        this.option.series = lines;
        this.option.legend.data = legend;
        this.kChart.setOption(this.option)
        console.log(dateX);
        console.log(lines);
      })
    }
  }
}
</script>

<style>

</style>