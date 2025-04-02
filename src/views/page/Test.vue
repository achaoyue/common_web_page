<template>
  <div>
    <IndustryUpEcharts/>
    <StockTrendEcharts />
<!--    <StockSelector :change="(x)=>{this.log(x)}"/>-->
    <StockSelector :multiple=true :change="(val)=>{this.param.stockNums = val;}"/>
    <el-date-picker
        v-model="param.startDate"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择开始日期">
    </el-date-picker>
    <el-date-picker
        v-model="param.endDate"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择结束日期">
    </el-date-picker>
    <el-button @click="doQuery">查询</el-button>
    <br/>
    <div style="width: 50%;display: inline-block" v-for="item of param.stockNums" :key="item">
      <StockKLine :ref="'child'+item" :fix-id="'test'" :stock-num="item" :start-date="param.startDate" :end-date="param.endDate" />
      <StockDetailPop
          :key="item+'_detail_pop'"
          :stock-num="item"
          :default-start-date="param.startDate"
          :default-end-date="param.endDate" />
    </div>
    <IndexPan></IndexPan>
    <UpTopTable></UpTopTable>
  </div>
</template>
<script>
import IndustryUpEcharts from "@/views/components/IndustryUpEcharts";
import StockTrendEcharts from "@/views/components/StockTrendEcharts";
import StockSelector from "@/views/components/StockSelector";
import StockKLine from "@/views/components/StockKLine";
import moment from "moment";
import StockDetailPop from "@/views/components/StockDetailPop";
import TradeDetailChart from "@/views/components/TradeDetailChart";
import UpTopTable from "@/views/components/UpTopTable";
import IndexPan from "@/views/components/IndexPan.vue";
export default {
  data(){
    return {
      ppx:0,
      param:{
        stockNums:["600408"],
        startDate:moment().subtract(30,'days').format("YYYY-MM-DD"),
        endDate:new Date(),
      }
    }
  },
  mounted() {

  },
  components:{
    IndexPan,
    UpTopTable,
    TradeDetailChart,
    StockDetailPop,
    StockSelector,
    StockKLine,
    StockTrendEcharts,
    IndustryUpEcharts,
  },
  methods:{
    log(x){
    },
    doQuery(){
      let _this = this;
      this.param.stockNums.forEach(e=>{
        _this.$refs['child'+e][0].initK();
      })

    }
  }
}
</script>

<style scoped>


</style>