<template>
  <div style="width: 100%;height: 100%; display: inline-block">
    <div style="position: absolute;z-index: 1000">
      <span>主动买入数量(大于200):{{buySize}}</span>
      <br/>
      <span>主动卖出数量(大于200):{{soldSize}}</span>
      <el-button type="mini" @click="initK">刷新</el-button>
      <el-radio v-model="priceType" label="price">价格</el-radio>
      <el-radio v-model="priceType" label="vol">成交量</el-radio>
      <el-radio v-model="priceType" label="sum_vol">成交总和</el-radio>
    </div>
    <div :id="'stock-trade-bar'+this.stockNum+(this.fixId || '')" style="width: 100%;height: 100%"></div>
  </div>
</template>

<script>
import globalFunction from "@/globalFunction";
import {tradeDetail} from "@/request/stock";

export default {
  name: "TradeDetailChart",
  props:{
    stockNum:String,
    fixId:String,
    date:String,
    preClose:Number
  },
  data(){
    return {
      priceType:'vol',
      kChart:null,
      buySize:0,
      soldSize:0,
      data:null,
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
        dataZoom:[
          {
            type:"slider"
          },
          {
            type:"inside"
          },
          {
            type:"slider",
            yAxisIndex: [0],
          }
        ],
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            scale:true,
            name: "vol",
            type: 'value',
            splitNumber: 5,
            splitLine: {
              show: true, // 不显示y轴网格线
            }
          },
          {
            scale:true,
            min:this.preClose*0.89,
            max:this.preClose*1.11,
            name: "price",
            type: 'value',
            splitNumber: 5,
            splitLine: {
              show: false, // 不显示y轴网格线
            }
          }
        ],
        series: [
          {
            yAxisIndex:0,
            name:"vol",
            data: [],
            type: 'bar',
            animation:false,
            itemStyle:{
              color:'blue'
            }
          },
          {
            yAxisIndex:1,
            name:"price",
            data: [],
            type: 'line',
            animation:false,
            itemStyle:{
              color:'blue'
            }
          },
          {
            type: 'line',
            yAxisIndex:1,
            markLine: {
              symbol: ['none', 'none'],
              data: [
                {
                  yAxis: 0,
                  lineStyle:{
                    color:'black'
                  }
                }
              ]
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
    var dom = document.getElementById('stock-trade-bar' + this.stockNum + (this.fixId || ''));
    this.kChart = this.echarts.init(dom);
    this.kChart.on("dataZoom",(event)=>{
      let start = parseInt(event.start/100*this.data.length);
      let end = parseInt(event.end/100*this.data.length);
      let d =this.data.slice(start,end);
      this.clac(d);
    })
    this.initK();
  },
  watch:{
    date(o){
      console.log("bar chart",o)
      this.initK();
    },
    stockNum(){
      this.initK();
    },
    priceType(){
      this.initK();
    }
  },
  beforeDestroy() {
    console.log("beforeDestroy")
  },
  methods:{
    initK(){
      if (!this.stockNum || !this.date){
        return;
      }
      let p = {
        stockNum:this.stockNum,
        date:this.date
      }
      tradeDetail(p).then(resp=>{
        let data = JSON.parse(resp.data.content);
        data = data.map(e=>e.split(","))
            .filter(e=>e[0]>"09:29:00")
        this.data = data;
        if (this.priceType == "vol"){
          let xAxis = data.map(e=>e[0]);
          this.options.xAxis.data = xAxis;
          this.options.series[0].data = data.map(e=>{return {
            value:e[2],
            itemStyle:{
              color:e[4] == '2' ? "#a90000" : "#11f53f"
            }
          }})
          this.options.series[1].data = data.map(e=>{return {
            value:e[1]
          }})
          this.options.series[2].markLine.data[0].yAxis=this.preClose;

          if (this.kChart.getOption() != null){
            this.options.dataZoom = this.kChart.getOption().dataZoom;
          }
          this.options.yAxis[1].min = this.preClose*0.89;
          this.options.yAxis[1].max = this.preClose*1.11;

          this.kChart.clear();
          this.kChart.setOption(this.options,false);
        } else if (this.priceType == "sum_vol") {
          let xAxis = data.map(e=>e[0]);
          this.options.xAxis.data = xAxis;
          let sum = 0;
          this.options.series[0].data = data.map(e => {
            sum += parseInt(e[2])
            return {
              value: sum,
              itemStyle: {
                color: e[4] == '2' ? "#a90000" : "#11f53f"
              }
            }
          })
          this.options.series[1].data = data.map(e=>{return {
            value:e[1]
          }})
          this.options.series[2].markLine.data[0].yAxis=this.preClose;

          if (this.kChart.getOption() != null){
            this.options.dataZoom = this.kChart.getOption().dataZoom;
          }
          this.options.yAxis[1].min = this.preClose*0.89;
          this.options.yAxis[1].max = this.preClose*1.11;

          this.kChart.clear();
          this.kChart.setOption(this.options,false);
        } else if (this.priceType == "price") {
          let priceVolMap = {};
          for(let item of data){
            if (priceVolMap[item[1]] == null){
              priceVolMap[item[1]] = 0;
            }
            priceVolMap[item[1]] += parseInt(item[2]);
          }
          let priceKeys = Object.keys(priceVolMap).sort();
          this.options.xAxis.data = priceKeys;
          this.options.series[0].data = priceKeys.map(e=>priceVolMap[e])
          this.kChart.clear();
          this.kChart.setOption(this.options,false);
        }

        this.clac(data);
      })
    },
    clac(data){
      let buy = 0;
      let sold = 0;
      const sum = data.map(e=>parseInt(e[2])).reduce((total, num) => total + num);
      let avg = sum / data.length;

      data.forEach(e=>{
        // if (parseInt(e[2])<200){
        //   return;
        // }
        if (parseInt(e[1])> this.preClose*1.09){
          return;
        }
        if (e[4] == '2'){
          buy += parseInt(e[2])*(1+parseInt(e[2])/(avg*2));
        }else{
          sold += parseInt(e[2])*(1+parseInt(e[2])/(avg*2));
        }
      })
      this.buySize = Math.floor(buy/data.length)+","+Math.floor(avg);
      this.soldSize = Math.floor(sold/data.length);
    }
  },
}
</script>

<style scoped>

</style>