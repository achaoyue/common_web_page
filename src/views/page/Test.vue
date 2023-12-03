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
        placeholder="选择开始日期">
    </el-date-picker>
    <el-date-picker
        v-model="param.endDate"
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择结束日期">
    </el-date-picker>
    <el-button @click="doQuery">查询</el-button>
    <br/>
    <div style="width: 33%;display: inline-block" v-for="item of param.stockNums">
      <StockKLine :ref="'child'+item" :stock-num="item" :start-date="param.startDate" :end-date="param.endDate" />
    </div>
  </div>
</template>
<script>
import IndustryUpEcharts from "@/views/components/IndustryUpEcharts";
import StockTrendEcharts from "@/views/components/StockTrendEcharts";
import StockSelector from "@/views/components/StockSelector";
import StockKLine from "@/views/components/StockKLine";
export default {
  data(){
    return {
      param:{
        stockNums:["600408"],
        startDate:new Date("2023-06-01"),
        endDate:new Date(),
      }
    }
  },
  mounted() {

  },
  components:{
    StockSelector,
    StockKLine,
    StockTrendEcharts,
    IndustryUpEcharts,
  },
  methods:{
    log(x){
      console.log(x)
    },
    doQuery(){
      let _this = this;
      this.param.stockNums.forEach(e=>{
        console.log(_this.$refs['child'+e])
        _this.$refs['child'+e][0].initK();
      })

    }
  }
}
</script>

<style scoped>


</style>