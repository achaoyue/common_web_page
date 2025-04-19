<template>
  <span>
    <span @click="clickShowDia">detail</span>
    <el-dialog
        style="text-align: left"
        width="90%"
        title="详情"
        :visible.sync="show"
        @close="onCloseDialog"
    >
      <div>
        <el-date-picker
            v-model="startDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期">
        </el-date-picker>
        <el-date-picker
            v-model="endDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期">
        </el-date-picker>
        <el-button type="mini" @click="refresh">刷新</el-button>
      </div>
      <div style="width: 50%;display: inline-block">
        <StockKLine fix-id="detailPop" :ref="stockNum" :stock-num="stockNum" :start-date="startDate || defaultStartDate" :end-date="endDate || defaultEndDate"/>
        <FundPan v-if="show" :stock-num="stockNum" :start-date="this.startDate" :end-date="this.endDate"/>
        <div style="height: 500px">
          <TradeDetailChart
              :stock-num="stockNum"
              :pre-close="!stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].preClose"
              :date="!stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].date">
          </TradeDetailChart>
        </div>
        <div style="height: 500px">
          <TradeDetailChart
              :fix-id="'2'"
              :stock-num="stockNum"
              :pre-close="!stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-2].preClose"
              :date="!stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-2].date">
          </TradeDetailChart>
        </div>
      </div>
      <div style="width: 50%;display: inline-block;text-align: left;vertical-align: top">
        <div>stockNum:
          <DetailLink v-if="stockDetail" :stock-num="stockDetail.stockDO.stockNum">{{ !stockDetail ? null : stockDetail.stockDO.stockNum }}</DetailLink>
          <FavoriteSpan v-if="stockDetail" :stock-num="stockDetail.stockDO.stockNum" :is-favorite="stockDetail.stockDO.favorite" :change="(op)=>{stockDetail.stockDO.favorite = op}"/>
          <el-button type="text" @click="()=>{noteShow = true}">笔记</el-button>
          <StockNote v-if="noteShow" :to-body="true" :stock-num="stockDetail.stockDO.stockNum" :show.sync="noteShow"/>
        </div>
        <div>日期:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].date }}</div>
        <div>stockName:{{ !stockDetail ? null : stockDetail.stockDO.stockName }}</div>
        <div>归宿行业:{{ !stockDetail ? null : stockDetail.stockDO.industry }}</div>
        <div>归宿板块:{{ !stockDetail ? null : stockDetail.stockDO.plate }}</div>
        <div>相关板块:{{ !stockDetail ? null : stockDetail.stockDO.belongPlate }}</div>
        <div>总市值:{{ !stockDetail ? null : formatNum(stockDetail.stockDO.totalMarketValue) }}</div>
        <div>当日涨停:{{upTop()}}</div>
        <div>历史涨跌次数:{{ !stockDetail ? null : stockDetail.historyUpDown.upSize }}/{{ !stockDetail ? null : stockDetail.historyUpDown.downSize }}/{{ !stockDetail ? null : stockDetail.historyUpDown.allSize }}</div>

        <div>换手率:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].turnOverrate }}</div>
        <div>当日涨幅:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].upDownRange }}</div>
        <div>MACD:{{ macdInfo() }}</div>
        <div>资金流:{{ stockFundInfo() }}, 占比: {{stockFundPer()}}</div>
        <div>异动情况:{{ !stockDetail ? null : stockDetail.abnormal }}</div>
        <div>计划价格:{{formatFavorite()}}</div>
        <div>行业上涨情况:{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.topSize }}/{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.upSize }}/{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.allSize }}</div>
        <div v-if="this.stockDetail && this.stockDetail.distribution" style="height: 200px">
          <BarChart :stock-num="stockNum" :data="{value:this.stockDetail.distribution}" />
        </div>
        <div v-if="this.stockDetail && this.stockDetail.stockDayInfoDOS" style="height: 400px">
          <LineChart :stock-num="stockNum" :data="computeOverRate"/>
        </div>
        <div v-if="this.stockDetail && this.stockDetail.upDown">
          <div><span :style="{display:'inline-block',width:this.stockDetail.upDown.upSize/10+'px',backgroundColor:'red',height:'20px'}"> </span>{{this.stockDetail.upDown.upSize}}</div>
          <div><span :style="{display:'inline-block',width:this.stockDetail.upDown.downSize/10+'px',backgroundColor:'green',height:'20px'}"> </span>{{this.stockDetail.upDown.downSize}}</div>
          <div><span :style="{display:'inline-block',width:this.stockDetail.upDown.topSize/10+'px',backgroundColor:'blue',height:'20px'}"> </span>{{this.stockDetail.upDown.topSize}}</div>
        </div>
        <div>
          <img src="http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=1.000001&UnitWidth=-6&imageType=KXL&EF=&Formula=CCI&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373"/>
          <img @click="changeTimeSpan" :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid=1.000001&timespan='+timespan"/>
        </div>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import {queryDetail} from "@/request/stock";
import moment from "moment";
import StockKLine from "@/views/components/StockKLine";
import DetailLink from "@/views/components/DetailLink";
import FavoriteSpan from "@/views/components/FavoriteSpan";
import BarChart from "@/views/components/BarChart";
import LineChart from "@/views/components/LineChart";
import TradeDetailChart from "@/views/components/TradeDetailChart";
import StockNote from "@/views/components/StockNote.vue";
import FundPan from "@/views/components/FundPan.vue";

export default {
  name: "StockDetailPop",
  components: {FundPan, StockNote, TradeDetailChart, LineChart, BarChart, FavoriteSpan, DetailLink, StockKLine},
  data() {
    return {
      noteShow:false,
      uniqueKey:null,
      show: false,
      stockDetail: null,
      startDate:null,
      endDate:null,
      timespan:Math.round(new Date().getTime()/1000)
    }
  },
  props: {
    stockNum: String,
    defaultStartDate: [Date, String],
    defaultEndDate: [Date, String],
  },
  mounted() {
    if (this.defaultStartDate){
      this.startDate = this.defaultStartDate;
    }
    if (this.defaultEndDate){
      this.endDate = this.defaultEndDate;
    }
  },
  watch: {
    stockNum() {
      this.queryStockDetail();
    },
    startDate() {
      this.queryStockDetail();
    },
    endDate() {
      this.queryStockDetail();
    },
  },
  computed:{
    computeOverRate(){
      let x = this.stockDetail.stockDayInfoDOS.map(e=>e.date);
      let y = ["-","-","-","-"];
      let y2 = ["-","-","-","-"];
      let y3 = ["-","-","-","-","-","-","-","-","-"];
      for (let i = 4; i < this.stockDetail.stockDayInfoDOS.length; i++) {
        y.push(this.stockDetail.stockDayInfoDOS[i - 4].turnOverrate
            + this.stockDetail.stockDayInfoDOS[i - 3].turnOverrate
            + this.stockDetail.stockDayInfoDOS[i - 2].turnOverrate
            + this.stockDetail.stockDayInfoDOS[i - 1].turnOverrate
            + this.stockDetail.stockDayInfoDOS[i].turnOverrate);
        y2.push(this.stockDetail.stockDayInfoDOS[i].turnOverrate)
        if (i-9 >= 0){
          y3.push(this.stockDetail.stockDayInfoDOS[i - 9].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 8].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 7].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 6].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 5].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 4].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 3].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 2].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i - 1].turnOverrate
              + this.stockDetail.stockDayInfoDOS[i].turnOverrate);
        }
      }
      return {
        x:x,
        y:[y,y2,y3]
      }
    }
  },
  methods: {
    changeTimeSpan(){
      this.timespan = Math.round(new Date().getTime()/1000);
    },
    onCloseDialog() {
    },
    clickShowDia() {
      this.show = true;
      this.queryStockDetail();
    },
    queryStockDetail() {
      //请求不合法或已经查询数据，直接返回
      if (!(this.stockNum && (this.startDate || this.defaultStartDate) && (this.endDate || this.defaultEndDate) && this.show)) {
        return;
      }
      if (!this.stockNum) {
        this.stockDetail = null;
        return;
      }

      let uk = this.stockNum+"-"+(this.startDate || this.defaultStartDate)
      +"-"+(this.endDate || this.defaultEndDate);
      if (this.uniqueKey == uk) {
        return;
      }
      let param = {
        stockNum: this.stockNum,
        startDate: moment(this.startDate || this.defaultStartDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate || this.defaultEndDate).format("YYYY-MM-DD"),
      }
      queryDetail(param).then((resp) => {
        this.stockDetail = resp.data;
      })
    },
    macdInfo() {
      if (!this.stockDetail || !this.stockDetail.stockDayInfoDOS) {
        return "";
      }
      let str = "";
      let size = this.stockDetail.stockDayInfoDOS.length;
      let difMacd = parseInt((this.stockDetail.stockDayInfoDOS[size - 1].macd - this.stockDetail.stockDayInfoDOS[size - 2].macd) * 100)
      str += difMacd > 0 ? "macd上涨" : "macd下降z";
      str += difMacd;

      return str;
    },
    stockFundInfo(){
      if (!this.stockDetail || !this.stockDetail.fundInfoDO) {
        return "";
      }
      let fundInfo = this.stockDetail.fundInfoDO;
       let superBigMoney = fundInfo.superBigMoneyIn - fundInfo.superBigMoneyOut;
       if (superBigMoney > 0){
         return "资金流入"+superBigMoney/10000
       }
       return "资金流出" + superBigMoney/10000
    },
    stockFundPer(){
      if (!this.stockDetail || !this.stockDetail.fundInfoDO) {
        return "";
      }
      let fundInfo = this.stockDetail.fundInfoDO;
      let superBigMoney = fundInfo.superBigMoneyIn - fundInfo.superBigMoneyOut;
      return (superBigMoney/this.stockDetail.stockDO.flowMarketValue*100).toFixed(2)
    },
    refresh(){
      this.$refs[this.stockNum].initK();
      this.stockDetail = null;
      this.queryStockDetail();
    },
    upTop(){
      if (!this.stockDetail || !this.stockDetail.stockDayInfoDOS) {
        return "";
      }
      return Math.round(this.stockDetail.stockDayInfoDOS[this.stockDetail.stockDayInfoDOS.length-1].preClose*1.1*100)/100
    },
    formatFavorite(){
      if (!this.stockDetail || !this.stockDetail.stockDO) {
        return "";
      }
      let attr =  JSON.parse(this.stockDetail.stockDO.attribute);
      if (attr == null){
        return "";
      }
      return ""+"("+attr.minPrice+"-"+attr.maxPrice+")";
    },
  }
}
</script>

<style scoped>

</style>