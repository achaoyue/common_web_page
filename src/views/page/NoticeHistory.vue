<!-- 历史通知列表 -->
<template>
  <div>
    <div>
      <el-date-picker
          v-model="noticeDay"
          type="date"
          @change="changeNoticeDay()"
          format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
      <el-radio-group v-model="type">
        <el-radio-button label="MACD"></el-radio-button>
        <el-radio-button label="KDJ"></el-radio-button>
        <el-radio-button label="CCI"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-for="item in noticeData" class="noticeImg" @mouseover="mouthMove(item.stockNum)" :key="item.stockNum">
      <div>{{item.stockName}},{{item.noticeCount}},{{item.sendLog.substr(8,20)}}
        <span><a target="_blank" :href="'http://quote.eastmoney.com/concept/'+getStockNum2(item)+'.html#'">详情</a></span>
        <FavoriteSpan :stock-num="item.stockNum" :is-favorite="'N'" :change="(op)=>{}"/>
        <StockDetailPop
            :key="item.stockNum+'_detail_pop'"
            :stock-num="item.stockNum"
            :default-start-date="defaultStart"
            :default-end-date="defaultEnd" />
      </div>
<!--        <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid='+getStockNum(item)+'&timespan=1672321137'"/>-->
      <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid='+getStockNum(item)+'&timespan=1672584931'"/>
      <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(item)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
    </div>

    <StockPop v-if="selectStockNum != ''" :stockNum="selectStockNum" :type="'CCI'" />
  </div>
</template>

<script>
import {
  getNoticeList
} from '@/request/stock.js'
import StockPop from "@/views/components/StockPop";
import FavoriteSpan from "@/views/components/FavoriteSpan";
import moment from "moment/moment";
import StockDetailPop from "@/views/components/StockDetailPop";
export default {
  name: "NoticeHistory",
  components:{
    StockDetailPop,
    StockPop,
    FavoriteSpan
  },
  data(){
     return {
       noticeDay:new Date(),
        noticeData:[],
       selectStockNum:'',
       type:"CCI",
       defaultStart:moment().subtract(60, "days").format("YYYY-MM-DD"),
       defaultEnd:moment().format("YYYY-MM-DD")
     }
  },
  mounted() {
    this.changeNoticeDay();
  },
  methods:{
    mouthMove(stockNum){
      this.selectStockNum = stockNum;
    },
    changeNoticeDay(){
      let p = {day:moment(this.noticeDay).format("YYYY-MM-DD")}
      getNoticeList(p).then(resp=>{
        this.noticeData = resp.data;
      })
    },
    getStockNum2(stock){
      if (stock.stockNum.startsWith("6")){
        return "sh"+stock.stockNum;
      }else {
        return "sz"+stock.stockNum;
      }
    },
    getStockNum(stock){
      if (stock.stockNum.startsWith("6")){
        return "1."+stock.stockNum;
      }else if (stock.stockNum.startsWith("3")){
        return "0."+stock.stockNum;
      }else if (stock.stockNum.startsWith("0")){
        return "0."+stock.stockNum;
      }else {
        return "0."+stock.stockNum;
      }
    }
  }
}
</script>

<style scoped>
.noticeImg{
  display: inline-block;
  border: #66b1ff solid 1px;
}
.noticeImg img{
  width: 300px;
}
</style>