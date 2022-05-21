<template>
  <div class="perfect_list">
    <div style="width: 100%">
      <div style="text-align: left">
        <el-row>
          <el-col :span="5">
            <el-date-picker
                v-model="date"
                type="date"
                @change="perfectList"
                format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5">
            <el-select v-model="strategyId" @change="perfectList" placeholder="请选择">
              <el-option
                  v-for="item in indictors"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input v-model="stockNum" placeholder="股票编码"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="warning" @click="perfectList">查询</el-button>
            <el-button type="warning" @click="calc">开始计算</el-button>
          </el-col>
        </el-row>
      </div>
      <div
          class="perfect_img"
          v-for="(item, index) in perfectStockList"
          :key="index"
      >
        <div>{{index}},{{item.stockNum}},{{item.score}},{{item.scoreDesc}}</div>
        <img width="100%" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(item)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(item.type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <div class="pp" :style="{right: rightX+'px'}">

        </div>
        <div class="idx_op">
          <span @click="changeImg(item,'MACD')">macd</span>
          <span @click="changeImg(item,'KDJ')">kdj</span>
          <span @click="changeImg(item,'CCI')">cci</span>
          <span>{{item.date}}</span>
        </div>
      </div>
      <el-pagination
          class="stock-pagination"
          :current-page="pageData.currentPage"
          :page-size="pageData.pageCount"
          :total="pageData.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, total, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      ></el-pagination>
    </div>

  </div>
</template>

<script>
import {
  getPerfectList,
  calcStockScore,
  bigThan
} from '@/request/stock.js'
import moment from "moment";

export default {
  name: 'PerfectList',
  data() {
    return {
      rightX:3,
      indictors:[
        {value:'indicatorCalculator',label:'指标排序'},
        {value:'beautifulCalculator',label:'完美曲线'},
        {value:'amplitudeCalculator',label:'幅度计算排序'}
      ],
      stockNum:'',
      strategyId:"indicatorCalculator",
      date:new Date(),
      a:123,
      perfectStockList:[],
      pageData: {
        currentPage: 1, //  页码
        pageCount: 20, //  页大小
        total: 0
      },
    }
  },
  created() {
    this.perfectList()
  },
  methods: {
    handleCurrentChange(currentPage){
      this.pageData.currentPage = currentPage;
      this.perfectList()
    },
    handleSizeChange(pageCount){
      this.pageData.pageCount = pageCount

    },
    calc(){
      let param = {date:moment(this.date).format("YYYY-MM-DD"),
        strategyId:this.strategyId,
        stockNum:this.stockNum,
        pageSize:100};
      calcStockScore(param);
    },
    perfectList(){
      bigThan({date:moment(this.date).format("YYYY-MM-DD")}).then((resp)=>{
        this.rightX = 3.7+ parseInt(resp.data) * 4.23;
      })
      let param = {date:moment(this.date).format("YYYY-MM-DD"),strategyId:this.strategyId,pageSize:100};
      param.pageSize = this.pageData.pageCount;
      param.pageNum = this.pageData.currentPage;
      getPerfectList(param).then((resp)=>{
        console.log(resp)
        resp.data.forEach(e=>{
          e.type = "CCI";
        })
        this.perfectStockList = resp.data;
        this.pageData.total = resp.total;
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
.pp{
  margin-right:8px;
  float: right;
  position: absolute ;
  width: 1px;
  height: 80px;
  bottom: 130px;
  border-left 3px solid #0000ff6b;
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
