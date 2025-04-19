<!-- 收藏组件 -->
<template>
  <div class="favoriteBtn">
    <el-button type="text" v-if="isFavorite=='Y'" @click="editFavorite">取消收藏</el-button>
    <el-button type="text" v-else @click="showDialog">收藏</el-button>
    <el-dialog
        style="text-align: left"
        width="30%"
        title="通知价格设置"
        :append-to-body="true"
        :visible.sync="show"
    >
      <div>最小价格:<el-input v-model="minPrice"></el-input></div>
      <div>最大价格:<el-input v-model="maxPrice"></el-input></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="editFavorite">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {editFavorite, getStock} from "@/request/stock";

export default {
  name: "FavoriteSpan",
  props:{
    isFavorite:String,
    stockNum: String,
    change:Function
  },
  data:function (){
    return {
      show:false,
      minPrice:0,
      maxPrice:0,
      stockData:null,
    }
  },
  methods:{
    showDialog(){
      this.show = true;
      this.queryStock();
    },
    queryStock(){
      getStock({stockNum:this.stockNum}).then(resp=>{
        this.stockData = resp.data;
        let attr = JSON.parse(resp.data.attribute);
        this.minPrice = attr.minPrice;
        this.maxPrice = attr.maxPrice;
      })
    },
    editFavorite(){
      let param = {
        stockNum:this.stockNum,
        opType:this.isFavorite == 'Y' ? "DELETE" : "ADD",
        minPrice:this.minPrice,
        maxPrice:this.maxPrice
      }
      editFavorite(param).then(()=>{
        // this.isFavorite = param.opType == "ADD" ? "Y" : "N";
        this.show = false;
        this.change && this.change(param.opType == "ADD" ? "Y" : "N");
      },()=>{alert('收藏错误')})
    }
  }
}
</script>

<style scoped>
.favoriteBtn{
  display: inline-block;
  margin-left: 5px;
}
.favoriteBtn div{
  display: inline-block;
  cursor: pointer;
}
</style>