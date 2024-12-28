<!--
  股票id查看股票图片
-->
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
      <div>
        <el-radio-group v-model="allType">
          <el-radio-button label="MACD"></el-radio-button>
          <el-radio-button label="KDJ"></el-radio-button>
          <el-radio-button label="CCI"></el-radio-button>
          <el-radio-button label="TIME"></el-radio-button>
          <el-radio-button label="FIVE"></el-radio-button>
          <el-radio-button label="NEW"></el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="allType == 'NEW'">
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
      </div>
      <div
          class="perfect_img"
          v-for="(item, index) in stockList"
          :key="index"
      >
        <div>{{index}}, {{item}}</div>
        <StockImg
            :stock-num="item"
            :right-x="rightX"
            :ppx="ppx"
            :all-type="allType"
            :default-start="startDate"
            :default-end="endDate"
            :mouse-move-notice="mouseChange"></StockImg>

      </div>
    </div>

  </div>
</template>

<script>

import {bigThan, queryDayLine, stockSelect} from "@/request/stock";
import FavoriteSpan from "@/views/components/FavoriteSpan";
import moment from "moment";
import StockImg from "@/views/components/StockImg";
import StockKLine from "@/views/components/StockKLine";

export default {
  name: 'StockViewPanel',
  components:{
    StockKLine,
    StockImg,
    FavoriteSpan
  },
  data() {
    return {
      ppx:0,
      rightX:3,
      allType:null,
      num:0,
      stockListStr:'',
      stockList:[],
      type:"CCI",
      date:moment().format("YYYY-MM-DD"),
      startDate:moment().subtract(90,'days').format("YYYY-MM-DD"),
      endDate:moment().format("YYYY-MM-DD")
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    mouthMove(event){
      this.ppx = event.offsetX
    },
    stockListChange(){
      this.stockList.length = 0;
      this.stockList = this.stockListStr.replace(/[ ,\n\r]+/g, ',')
          .split(',')
          .map(item => item.trim())
          .filter(item => item !== '');
    },
    cc(){
      bigThan({date:moment(this.date).format("YYYY-MM-DD")}).then((resp)=>{
        this.rightX = 3+ parseInt(resp.data) * 4.23;
      });
      let param = {
        stockNum: "601398",
        startDate: moment(this.date).subtract(60,'days').format("YYYY-MM-DD"),
        endDate: moment(this.date).subtract(-10,'days').format("YYYY-MM-DD")
      }
      queryDayLine(param).then(resp=>{
        let days = resp.data.map(e=>e.date);
        let dayIndex = days.indexOf(moment(this.date).format("YYYY-MM-DD"));
        this.startDate = moment(this.date).subtract(60,'days').format("YYYY-MM-DD");
        this.endDate = days[Math.min(dayIndex+2, days.length-1)];
        this.stockListChange();
        this.$notify({
          title: '成功',
          message: '查询成功',
          type: 'success'
        });
      })
    },
    getStockNum(stockNum){
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
    getStockNum2(stockNum){
      if (stockNum.startsWith("6")){
        return "sh"+stockNum;
      }else {
        return "sz"+stockNum;
      }
    },
    changeImg(stock, type){
      this.type = type;
    },
    favoriteChange(op){
      alert("收藏OK")
    },
    mouseChange(x){
      this.ppx = x;
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
  min-width 300px
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
