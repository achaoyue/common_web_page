<template>
  <div>
      <div v-for="item in noticeData" class="noticeImg" @mouseover="mouthMove(item.stockNum)" :key="item.stockNum">
        <div>{{item.stockName}},{{item.noticeCount}},{{item.sendLog.substr(8,20)}}</div>
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
export default {
  name: "NoticeHistory",
  components:{
    StockPop
  },
  data(){
     return {
        noticeData:[],
       selectStockNum:'',
       type:"CCI"
     }
  },
  mounted() {
    let p = {day:"2023-03-07"}
    getNoticeList(p).then(resp=>{
      console.log(resp.data)
      this.noticeData = resp.data;
    })
  },
  methods:{
    mouthMove(stockNum){
      console.log(stockNum)
      this.selectStockNum = stockNum;
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
  width: 185px;
}
</style>