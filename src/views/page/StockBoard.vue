<!-- 股票大盘 -->
<template>
  <div class="board">
    <h2>总涨跌情况:</h2>
    <div class="">
      <img @click="changeType" src="https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid=1.000001&timespan=1672321137"/>
      <img @click="changeType" src="https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid=1.000001&timespan=1672584931"/>
      <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=1.000001&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
    </div>
    <div>
      <span :style="{display:'block',width:this.board.upSize/10+'px',backgroundColor:'red'}">{{this.board.upSize}}</span>
      <span :style="{display:'block',width:this.board.downSize/10+'px',backgroundColor:'green'}">{{this.board.downSize}}</span>
      <span :style="{display:'block',width:this.board.topSize/10+'px',backgroundColor:'blue'}">{{this.board.topSize}}</span>
    </div>
    <div>
      <el-date-picker
          v-model="date"
          type="date"
          @change="init()"
          format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="各行业涨跌情况" name="first">
        <div>
          <span class="industry-item" v-for="(val) in this.board.industryUpDown" :key="val.industry">
            <span>{{val.industry}}</span> 上涨:{{val.upSize}},下跌:{{val.downSize}},涨停：<span :style="{backgroundColor:'white', color:val.topSize>0?'red':'white'}">{{val.topSize}}</span>
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收藏" name="second">
        <span class="stock-img favorite_stock" v-for="(val) in this.board.favoriteStockList" :key="val.stockNum+'F'">
      <div>
        <span @click="copyNum(val.stockNum)">{{val.stockName}}</span> {{val.industry}} {{val.upDownRange}}
        <FavoriteSpan :stock-num="val.stockNum" :is-favorite="val.favorite" :change="(op)=>{changeFavorite(val,op)}"/>
        <img @click="changeType"  @mousemove="mouseOver(val.stockNum)" @mouseout="mouseOut" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <div class="pp ppx" :style="{left: ppx+'px'}"></div>
        <div class="pp" :style="{right: getRightPx(val)+'px'}"></div>
      </div>
      </span>
      </el-tab-pane>
      <el-tab-pane label="各行业龙头" name="third">
        <div class="stock-img val_top_stock" v-for="(val,key) in this.board.industryTopMap" :key="key+'T'">
          <div>
            行业:{{key}} 股票:<span @click="copyNum(val.stockNum)">{{val.stockName}}</span>,{{val.upDownRange}}
            <FavoriteSpan :stock-num="val.stockNum" :is-favorite="val.favorite" :change="(op)=>{changeFavorite(val,op)}"/>
            <img @mousemove="mouseOver(val.stockNum)" @mouseout="mouseOut" @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
            <div class="pp ppx" :style="{left: ppx+'px'}"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="涨幅榜" name="fourth">
        <h2></h2>
        <span class="stock-img range_top_stock" v-for="(val) in this.board.topUpStockList" :key="val.stockNum+'H'">
      <div>
        <span @click="copyNum(val.stockNum)">{{val.stockName}}</span> {{val.industry}} {{val.upDownRange}}
        <FavoriteSpan :stock-num="val.stockNum" :is-favorite="val.favorite" :change="(op)=>{changeFavorite(val,op)}"/>
        <img @click="changeType" @mousemove="mouseOver(val.stockNum)" @mouseout="mouseOut"  :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <div class="pp ppx" :style="{left: ppx+'px'}"></div>
        <div class="pp ppx" :style="{right: ppfix+'px'}"></div>
      </div>
    </span>
      </el-tab-pane>
      <el-tab-pane label="跌幅榜" name="five">
        <span class="stock-img range_down_stock" v-for="(val) in this.board.topDownStockList" :key="val.stockNum+'L'">
      <div>
        <span @click="copyNum(val.stockNum)">{{val.stockName}}</span> {{val.industry}} {{val.upDownRange}}
        <FavoriteSpan :stock-num="val.stockNum" :is-favorite="val.favorite" :change="(op)=>{changeFavorite(val,op)}"/>
        <img @click="changeType"  @mousemove="mouseOver(val.stockNum)" @mouseout="mouseOut" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <div class="pp ppx" :style="{left: ppx+'px'}"></div>
        <div class="pp ppx" :style="{right: ppfix+'px'}"></div>
      </div>
    </span>
      </el-tab-pane>
    </el-tabs>
    <!--    <div v-if="selectStockNum != ''" class="pop-span">-->
    <!--      <img @click="changeType" :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672321137'"/>-->
    <!--      <img @click="changeType" :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672584931'"/>-->
    <!--      <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>-->
    <!--    </div>-->
    <StockPop v-if="selectStockNum != ''" :stockNum="selectStockNum" :type="type" />
    <IndustryUpEcharts/>
  </div>
</template>
<script>
import {
  getDataBoard,
    getDayInfoList
} from '@/request/stock.js'
import StockPop from "@/views/components/StockPop";
import FavoriteSpan from "@/views/components/FavoriteSpan";
import moment from "moment/moment";
import IndustryUpEcharts from "@/views/components/IndustryUpEcharts";
export default {
  data(){
    return {
      ppx:1,
      ppfix:1,
      type:"CCI",
      activeName:'first',
      date:new Date(),
      board:{
        upSize:0,
        downSize:0,
        industryUpDown:[],
        industryTopMap:{},
        topUpStockList:[],
        topDownStockList:[]
      },
      selectStockNum:'',
      tradeDays:[]
    }
  },
  components:{
    IndustryUpEcharts,
    FavoriteSpan,
    StockPop
  },
  mounted() {
    this.init();
    this.initTradeDays();
  },
  created() {

  },
  watch:{

  },
  methods:{
    init(){
      let p = {date:moment(this.date).format("YYYY-MM-DD")}
      getDataBoard(p).then((resp)=>{
        this.board = resp.data;
      })

      let date = moment(this.date).format("YYYY-MM-DD");
      let idx = 0;
      for (let day of this.tradeDays){
        if (day.localeCompare(date) > 0){
          idx ++;
        }
      }
      this.ppfix = 3.7+ idx * 4.23;
    },
    initTradeDays(){
      let now = new Date();
      let thirtyDayAgo = new Date(now.getTime() - 100*1000*60*60*24);
      let p = {
        stockNums:["000001"],
        endTime:moment(now).format("YYYY-MM-DD"),
        startTime:moment(thirtyDayAgo).format("YYYY-MM-DD")
      }
      getDayInfoList(p).then((resp)=>{
        let dataInfoList = resp.data["000001"];
        let arr = [];
        for (let item of dataInfoList){
          arr.push(item.date)
          arr.sort();
        }
        this.tradeDays = arr;
      })
    },
    getRightPx(stock){
      if (!stock.attribute){
        return 0;
      }

      let date = JSON.parse(stock.attribute).addFavoriteDate
      date = moment(new Date(date)).format("YYYY-MM-DD");
      let idx = 0;
      for (let day of this.tradeDays){
        if (day.localeCompare(date) > 0){
          idx ++;
        }
      }
      return 3.7+ parseInt(idx) * 4.23;
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
    },
    changeType(){
      var types = ["CCI","KDJ","MACD"];
      let idx = types.indexOf(this.type);
      idx++;
      this.type = types[idx%types.length]
    },
    mouseOut(){
      //this.selectStockNum = "";
    },
    mouseOver(stockNum){
      this.ppx = event.offsetX-3;
      this.selectStockNum = stockNum;
    },
    changeFavorite(stock,op){
      stock.favorite = op;
    },
    copyNum(stockNum){
      navigator.clipboard.writeText(stockNum);
      this.$message('copy ok '+stockNum);
    },
  }
}
</script>
<style>
.stock-img{
  display: inline-block;
  word-break: break-all;
  white-space: break-spaces;
  width: 300px;
  position: relative;
}
.stock-img img{
  width: 100%;
  display: inline-block;
}
.val_top_stock{
  background-color: #4f9f3f;
}
.range_top_stock{
  background-color: #66b1ff;
}
.range_down_stock{
  background-color: #6f42c1;
}
.industry-item{
  border: #e0b1ff 1px solid;
  margin-right: 5px;
  margin-bottom: 3px;
  padding: 3px 10px 3px 0px;
  display: inline-block;
}
.industry-item > span{
  background-color: #ffc9c9;
  padding: 3px 0px 3px 0px;
}
.favorite_stock{
  background-color: #ff5a1e;
}
.pp{
  margin-right:8px;
  float: right;
  position: absolute ;
  width: 1px;
  height: 80px;
  bottom: 111px;
  border-left: 3px solid #0000ff6b;
}
.ppx{
  height: 200px;
  bottom: 0px;
  border-left: 1px solid #0000ff6b;
}
</style>