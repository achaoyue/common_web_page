<!--股票选择组件-->
<template>
  <div>
    <el-select v-model="selectNum" :multiple="this.multiple" filterable clearable @change="stockChange(1)" placeholder="请选择">
      <el-option
          v-for="item of stockList"
          :key="item.key"
          :label="item.key+'('+item.value+')'"
          :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {getStockList} from "@/request/stock";

export default {
  name: "StockSelector",
  data(){
    return {
      stockList:[],
      selectNum:"",
    }
  },
  props:{
    change:Function,
    multiple:Boolean
  },
  mounted(){
    this.initStock();
  },
  methods:{
    initStock(){
      getStockList().then((resp)=>{
        resp = resp.data;
        this.stockList = resp;
      })
    },
    stockChange(k){
      this.change(this.selectNum)
    }
  }
}
</script>

<style scoped>

</style>