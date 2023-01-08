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

      <div id="k-chart" style="width: 100%;height: 1000px; display:none1"></div>

      <el-button @click="drawLine">绘制</el-button>
      <el-button @click="clc">计算</el-button>
      <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          placeholder="请输入内容"
          v-model="param.points">
      </el-input>
      <div ><canvas id="num_canvers" width="200" height="200" style="border:#0F0 solid 1px"></canvas> </div>
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
        stockNums: "603216",
        startTime: "2022-07-01",
        endTime: "2022-09-30",
        points:''
      },
      points:[],
      kChart: {},
      numCanvas:null,
      context:null,
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
        yAxis: [{
          type: 'value',
          name: 'val',
          position: 'left',
          min:12
        },
          {
            type: 'value',
            name: 'cci',
            position: 'right',
            min:12
          }],
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
    this.kChart.setOption(this.option, true);
    this.numCanvas = document.getElementById("num_canvers");

    this.numCanvas.onmousedown = ()=>{
      this.context=this.numCanvas.getContext("2d");
      this.points = [{x:event.offsetX,y:event.offsetY}];

      //this.context.clearRect(0,0,this.numCanvas.width,this.numCanvas.height);
      this.context.beginPath()
    }
    this.numCanvas.onmousemove = ()=>{
      if (this.context == null){
        return ;
      }
      var point = this.points[this.points.length-1];
      this.context.moveTo(point.x,point.y);
      this.context.lineTo(event.offsetX,event.offsetY);
      this.context.stroke();
      // console.log("mouth move",event.offsetX,event.offsetY)
      this.points.push({x:event.offsetX,y:event.offsetY})
    }
    this.numCanvas.onmouseout =
    this.numCanvas.onmouseup = ()=>{
      if (this.context == null) return;
      this.context = null;
      let l = this.points.length;
      let step = l/20;
      let r = [];
      for (let i = 0; i <20; i++) {
        r.push(this.numCanvas.height - this.points[Math.floor(i*step)].y)
      }

      let m = {};
      for (let i = 0; i <this.points.length; i++) {
        let p = this.points[i];
        m[parseInt(p.x/10)*10] = p.y;
      }

      //r = this.fixData(r);
      console.log(JSON.stringify(r),r.length)

      r = [];
      for (const i in m) {
        r.push(this.numCanvas.height - m[i])
      }
      //r = this.fixData(r);
      console.log(JSON.stringify(r),r.length)

      let xx = [];
      let lines = this.param.points.split("\n");
      let p = lines[0].split(",");
      for (let i = 0; i < p.length; i++) {
        xx.push(parseFloat(p[i]));
      }

      let distance = 0;
      for (let i = 0; i < r.length; i++) {
        console.log(i,xx[i] - r[i],xx[i] , r[i],distance)
        distance += Math.pow(xx[i] - r[i],2)
      }
      console.log("distance:",distance)

    }
    this.init();
  },
  created() {
    this.echarts = require("echarts");
  },
  methods: {
    fixData(data){
      function MaxAndMin (arr) {
        return [Math.min.apply(null, arr), Math.max.apply(null, arr)]
      }
      let maxAndMin = MaxAndMin(data);
      let r = [];
      for (let i = 0; i < 20 && i < data.length; i++) {
        r.push((data[i] - maxAndMin[0])/(maxAndMin[1] - maxAndMin[0])*200)
      }
      return r;
    },
    clc(){
      let linesA = [];
      let lines = this.param.points.split("\n");
      for (let j = 0; j < lines.length; j++) {
        let line = lines[j];
        let xx = [];
        let p = line.split(",");
        for (let i = 1; i < p.length; i++) {
          xx.push(parseFloat(p[i]));
        }
        linesA.push(xx)
      }
      for (let i = 1; i < linesA.length; i++) {
        console.log("dddd",this.distance(linesA[0],linesA[i]))
      }
    },
    distance(l,r){
      let distance = 0;
      for (let i = 0; i < r.length; i++) {
        distance += Math.pow(l[i] - r[i],2)
      }
      return distance;
    },
    drawLine(){
      let ctx = this.numCanvas.getContext("2d");
      ctx.clearRect(0,0,this.numCanvas.width,this.numCanvas.height);
      ctx.stroke();
      let lines = this.param.points.split("\n");
      for (let j = 0; j < lines.length; j++) {
        let line = lines[j];
        let p = line.split(",");

        ctx.moveTo(10,parseInt(200-p[0]));
        for (let i = 1; i < p.length; i++) {
          ctx.lineTo(i*10,200-parseInt(p[i]));
        }
        ctx.fillText(j,180,parseInt(200-p[p.length-1]));
        ctx.stroke();
      }
    },
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
            yAxisIndex:0,
            data: line
          })
          legend.push(stock + "_close")


          this.buildMa20(data,stock,dates,legend,lines);
          this.buildMa10(data,stock,dates,legend,lines);
          this.buildVal(data,stock,dates,legend,lines);


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
        this.kChart.clear();
        this.kChart.setOption(this.option);
        console.log(dateX);
        console.log(lines);
      })
    },
    buildMa10(data,stock,dates,legend,lines){
      var line = [];
      for (let item of data[stock]) {
        line.push(item.ma10)
        dates[item.date] = "";
      }
      lines.push({
        name: stock + "_cci",
        type: 'line',
        yAxisIndex:0,
        data: line
      })
      legend.push(stock + "_cci")
    },
    buildMa20(data,stock,dates,legend,lines){
      var line = [];
      for (let item of data[stock]) {
        line.push(item.ma20)
        dates[item.date] = "";
      }
      lines.push({
        name: stock + "_cci",
        type: 'line',
        yAxisIndex:0,
        data: line
      })
      legend.push(stock + "_cci")
    },
    buildVal(data,stock,dates,legend,lines){
      var line = [];
      for (let item of data[stock]) {
        line.push(item.volume)
        dates[item.date] = "";
      }
      lines.push({
        name: stock + "_val",
        type: 'line',
        yAxisIndex:1,
        data: line
      })
      legend.push(stock + "_val")
    }
  }
}
</script>

<style>

</style>