<template>
  <div class="perfect_list">
    <div>
      <div
          class="perfect_img"
          v-for="(item, index) in perfectStockList"
          :key="index"
      >
        <div>{{index}},{{item.stockBean.stockNum}},⬆️{{parseInt(item.stockBean.upDownRange * 100)}},{{item.value}},{{item.desc}}</div>
        <img width="100%" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(item.stockBean)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(item.type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <br/>
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
import {
  getPerfectList
} from '@/request/stock.js'

export default {
  name: 'PerfectList',
  data() {
    return {
      a:123,
      perfectStockList:[]
    }
  },
  created() {
    this.perfectList()
  },
  methods: {
    perfectList(){
      getPerfectList({topN:500}).then((resp)=>{
        resp.forEach(e=>{
          e.type = "CCI";
        })
        this.perfectStockList = resp;
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
    changeImg(stock, type){
      stock.type = type;
      console.log(type)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';
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
