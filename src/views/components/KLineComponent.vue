<template>
  <div id="app2">
    <div id="kline" ref='kline'></div>
  </div>
</template>

<script>
import HQChart from 'hqchart'
import $ from 'jquery'

let DefaultData = {}
DefaultData.GetKLineOption=function()
{
  const option=
      {
        Type: '历史K线图',
        Windows:
            [
              { Index: "均线" },
              { Index: "VOL" },
            ], //窗口指标
        Symbol: null,
        IsAutoUpdate: true, //是自动更新数据
        IsShowRightMenu: false, //右键菜单

        KLine:
            {
              DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
              Right: 1, //复权 0 不复权 1 前复权 2 后复权
              Period: 0, //周期 0 日线 1 周线 2 月线 3 年线
              MaxReqeustDataCount: 1000, //日线数据最近1000天
              MaxRequestMinuteDayCount: 15,    //分钟数据最近15天
              PageSize: 50, //一屏显示多少数据
              IsShowTooltip: true //是否显示K线提示信息
            },

        KLineTitle: //标题设置
            {

            },
        ExtendChart:    //扩展图形
            [
              { Name:'筹码分布', ShowType:0, IsShowX:true , ShowXCount:3, Width:230 }
            ],

        Border: //边框
            {
              Left: 1, //左边间距
              Right: 60, //右边间距
              Top: 25
            },

        Frame: //子框架设置
            [
              { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
              { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
              { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
              { SplitCount: 3, StringFormat: 0, IsShowLeftText: false }
            ],
        NetworkFilter:NetworkFilterFun
      };

  return option;
}

function NetworkFilterFun(data, callback)	//网络协议回调
{
  console.log('[NetworkFilter] data', data);
  data.PreventDefault=true;	//设置hqchart不请求数据
  switch(data.Name)
  {
    case 'MinuteChartContainer::RequestMinuteData':
      $.ajax({
        url: 'http://127.0.0.1:8018/API/Stock',
        type:"post",
        dataType: 'json',
        data:data.Request.Data,
        async:true,
        success: function (data)
        {
          console.log("mwy",data)
          if(data.code == 0){

            callback(data)
          }
        },
        error: function (request)
        {
          console.log(request.message);
        }
      });
      break;
    case 'KLineChartContainer::ReqeustHistoryMinuteData':           //分钟全量数据下载
      $.ajax({
        url: 'http://127.0.0.1:8018/API/KLine2',
        type:"post",
        dataType: 'json',
        data:data.Request.Data,
        async:true,
        success: function (data)
        {
          if(data.code == 0){
            callback(data)
          }
        },
        error: function (request)
        {
          console.log(request.message);
        }
      });
      break;
    case 'KLineChartContainer::RequestMinuteRealtimeData':          //分钟增量数据更新
      break;
    case 'KLineChartContainer::RequestHistoryData':                 //日线全量数据下载
      $.ajax({
        url: 'http://127.0.0.1:8018/API/KLine2',
        type:"post",
        dataType: 'json',
        data:data.Request.Data,
        async:true,
        success: function (data)
        {
          console.log("aaaaaaaaa",data)
          if(data.code == 0){
            console.log("aaaaaaaaa",data)
            callback(data)
          }
        },
        error: function (request)
        {
          console.log("bbbbbbbb",data)
          console.log(request.message);
        }
      });
      break;
    case 'KLineChartContainer::RequestRealtimeData':                //日线实时数据更新

      break;
  }
}

export default {
  name: "KLineComponent",
  data() {
    var data =
        {
          Symbol: '600000.sh',
          KLine:
              {
                JSChart: null,
                Option: DefaultData.GetKLineOption(),
              },

        };

    return data;

  },

  created() {

  },

  mounted() {
    this.OnSize();

    window.onresize = () => {
      this.OnSize();
    }

    this.CreateKLineChart();
  },

  methods:
      {
        OnSize() {
          var chartHeight = window.innerHeight - 30;
          var chartWidth = window.innerWidth - 30;

          var kline = this.$refs.kline;
          kline.style.width = chartWidth + 'px';
          kline.style.height = chartHeight + 'px';
          if (this.KLine.JSChart) this.KLine.JSChart.OnSize();
        },

        CreateKLineChart()  //创建K线图
        {
          if (this.KLine.JSChart) return;
          this.KLine.Option.Symbol = this.Symbol;
          let chart = HQChart.Chart.JSChart.Init(this.$refs.kline);
          chart.SetOption(this.KLine.Option);
          this.KLine.JSChart = chart;
        },

      }
}
</script>

<style scoped>

</style>