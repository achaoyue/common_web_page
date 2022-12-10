<template>
  <div class="board">
    <h2>总涨跌情况:</h2>
    <div class="stock-img">
      <div>
        <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=1.000001&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
      </div>
    </div>
    <div>
      <span :style="{display:'inlineBlock',width:this.board.upSize/10,backgroundColor:'red'}">上涨：{{this.board.upSize}}</span>
      <span :style="{display:'inlineBlock',width:this.board.upSize/10,backgroundColor:'green'}">下跌：{{this.board.downSize}}</span>
    </div>
    <h2>各行业涨跌情况</h2>
    <div>
      <span class="industry-item" v-for="(val) in this.board.industryUpDown" :key="val.industry">
          <span>{{val.industry}}</span> 上涨:{{val.upSize}},下跌:{{val.downSize}}
      </span>
    </div>
    <h2>各行业龙头</h2>
    <div class="stock-img" v-for="(val,key) in this.board.industryTopMap" :key="key">
      <div>
        行业:{{key}} 股票:{{val.stockName}},{{val.upDownRange}}
        <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
      </div>
    </div>
    <Br/>
    <h2>涨幅榜</h2>
    <span class="stock-img" v-for="(val) in this.board.topUpStockList" :key="val.stockNum">
      <div>
        {{val.stockName}} {{val.industry}} {{val.upDownRange}}
        <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
      </div>
    </span>
    <h2>跌幅榜</h2>
    <span class="stock-img" v-for="(val) in this.board.topDownStockList" :key="val.stockNum">
      <div>
        {{val.stockName}} {{val.industry}} {{val.upDownRange}}
        <img @click="changeType" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(val)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
      </div>
    </span>
  </div>
</template>
<script>
import {
  getDataBoard
} from '@/request/stock.js'
export default {
  data(){
    return {
      type:"CCI",
      board:{
        upSize:0,
        downSize:0,
        industryUpDown:[],
        industryTopMap:{},
        topUpStockList:[],
        topDownStockList:[]
      }
    }
  },
  mounted() {
    this.init();
  },
  created() {

  },
  methods:{
    init(){
      getDataBoard().then((resp)=>{
        this.board = resp.data;
        console.log(this.board)
      })
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
    }
  }
}
</script>
<style>
.stock-img{
  display: inline-block;
  word-break: break-all;
  white-space: break-spaces;
  width: 300px;
}
.stock-img img{
  width: 100%;
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
.top-industry{

}
</style>