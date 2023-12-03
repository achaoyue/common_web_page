<!-- 股票K线 -->
<template>
  <div style="width: 100%;display: inline-block">
    <div :id="'stock-k-line'+this.stockNum" style="width: 100%;height: 800px"></div>
  </div>
</template>

<script>
import {queryDayLine} from "@/request/stock";

var upColor = '#ec0000';//红涨
var downColor = '#00da3c';//绿跌
export default {
  name: "StockKLine",

  props: {
    stockNum: String,
    startDate: [Date, String],
    endDate: [Date, String],
    withZoom:Boolean
  },
  data() {
    return {
      echarts: {},
      kChart: null,
      param: {},
      chartsData: {
        title: {
          text: this.stockNum
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
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
            left: '80px',
            right: '50px',
            height: '40%',
            containLabel: false
          },
          {
            left: '80px',
            right: '50px',
            top: '50%',
            height: '10%',
            containLabel: false
          },
          {
            left: '80px',
            right: '50px',
            top: '60%',
            height: '10%',
            containLabel: false
          },
          {
            left: '80px',
            right: '50px',
            top: '72%',
            height: '10%',
            containLabel: false
          },
          {
            left: '80px',
            right: '50px',
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
            gridIndex: 4
          },
        ]
      }
    }
  },
  created() {
    this.echarts = require("echarts");
  },
  mounted() {
    var dom = document.getElementById('stock-k-line' + this.stockNum);
    this.kChart = this.echarts.init(dom);
    // this.kChart.setOption(this.chartsData)
    this.initK()
  },
  watch: {
    stockNum(oV, nV) {
      this.initK();
    }
  },
  methods: {
    initK() {
      if (!this.stockNum) {
        return;
      }
      this.param = {
        stockNum: this.stockNum,
        startDate: this.startDate,
        endDate: this.endDate
      }
      queryDayLine(this.param).then((resp) => {
        resp = resp.data;
        let xAsis = resp.map(e => e.date);
        this.chartsData.xAxis = [
          {
            scale: true,
            type: 'category',
            data: xAsis,
            axisLabel: {show: false},
            axisLine: {show: true},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 1,
            axisLabel: {show: false},
            axisLine: {show: true},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 2,
            axisLabel: {show: false},
            axisLine: {show: true},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 3,
            axisLabel: {show: false},
            axisLine: {show: true},
            axisTick: {show: false},
            splitLine: {show: false}
          },
          {
            scale: true,
            type: 'category',
            data: xAsis,
            gridIndex: 4,
            axisLine: {show: true},
          }
        ]

        let kData = resp.map(e => [e.open, e.close, e.low, e.high])
        let cciData = resp.map(e => e.cci)
        let macdData = resp.map(e => [e.date, e.macd, e.macd > 0 ? -1 : 1])
        let volData = resp.map(e => [e.date, e.volume])
        let markData = resp.map(e => e.close).sort((x, y) => x - y);
        console.log(markData)
        let idxUp = Math.round(markData.length * 0.9);
        let idxDown = Math.round(markData.length * 0.1);

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
                opacity: 0.5
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
                  }
                ]
              }
            }, {
              name: 'K',
              type: 'line',
              data: d1,
              smooth: true,
              lineStyle: {
                opacity: 0.2
              },
              showSymbol: false
            }, {
              name: 'K',
              type: 'line',
              data: d2,
              smooth: true,
              lineStyle: {
                opacity: 0.2
              },
              showSymbol: false
            }, {
              name: 'K',
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