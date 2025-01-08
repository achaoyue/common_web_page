<template>
  <div style="margin-top: 10px">
    <el-select v-model="param.monitorType" placeholder="请选择">
      <el-option label="成交明细" value="TRADE"></el-option>
      <el-option label="盘口" value="BUY_QUEUE"></el-option>
      <el-option label="分钟监控" value="UP_MINUTE"></el-option>
    </el-select>
    <StockSelector :multiple='false' :change="(val)=>{param.stockNum = val}"/>
    买入:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.maxBuy"/></div>
    卖出:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.maxSold"/></div>
    封单量:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.monitorBuyOne"/></div>
    <el-button @click="addMonitor">添加</el-button>
    <el-button type="primary" @click="getList">刷新</el-button>
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
    <div style="height: 10px"></div>
    <div
        class="perfect_img"
        v-for="(item, index) in stockList"
        :key="index"
    >
      <div>{{index}}, {{item}}, <el-button type="text" @click="removeMonitor(item)">停止</el-button></div>
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
</template>

<script>
import StockSelector from "@/views/components/StockSelector";
import {startMonitor,monitorList,stopMonitor} from "@/request/stock";
import moment from "moment/moment";
import StockImg from "@/views/components/StockImg";
export default {
  name: "StockMonitor",
  components: {StockImg, StockSelector},
  data:function (){
    return{
      param: {
        monitorBuyOne:200000,
        monitorType:"TRADE",
        stockNum: '',
        maxSold: 1000,
        maxBuy: 1000
      },
      stockList:[],
      ppx:0,
      rightX:3,
      allType:null,
      num:0,
      stockListStr:'',
      type:"CCI",
      date:moment().format("YYYY-MM-DD"),
      startDate:moment().subtract(90,'days').format("YYYY-MM-DD"),
      endDate:moment().format("YYYY-MM-DD")
    }
  },
  mounted() {
    this.getList();
  },
  watch:{
    "param.monitorType":function (){
      this.getList();
    }
  },
  methods:{
    addMonitor:function (){
      startMonitor(this.param).then(()=>{
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        });
        this.getList();
      })
    },
    removeMonitor:function (item){
      let p ={
        stockNum:item,
        monitorType:this.param.monitorType
      }
      stopMonitor(p).then(()=>{
        this.$notify({
          title: '成功',
          message: '清理成功，2s后刷新',
          type: 'success'
        });
        setTimeout(this.getList,2000);
      })
    },
    getList:function (){
      monitorList({monitorType:this.param.monitorType}).then(resp=>{
        let data = resp.data;
        console.log(data);
        this.stockList = data;
      })
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