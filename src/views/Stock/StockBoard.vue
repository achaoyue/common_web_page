<template>
  <div class="perfect_list">
    <div>
      <div style="text-align: left">
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            @change="stockListChange"
            placeholder="请输入内容"
            v-model="stockListStr">
        </el-input>
        <el-date-picker
            v-model="date"
            type="date"
            @change="cc"
            format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
      </div>
      <div
          class="perfect_img"
          v-for="(item, index) in stockList"
          :key="index"
      >
        <div>{{index}},{{item}}</div>
        <img @mousemove="mouthMove" width="100%" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(item)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <br/>
        <div  class="pp" :style="{right: rightX+'px'}">
        </div>
        <div class="pp ppx" :style="{left: ppx+'px'}">
        </div>
        <div class="idx_op">
          <span @click="changeImg(item,'MACD')">macd</span>
          <span @click="changeImg(item,'KDJ')">kdj</span>
          <span @click="changeImg(item,'CCI')">cci</span>
          <span>{{item.date}}</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script>

import {bigThan} from "@/request/stock";
import moment from "moment";

export default {
  name: 'PerfectList',
  data() {
    return {
      ppx:0,
      rightX:3,
      num:0,
      stockListStr:'',
      stockList:[],
      type:"CCI",
      date:new Date()
    }
  },
  created() {

  },
  methods: {
    mouthMove(event){
      console.log("mouth move",event.offsetX)
      this.ppx = event.offsetX
    },
    stockListChange(){
      console.log(this.stockListStr.split("\n"))
      this.stockList.length = 0;
      this.stockList = this.stockListStr.split("\n");
    },
    cc(){
      bigThan({date:moment(this.date).format("YYYY-MM-DD")}).then((resp)=>{
        this.rightX = 3+ parseInt(resp.data) * 4.23;
      })
    },
    getStockNum(stockNum){
      console.log(stockNum)
      if (stockNum.startsWith("6")){
        return "1."+stockNum;
      }else if (stockNum.startsWith("3")){
        return "0."+stockNum;
      }else if (stockNum.startsWith("0")){
        return "0."+stockNum;
      }else {
        return "0."+stockNum;
      }
    },
    changeImg(stock, type){
      this.type = type;
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';
.pp{
  margin-right:8px;
  float: right;
  position: absolute ;
  width: 1px;
  height: 80px;
  bottom: 130px;
  border-left 3px solid #0000ff6b;
}
.ppx{
  height: 180px;
  bottom: 30px;
  border-left 1px solid #0000ff6b;
}
.el-input{
  width 100%
}
.perfect_list{
  background-color:#f9ebe8e6
  display: block
  text-align: center
  padding-bottom : 10px
}
.perfect_img{
  display :inline-block
  max-width 300px
  border solid 1px black
  position relative
}
.perfect_img img{

}
.perfect_img  span{
  white-space normal
  word-break break-all
}
.idx_op{
  background-color white
}
.idx_op span{
  background-color #f3d6d6
  border-radius :3px;
  margin :1px 3px 0px;
  padding 0px 3px 0px;
}
</style>
