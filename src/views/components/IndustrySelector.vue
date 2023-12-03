<!--行业选择器-->
<template>
  <div>
    <el-select v-model="industry" filterable clearable @change="stockChange(1)" placeholder="请选择">
      <el-option
          v-for="item in industryList"
          :key="item"
          :label="item"
          :value="item">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import {industryList} from "@/request/stock";

export default {
  name: "IndustrySelector",
  data(){
    return {
      industryList:[],
      industry:"",
    }
  },
  props:{
    change:Function
  },
  mounted(){
    this.initStock();
  },
  methods:{
    initStock(){
      industryList().then((resp)=>{
        resp = resp.data;
        this.industryList = resp;
      })
    },
    stockChange(k){
      this.change(this.industry)
    }
  }
}
</script>

<style scoped>

</style>