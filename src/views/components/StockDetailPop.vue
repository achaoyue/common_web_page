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
      </div>
      <div style="width: 50%;display: inline-block;text-align: left;vertical-align: top">
        <div>stockNum:
          <DetailLink v-if="stockDetail" :stock-num="stockDetail.stockDO.stockNum">{{ !stockDetail ? null : stockDetail.stockDO.stockNum }}</DetailLink>
          <FavoriteSpan v-if="stockDetail" :stock-num="stockDetail.stockDO.stockNum" :is-favorite="stockDetail.stockDO.isFavorite"/>
        </div>
        <div>日期:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].date }}</div>
        <div>stockName:{{ !stockDetail ? null : stockDetail.stockDO.stockName }}</div>
        <div>归宿行业:{{ !stockDetail ? null : stockDetail.stockDO.industry }}</div>
        <div>归宿板块:{{ !stockDetail ? null : stockDetail.stockDO.plate }}</div>
        <div>相关板块:{{ !stockDetail ? null : stockDetail.stockDO.belongPlate }}</div>
        <div>总市值:{{ !stockDetail ? null : formatNum(stockDetail.stockDO.totalMarketValue) }}</div>
        <div>当日涨停:{{upTop()}}</div>

        <div>换手率:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].turnOverrate }}</div>
        <div>当日涨幅:{{ !stockDetail ? null : stockDetail.stockDayInfoDOS[stockDetail.stockDayInfoDOS.length-1].upDownRange }}</div>
        <div>MACD:{{ macdInfo() }}</div>
        <div>资金流:{{ stockFundInfo() }}</div>
        <div>异动情况:{{ !stockDetail ? null : stockDetail.abnormal }}</div>
        <div>行业上涨情况:{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.topSize }}/{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.upSize }}/{{ (!stockDetail || !stockDetail.industryUpDown) ? null : stockDetail.industryUpDown.allSize }}</div>
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

export default {
  name: "StockDetailPop",
  components: {FavoriteSpan, DetailLink, StockKLine},
  data() {
    return {
      uniqueKey:null,
      show: false,
      stockDetail: null,
      startDate:null,
      endDate:null
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
  methods: {
    onCloseDialog() {
      console.log(this.show);
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
        console.log(resp);
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
      console.log(difMacd)

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
    refresh(){
      this.$refs[this.stockNum].initK();
      this.stockDetail = null;
      this.queryStockDetail();
    },
    upTop(){
      if (!this.stockDetail || !this.stockDetail.stockDayInfoDOS) {
        return "";
      }
      return this.stockDetail.stockDayInfoDOS[this.stockDetail.stockDayInfoDOS.length-1].preClose*1.1
    }
  }
}
</script>

<style scoped>

</style>