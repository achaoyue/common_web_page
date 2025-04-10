<template>
  <div>
    <el-dialog
        :style="{minWidth: '500px'}"
        width="60%"
        title="历史笔记"
        :visible="show"
        :append-to-body="toBody"
        @close="this.handleClose"
    >
      <el-row class="note_row" v-for="item of notes" :key="item.code">
        <el-col :span="6">{{item.gmtCreate}}</el-col>
        <el-col :span="18">
          <el-input :style="{border:'none'}" type="textarea" :readonly="true" :value="item.data"></el-input>
        </el-col>
      </el-row>
      <div style="margin-top: 10px;text-align: center;word-break: break-all;white-space: normal">
        <div>
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              v-model="param.data"/>
        </div>
        <div>
          <el-button @click="addStockNote">添加</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {addNote, queryNote} from "@/request/stock";

export default {
  name: "StockNote",
  props:{
    stockNum:String,
    show:Boolean,
    toBody:Boolean
  },
  watch:{
    show(val){
      this.show = val;
    }
  },
  data:function (){
    return {
        notes:[],
        param:{
          data:"",
        }
    }
  },
  mounted() {
    this.queryStockNote();
  },
  methods:{
    handleClose() {
      this.$emit('update:show', false); // 关闭时触发更新
    },
    addStockNote(){
      if (this.param.data == ''){
        return;
      }
      let param = {...this.param,relatedCode:this.stockNum};
      addNote(param).then(()=>{
        this.queryStockNote();
        this.param.data = "";
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        });
      })
    },
    queryStockNote(){
      queryNote({stockNum:this.stockNum}).then(resp=>{
        this.notes = resp.data;
      })
    }
  }
}
</script>

<style scoped>
.note_row.el-row {
  text-align: left;
  border-width:  1px;
  border-color: #4f9f3f;
  border-style: solid;
}

.el-row .el-col:last-child {

  padding: 10px;
  border-width:  0 0 0 1px ;
  border-color: #4f9f3f;
  border-style: solid;

}
</style>