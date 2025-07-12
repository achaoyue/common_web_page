<template>
  <div>
    <div v-if="type != 'NEW'" class="imgDiv" style="position: relative">
      <FundPan v-if="type == 'FUND'" :stock-num="stockNum"
               :start-date="defaultStart || start"
               :end-date="defaultEnd || end"/>
      <div v-else-if="type == 'TRADE'" style="height: 500px">
        <TradeDetailChart

            :fix-id="'img'"
            :stock-num="stockNum"
            :date="nowDate">
        </TradeDetailChart>
      </div>
      <DayMinuteTradePan v-else-if="type == 'MINUTE'" :stock-num="stockNum"
                          :start-date="defaultStart || start"
                          :end-date="defaultEnd || end"/>
      <img v-else-if="type != 'FUND'" @mousemove="mouthMove()" @mouseout="mouseOut" width="100%" :src="getSrc"/>
      <div v-if="rightX != null" class="pp" :style="{right: rightX+'px'}">
      </div>
      <div class="pp ppx" :style="{left: (ppx||opPpx)+'px'}">
      </div>
      <div class="idx_op">
        <span @click="changeImg('MACD')">macd</span>
        <span @click="changeImg('KDJ')">kdj</span>
        <span @click="changeImg('CCI')">cci</span>
        <span @click="changeImg('TIME')">time</span>
        <span @click="changeImg('FIVE')">five</span>
        <span @click="changeImg('NEW')">NEW</span>
        <span @click="changeImg('FUND')">FUND</span>
        <span @click="changeImg('MINUTE')">MINUTE</span>
        <span @click="changeImg('TRADE')">TRADE</span>
        <DetailLink :stock-num="stockNum">详情</DetailLink>
        <FavoriteSpan :stock-num="stockNum" :is-favorite="opFavorite" :change="(op)=>{this.opFavorite = op}"/>
        <StockDetailPop
            :key="stockNum+'_detail_pop'"
            :stock-num="stockNum"
            :default-start-date="defaultStart || start"
            :default-end-date="defaultEnd || end" />
        <span @click="()=>{this.noteShow=true}">笔记</span>
      </div>
    </div>
    <div v-if="type == 'NEW'">
      <StockKLine
          :fix-id="'stockImg'"
          :stock-num="stockNum"
          :start-date="defaultStart || start"
          :end-date="defaultEnd || end"/>
      <div class="idx_op">
        <span @click="changeImg('MACD')">macd</span>
        <span @click="changeImg('KDJ')">kdj</span>
        <span @click="changeImg('CCI')">cci</span>
        <span @click="changeImg('TIME')">time</span>
        <span @click="changeImg('FIVE')">five</span>
        <span @click="changeImg('NEW')">NEW</span>
        <span @click="changeImg('FUND')">FUND</span>
        <span><a target="_blank" :href="'http://quote.eastmoney.com/concept/'+getStockNum2()+'.html#'">详情</a></span>
        <FavoriteSpan :stock-num="stockNum" :is-favorite="opFavorite" :change="(op)=>{this.opFavorite = op}"/>
        <StockDetailPop
            :key="stockNum+'_detail_pop'"
            :stock-num="stockNum"
            :default-start-date="defaultStart || start"
            :default-end-date="defaultEnd || end" />
        <span @click="()=>{this.noteShow=true}">笔记</span>
      </div>
    </div>
    <StockNote v-if="noteShow" :stock-num="stockNum" :show.sync="noteShow"/>
  </div>
</template>

<script>
import FavoriteSpan from "@/views/components/FavoriteSpan";
import StockDetailPop from "@/views/components/StockDetailPop";
import moment from "moment";
import StockKLine from "@/views/components/StockKLine";
import globalFunction from "@/globalFunction";
import DetailLink from "@/views/components/DetailLink";
import StockNote from "@/views/components/StockNote.vue";
import FundPan from "@/views/components/FundPan.vue";
import DayMinuteTradePan from "@/views/components/DayMinuteTradePan.vue";
import TradeDetailChart from "@/views/components/TradeDetailChart.vue";

export default {
  name: "StockImg",
  components: {
    TradeDetailChart,
    DayMinuteTradePan, FundPan, StockNote, DetailLink, StockKLine, StockDetailPop, FavoriteSpan},
  props: {
    stockNum: String,
    rightX: Number,
    ppx: Number,
    favorite: String,
    mouseMoveNotice: Function,
    allType: null,
    defaultStart:String,
    defaultEnd:String,
    nowDate:String
  },
  data() {
    return {
      noteShow:false,
      opPpx: 0,
      type: 'MACD',
      opFavorite: null,
      start:moment().subtract(90, "days").format("YYYY-MM-DD"),
      end:moment().format("YYYY-MM-DD")
    }
  },
  watch: {
    allType(nVal) {
      if (!nVal) {
        return;
      }
      this.type = nVal;

    }
  },
  mounted() {
    if (this.allType){
      this.type = this.allType;
    }
    this.opFavorite = this.favorite;
  },
  computed:{
    getSrc() {
      if (["MACD", "CCI", "KDJ"].indexOf(this.type) > -1) {
        return 'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=' + this.getStockNum() + '&UnitWidth=-6&imageType=KXL&EF=&Formula=' + (this.type) + '&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_='+Math.random();
      } else if ("TIME" == this.type) {
        return 'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid=' + this.getStockNum() + '&timespan='+Math.round(moment().valueOf()/1000);
      }else if ("FIVE" == this.type) {
        return 'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid='+this.getStockNum()+ '&timespan='+Math.round(moment().valueOf()/1000);
      }

    }
  },
  methods: {
    mouthMove() {
      this.opPpx = event.offsetX - 3;
      if (this.mouseMoveNotice != null && this.mouseMoveNotice instanceof Function) {
        this.mouseMoveNotice(event.offsetX - 3);
      }
    },
    mouseOut() {

    },

    getStockNum() {
      if (this.stockNum.startsWith("BK")){
        return "90." + this.stockNum;
      }else if (this.stockNum.startsWith("6")) {
        return "1." + this.stockNum;
      } else if (this.stockNum.startsWith("3")) {
        return "0." + this.stockNum;
      } else if (this.stockNum.startsWith("0")) {
        return "0." + this.stockNum;
      } else {
        return "0." + this.stockNum;
      }
    },
    getStockNum2() {
      if (this.stockNum.startsWith("6")) {
        return "sh" + this.stockNum;
      } else {
        return "sz" + this.stockNum;
      }
    },
    changeImg(type) {
      this.type = type;
    }
  }
}
</script>

<style scoped>
.imgDiv {
  display: inline-block;
  width: 100%;
}

.imgDiv img {
  vertical-align: top;
}

.pp {
  margin-right: 8px;
  float: right;
  position: absolute;
  width: 1px;
  height: 80%;
  bottom: 50px;
  border-left: 3px solid #0000ff24;
}

.ppx {
  height: 100%;
  bottom: 0px;
  border-left: 1px solid #0000ff6b;
}

.idx_op {
  background-color: white;
  padding: 10px 0 0 10px;
  word-wrap: normal;
  word-break: break-all;
  white-space: normal;
}

.idx_op span {
  background-color: #f3d6d6;
  border-radius: 3px;
  margin: 1px 3px 0px;
  padding: 0px 3px 0px;
}
</style>