<!-- 股票K线 -->
<template>
  <div style="width: 100%;display: inline-block">
    <div :id="'stock-k-line'+this.stockNum+(this.fixId || '')" style="width: 100%;height: 800px"></div>
  </div>
</template>

<script>
import {queryDayLine} from "@/request/stock";
import globalFunction from "@/globalFunction";

var upColor = '#ec0000';//红涨
var downColor = '#00da3c';//绿跌
export default {
  name: "StockKLine",

  props: {
    fixId:String,
    stockNum: String,
    startDate: [Date, String],
    endDate: [Date, String],
    withZoom:Boolean
  },
  data() {
    return {
      uniqueKey:"",
      echarts: {},
      kChart: null,
      param: {},
      dayInfos: {},
      chartsData: {
        title: {
          text: this.stockNum
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              // 重点配置：确保标签显示在Y轴上
              show: true,
              precision: 2, // 小数位数
              formatter: function(params) {
                if (!params || !params.value){
                  return 0;
                }
                if (params.axisDimension === 'y'){
                  return params.value.toFixed(2)
                }
                // 只显示Y轴值
                return params.value
              },
              // 让标签跟随Y轴
              margin: 3,
              backgroundColor: '#333',
              color: '#fff',
              // 只显示Y轴的标签
              showContent: false
            }
          },
          formatter: (params) => {
            if (this.dayInfos == null){
              return "数据不存在"
            }
            let dayInfo = this.dayInfos[params[0].name];
            return "<div style='text-align: left'>日期:"+dayInfo.date
                +'<br/>open:'+dayInfo.open
                +'<br/>close:'+dayInfo.close
                +'<br/>low:'+dayInfo.low
                +'<br/>high:'+dayInfo.high
                +'<br/>cci:'+dayInfo.cci
                +'<br/>macd:'+dayInfo.macd
                +'<br/>vol:'+dayInfo.volume
                +'<br/>换手:'+dayInfo.turnOverrate
                +'<br/>updown:'+dayInfo.upDownRange +'</div>';
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            xAxisIndex: [0, 1, 2, 3, 4]
          },
          {
            show: true,
            type: 'slider',
            top: '95%',
            start: 0,
            end: 100,
            height: 20,
            xAxisIndex: [0, 1, 2, 3, 4]
          }
        ],
        axisPointer: {
          link: {xAxisIndex: 'all'},//整体划过还是单个划过
          label: {
            backgroundColor: '#777'
          }
        },
        visualMap: [{//视觉映射组，就是将数据映射到视觉元素
          show: false,
          seriesIndex: 7,//指定取哪个系列的数据，第几个图形的数据，从0开始，1代表的是成交量的柱状图
          pieces: [{//自定义『分段式视觉映射组件』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
            value: 1,//value值为1则用downColor颜色的样式
            color: downColor
          }, {
            value: -1,
            color: upColor
          }]
        }],
        grid: [
          {
            left: '50px',
            right: '0px',
            height: '40%',
            containLabel: false
          },
          {
            left: '50px',
            right: '0px',
            top: '50%',
            height: '10%',
            containLabel: false
          },
          {
            left: '50px',
            right: '0px',
            top: '60%',
            height: '10%',
            containLabel: false
          },
          {
            left: '50px',
            right: '0px',
            top: '72%',
            height: '10%',
            containLabel: false
          },
          {
            left: '50px',
            right: '0px',
            top: '85%',
            height: '10%',
            containLabel: false
          }
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true
            },
            gridIndex: 0
          },
          {
            scale: true,
            splitArea: {
              show: true
            },
            gridIndex: 1
          },
          {
            scale: true,
            splitArea: {
              show: true
            },
            gridIndex: 2
          },
          {
            scale: true,
            splitArea: {
              show: true
            },
            gridIndex: 3
          },
          {
            scale: true,
            splitArea: {
              show: true
            },
            gridIndex: 4,
            axisLabel: {
              // 使用 formatter 函数格式化标签文本
              formatter: function(value) {

                return globalFunction.formatNum(value,0); // 保留两位小数
              }
            }
          },
        ]
      }
    }
  },
  created() {
    this.echarts = require("echarts");
  },
  mounted() {
    var dom = document.getElementById('stock-k-line' + this.stockNum + (this.fixId || ''));
    this.kChart = this.echarts.init(dom);
    // this.kChart.setOption(this.chartsData)
    this.initK()
  },
  watch: {
    stockNum() {
      this.initK();
    },
    startDate(){
      this.initK();
    },
    endDate(){
      this.initK();
    }
  },
  methods: {
    initK() {
      if (!this.stockNum) {
        return;
      }
      let uk = this.stockNum+"-"+this.startDate+"-"+this.endDate;
      if (uk == this.uniqueKey){
        return;
      }else {
        this.uniqueKey = uk;
      }
      this.param = {
        stockNum: this.stockNum,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.kChart.clear();
      queryDayLine(this.param).then((resp) => {
        resp = resp.data;
        this.dayInfos = globalFunction.toMap(resp,"date");
        let xAsis = resp.map(e => e.date);
        this.chartsData.xAxis = [
          {
            scale: true,
            type: 'category',
            data: xAsis,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 1,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 3,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 4,
            axisLine: {show: false},
          }
        ]

        let kData = resp.map(e => [e.open, e.close, e.low, e.high])
        let cciData = resp.map(e => e.cci)
        let macdData = resp.map(e => [e.date, e.macd, e.macd > 0 ? -1 : 1])
        let volData = resp.map(e => [e.date, e.volume])
        let markData = resp.map(e => e.close).sort((x, y) => x - y);
        let idxUp = Math.round(markData.length * 0.9);
        let idxDown = Math.round(markData.length * 0.1);
        let goodSplitPrice = markData[markData.length-1] - (markData[markData.length-1]-markData[0])*0.618
        console.log(goodSplitPrice)

        let d1 = [];
        let d2 = [];
        let d3 = [];
        let tempD = [];
        for (let idx in resp) {
          tempD.push(resp[idx].close)
          if (tempD.length > 30) {
            tempD.shift();
          }
          let arr = [...tempD]
          arr.sort((x, y) => x - y);
          d1.push(arr[Math.floor(arr.length * 0.1)])
          d3.push(arr[Math.floor(arr.length * 0.2)])
          d2.push(arr[Math.floor(arr.length * 0.9)])
        }

        this.chartsData.series = [];
        this.chartsData.series.push({
              name: 'K',
              type: 'candlestick',
              data: kData,
              smooth: true,
              showSymbol: false
            }, {
              name: 'MA5',
              type: 'line',
              show: false,
              data: calculateMA(kData, 5),
              smooth: true,
              showSymbol: false,
              lineStyle: {
                opacity: 0.5
              }
            }, {
              name: 'MA13',
              type: 'line',
              data: calculateMA(kData, 13),
              smooth: true,
              showSymbol: false,
              lineStyle: {
                opacity: 1
              }
            },
            {

              name: 'j',
              type: 'line',
              data: resp.map(e => e.j),
              // smooth: true,
              lineStyle: {
                opacity: 0.5
              },
              showSymbol: false,
              xAxisIndex: 1,
              yAxisIndex: 1,
            }, {

              name: 'k',
              type: 'line',
              data: resp.map(e => e.k),
              // smooth: true,
              lineStyle: {
                opacity: 0.5
              },
              showSymbol: false,
              xAxisIndex: 1,
              yAxisIndex: 1,
            }, {

              name: 'd',
              type: 'line',
              data: resp.map(e => e.d),
              // smooth: true,
              lineStyle: {
                opacity: 0.5
              },
              showSymbol: false,
              xAxisIndex: 1,
              yAxisIndex: 1,
            },
            {

              name: 'cci',
              type: 'line',
              data: cciData,
              // smooth: true,
              lineStyle: {
                opacity: 0.5
              },
              showSymbol: false,
              xAxisIndex: 2,
              yAxisIndex: 2,
            },
            {
              name: 'macd',
              type: 'bar',
              data: macdData,
              lineStyle: {
                opacity: 0.5
              },
              xAxisIndex: 3,
              yAxisIndex: 3,
            }, {
              name: 'vol',
              type: 'bar',
              data: volData,
              lineStyle: {
                opacity: 0.5
              },
              xAxisIndex: 4,
              yAxisIndex: 4,
            }, {
              type: 'line',
              markLine: {
                symbol: ['none', 'none'],
                data: [
                  {
                    yAxis: markData[idxUp]
                  },
                  {
                    yAxis: markData[idxDown]
                  },{
                    yAxis: goodSplitPrice,
                    lineStyle:{
                      color:'black'
                    }
                  }
                ]
              }
            }, {
              name: '10%',
              type: 'line',
              data: d1,
              smooth: true,
              lineStyle: {
                opacity: 0.2
              },
              showSymbol: false
            }, {
              name: '90%',
              type: 'line',
              data: d2,
              smooth: true,
              lineStyle: {
                opacity: 0.2
              },
              showSymbol: false
            }, {
              name: '20%',
              type: 'line',
              data: d3,
              smooth: true,
              lineStyle: {
                opacity: 0.2
              },
              showSymbol: false
            })
        // this.chartsData.legend.data = this.chartsData.series.map(e=>e.name);
        if (this.withZoom === false){
          this.chartsData.dataZoom = []
        }
        this.kChart.clear();
        this.kChart.setOption(this.chartsData)
      })
    }
  }

}

function calculateMA(data0, dayCount) {
  var result = [];
  for (var i = 0, len = data0.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += +data0[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

</script>

<style scoped>

</style>