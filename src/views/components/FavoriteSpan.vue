<!-- 收藏组件 -->
<template>
  <div class="favoriteBtn">
    <div v-if="isFavorite=='Y'" @click="editFavorite">取消收藏</div>
    <div v-else @click="editFavorite">收藏</div>
  </div>
</template>

<script>
import {editFavorite} from "@/request/stock";

export default {
  name: "FavoriteSpan",
  props:{
    isFavorite:String,
    stockNum: String,
    change:Function
  },
  methods:{
    editFavorite(){
      let param = {
        stockNum:this.stockNum,
        opType:this.isFavorite == 'Y' ? "DELETE" : "ADD"
      }
      editFavorite(param).then(()=>{
        // this.isFavorite = param.opType == "ADD" ? "Y" : "N";
        this.change(param.opType == "ADD" ? "Y" : "N");
      })
    }
  }
}
</script>

<style scoped>
.favoriteBtn{
  display: inline-block;
}
.favoriteBtn div{
  display: inline-block;
  cursor: pointer;
}
</style>