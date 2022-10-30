<template>
  <div class="perfect_list">
    <div style="width: 100%">
      <div style="text-align: left">
        <el-button @click="crowStock">抓取股票</el-button>
        <el-button @click="crowStockDayInfo">抓取每日信息</el-button>
      </div>
      <div style="text-align: left">
        <el-date-picker
            v-model="date"
            type="date"
            @change="perfectList(1)"
            format="yyyy-MM-dd"
            placeholder="选择日期">
        </el-date-picker>
        <el-select v-model="strategyId" @change="perfectList(1)" placeholder="请选择">
          <el-option
              v-for="item in indictors"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="industry" filterable clearable allow-create @change="perfectList(1)" placeholder="请选择">
          <el-option
              v-for="item in industryListData"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
        <el-input v-model="stockNum" placeholder="股票编码"></el-input>
        <el-button type="warning" @click="perfectList(1)">查询</el-button>
        <el-button type="warning" @click="calc">开始计算</el-button>
      </div>
      <div
          class="perfect_img"
          v-for="(item, index) in perfectStockList"
          :key="index"
      >
        <div>{{index}},<span @click="copyNum(item.stockNum,this)">{{item.stockNum}}</span>,<span @click="changeIndustry(item.industry)">{{item.industry}}</span>,{{item.score}},{{item.scoreDesc}}</div>
        <img @mousemove="mouthMove" width="100%" :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+getStockNum(item)+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(item.type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
        <div class="pp" :style="{right: rightX+'px'}">
        </div>
        <div class="pp ppx" :style="{left: ppx+'px'}">
        </div>
        <div class="idx_op">
          <span @click="changeImg(item,'MACD')">macd</span>
          <span @click="changeImg(item,'KDJ')">kdj</span>
          <span @click="changeImg(item,'CCI')">cci</span>
          <span>{{item.upDownRange}}</span>
          <span><a target="_blank" :href="'http://quote.eastmoney.com/concept/'+getStockNum2(item)+'.html#'">详情</a></span>
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
    <div style="position:absolute; left: 0px;top: 50px; background-color: red">aasdfasdf</div>
  </div>
</template>

<script>
import {
  getPerfectList,
  calcStockScore,
  bigThan,
    industryList,
    crowStock,
    crowStockDayInfo,
} from '@/request/stock.js'
import moment from "moment";

export default {
  name: 'PerfectList',
  data() {
    return {
      rightX:3,
      ppx:0,
      indictors:[
        {value:'indicatorCalculator',label:'指标排序'},
        {value:'indicatorCalculator2',label:'指标排序2'},
        {value:'indicatorCalculator3',label:'指标排序3'},
        {value:'LH_RL_Calculator',label:'趋势计算'},
        {value:'beautifulCalculator',label:'完美曲线'},
        {value:'threeDaysUpCalculator',label:'三日联涨'},
        {value:'thirtyDaysUpCalculator',label:'三十日新高'},
        {value:'maRiseUpCalculator',label:'ma齐头向上'},
        {value:'topRiseUpCalculator',label:'当日涨幅'},
        {value:'amplitudeCalculator',label:'幅度计算排序'}
      ],
      industry:'',
      stockNum:'',
      strategyId:"indicatorCalculator",
      date:new Date(),
      a:123,
      perfectStockList:[],
      pageData: {
        currentPage: 1, //  页码
        pageCount: 100, //  页大小
        total: 0
      },
      industryListData:[]
    }
  },
  created() {
    this.perfectList()
    this.initIndustryList();
  },
  methods: {
    mouthMove(event){
      console.log("mouth move",event.offsetX)
      this.ppx = event.offsetX
    },
    initIndustryList(){
      industryList().then((resp)=>{
        let data = resp.data.sort(
            function compareFunction(param1, param2) {
              return param1.localeCompare(param2,"zh");
            }
        );
        this.industryListData = data;
      })
    },
    changeIndustry(industry){
      this.industry = industry;
      this.perfectList(1);
    },
    copyNum(stockNum){
      navigator.clipboard.writeText(stockNum);
      this.$message('copy ok '+stockNum);
    },
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
    perfectList(clearPage){
      bigThan({date:moment(this.date).format("YYYY-MM-DD")}).then((resp)=>{
        this.rightX = 3.7+ parseInt(resp.data) * 4.23;
      })
      let param = {date:moment(this.date).format("YYYY-MM-DD"),strategyId:this.strategyId,pageSize:100};
      if (clearPage){
        this.pageData.currentPage = 1;
      }
      param.industry = this.industry;
      param.pageSize = this.pageData.pageCount;
      param.pageNum = this.pageData.currentPage;
      getPerfectList(param).then((resp)=>{
        console.log(resp)
        resp.data.forEach(e=>{
          e.type = "KDJ";
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
    getStockNum2(stock){
      if (stock.stockNum.startsWith("6")){
        return "sh"+stock.stockNum;
      }else {
        return "sz"+stock.stockNum;
      }
    },
    changeImg(stock, type){
      stock.type = type;
      console.log(type)
    },
    crowStock(){
      crowStock().then((resp)=>{
        this.$message.success("ok"+JSON.stringify(resp.data))
      })
    },
    crowStockDayInfo(){
      crowStockDayInfo({stockNum:''}).then((resp)=>{
        this.$message.success("ok"+JSON.stringify(resp.data))
      })
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
