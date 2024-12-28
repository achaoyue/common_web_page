<!--行业选择器-->
<template>
  <div style="display: inline-block">
    行业:
    <el-select v-model="industry"  :multiple="this.multiple" filterable clearable @change="stockChange(1)" placeholder="请选择">
      <el-option
          v-for="(item,i) in industryList"
          :key="item"
          :label="i+'-'+item"
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
    change:Function,
    multiple:Boolean
  },
  mounted(){
    this.initStock();
  },
  methods:{
    initStock(){
      industryList().then((resp)=>{
        resp = resp.data.sort(
            function compareFunction(param1, param2) {
              return param1.localeCompare(param2,"zh");
            }
        );
        this.industryList = resp;
      })
    },
    stockChange(){
      this.change(this.industry)
    }
  }
}
</script>

<style scoped>

</style>