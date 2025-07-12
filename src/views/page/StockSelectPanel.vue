<!--
  股票id查看股票图片
-->
<template>
  <div class="perfect_list">
    <div>
      <div style="text-align: left">
        <el-select v-model="selectId">
          <el-option value="STRICT" label="严格选股"></el-option>
          <el-option value="MINUTES" label="分钟涨幅选股"></el-option>
          <el-option value="HIGHEST" label="过历史最高"></el-option>
          <el-option value="VOL_HIGH" label="成交量突破"></el-option>
          <el-option value="UP_TOP" label="涨停"></el-option>
          <el-option value="CRASH_TOP" label="烂板"></el-option>
          <el-option value="TIME_ABNORMAL" label="分时异动"></el-option>
          <el-option value="THREE_VOL_UP" label="三日连续放量"></el-option>
          <el-option value="INDUSTRY" label="行业选择"></el-option>
          <el-option value="NEW_TOP" label="突破新高"></el-option>
          <el-option value="NAME_SELECT" label="名称过滤"></el-option>
          <el-option value="UP_DOWN_SELECT" label="k线幅度选择"></el-option>
          <el-option value="STOCK_NUM" label="股票编码"></el-option>
          <el-option value="UP_RANGE" label="涨幅"></el-option>
          <el-option value="FAVORITE" label="已收藏"></el-option>
          <el-option value="STOCK_NOTE" label="笔记"></el-option>

        </el-select>
        <div class="time_block">
          <el-date-picker
              v-model="date"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="time_block" >
          最小换手率:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.turnOverRate"/></div>
        </div>
        <div class="time_block" v-if="selectId == 'UP_TOP'">
          连涨天数:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.daySize"/></div>
          严格:<el-switch
              v-model="param.force"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </div>
        <div class="time_block" v-if="selectId == 'NAME_SELECT'">
          股票名称:<div style="display: inline-block"><el-input v-model="param.name"/></div>
        </div>
        <div class="time_block" v-if="selectId == 'NEW_TOP'">
          序列:<div style="display: inline-block;width: 250px;display: inline-block"><el-input type="text" v-model="param.series"/></div>
        </div>
        <div class="time_block" v-if="selectId == 'NEW_TOP'">
          刚突破:<el-switch
            v-model="param.justBigThan"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </div>
        <div class="time_block" v-if="selectId == 'STOCK_NOTE'">
          全量:<el-switch
            v-model="param.noteAll"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
        </div>
        <div class="time_block" v-if="selectId == 'UP_DOWN_SELECT'">
          序列:<div style="display: inline-block;width: 250px"><el-input type="text" v-model="param.series"/></div>
        </div>
        <IndustrySelector v-if="selectId == 'INDUSTRY'" :multiple='false' :change="(val)=>{param.industry = val}"/>
        <div class="time_block" style="width: 500px" v-if="selectId == 'UP_RANGE'">
          天数:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.daySize"/></div>
          最小:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.minRange"/></div>
          最大:<div style="display: inline-block;width: 100px"><el-input type="number" v-model="param.maxRange"/></div>
        </div>
        <div class="time_block" style="width: 500px" v-if="selectId == 'FAVORITE'">
          在区间:<el-switch
            v-model="param.inPeriod"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
        </div>
        <el-button @click="cc">查询</el-button>
        <el-checkbox v-model="distinctIndustry">分板块</el-checkbox>
        <el-input
            v-if="selectId == 'STOCK_NUM'"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            placeholder="请输入内容"
            v-model="stockListStr">
        </el-input>
      </div>
      <div>
        <el-radio-group v-model="allType">
          <el-radio-button label="MACD"></el-radio-button>
          <el-radio-button label="KDJ"></el-radio-button>
          <el-radio-button label="CCI"></el-radio-button>
          <el-radio-button label="TIME"></el-radio-button>
          <el-radio-button label="FIVE"></el-radio-button>
          <el-radio-button label="NEW"></el-radio-button>
          <el-radio-button label="FUND"></el-radio-button>
          <el-radio-button label="MINUTE"></el-radio-button>
          <el-radio-button label="TRADE"></el-radio-button>
        </el-radio-group>
      </div>
      <div style="text-align: left" v-if="allType == 'NEW'">
        <div class="time_block">
          <el-date-picker
              v-model="startDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期">
          </el-date-picker>
        </div>
        <div class="time_block">
          <el-date-picker
              v-model="endDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期">
          </el-date-picker>
        </div>
      </div>
      <div v-if="!done" style="text-align: center">
        请求中。。。。
      </div>
      <div v-if="distinctIndustry">
        <div class="industry_row" v-for="(rows,industry) in stockIndustryMap" :key="industry">
          <el-divider>{{industry}}({{rows.length}})</el-divider>
          <div
              class="perfect_img"
              v-for="(item, index) in rows"
              :key="index"
          >
            <div>{{index}},{{item.stockName}},{{item.stockNum}},{{item.industry}},{{item.close}},{{formatMarket(item)}}</div>
            <div style="background-color: #ff5e0e" v-if="item.favorite === 'Y'">{{formatFavorite(item)}}</div>
            <StockImg
                :stock-num="item.stockNum"
                :right-x="rightX"
                :ppx="ppx"
                :all-type="allType"
                :default-start="startDate"
                :default-end="endDate"
                :mouse-move-notice="mouseChange"></StockImg>

          </div>
        </div>
      </div>
      <div v-if="!distinctIndustry">
        <div
            class="perfect_img"
            v-for="(item, index) in stockList"
            :key="index"
        >
          <div>{{index}},{{item.stockName}},{{item.stockNum}},{{item.industry}},{{item.close}},{{formatMarket(item)}}</div>
          <div style="background-color: #ff5e0e" v-if="item.favorite === 'Y'">{{formatFavorite(item)}}</div>
          <StockImg
              :stock-num="item.stockNum"
              :right-x="rightX"
              :ppx="ppx"
              :all-type="allType"
              :default-start="startDate"
              :default-end="endDate"
              :favorite = item.favorite
              :now-date = "date"
              :mouse-move-notice="mouseChange"></StockImg>
          <div>{{item.belongPlate}}</div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

import {bigThan,stockSelect,queryDayLine} from "@/request/stock";
import moment from "moment";
import StockImg from "@/views/components/StockImg";
import IndustrySelector from "@/views/components/IndustrySelector";
import globalFunction from "@/globalFunction";

export default {
  name: 'StockViewPanel',
  components:{
    IndustrySelector,
    StockImg,
  },
  data() {
    return {
      distinctIndustry:false,
      done:true,
      param:{inPeriod:true,justBigThan:false},
      industry:null,
      ppx:0,
      rightX:3,
      allType:null,
      num:0,
      stockListStr:globalFunction.getCookies("stockNumsText") || '',
      stockList:[],
      stockIndustryMap:{},
      type:"CCI",
      date:moment().format("YYYY-MM-DD"),
      startDate:moment().subtract(90,'days').format("YYYY-MM-DD"),
      endDate:moment().format("YYYY-MM-DD"),
      selectId:'STRICT'
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    mouthMove(event){
      this.ppx = event.offsetX
    },
    formatFavorite(item){
      let attr =  JSON.parse(item.attribute);
      let date = moment(attr.addFavoriteDate).format("yyyy-MM-DD")
      return "计划价格:"+date+"("+attr.minPrice+"-"+attr.maxPrice+")";
    },
    formatMarket(item){
      return  globalFunction.formatNum(item.flowMarketValue,0)
    },
    cc(){
      this.stockListChange();
      if (this.stockListStr != null && this.selectId=='STOCK_NUM'){
        globalFunction.setCookies("stockNumsText",this.stockListStr);
      }
      bigThan({date:moment(this.date).format("YYYY-MM-DD")}).then((resp)=>{
        this.rightX = (5+ parseInt(resp.data) * 4.23)*400/300;
      });
      let param = {
        stockNum: "601398",
        startDate: moment(this.date).subtract(60,'days').format("YYYY-MM-DD"),
        endDate: moment(this.date).subtract(-10,'days').format("YYYY-MM-DD")
      }
      queryDayLine(param).then(resp=>{
        let days = resp.data.map(e=>e.date);
        let dayIndex = days.indexOf(moment(this.date).format("YYYY-MM-DD"));
        dayIndex = dayIndex === -1 ? days.length -1 : dayIndex;
        this.startDate = moment(this.date).subtract(60,'days').format("YYYY-MM-DD");
        this.endDate = days[Math.min(dayIndex+2, days.length-1)];
        let p = {
          date: moment(this.date).format("YYYY-MM-DD"),
          selectId: this.selectId,
          ...this.param
        }
        this.done = false;
        this.stockList = [];
        stockSelect(p).then(resp=>{
          this.stockList = resp.data
          let map = {};
          for(let item of resp.data){
            if (map[item.industry] == null){
              map[item.industry] = []
            }
            map[item.industry].push(item);
          }
          this.stockIndustryMap = map;
          console.log(JSON.stringify(resp.data.map(e=>e.stockNum)))
          this.$notify({
            title: '成功',
            message: '查询成功',
            type: 'success'
          });
        }).finally(()=>{
          this.done = true;
        })
      })

    },
    mouseChange(x){
      this.ppx = x;
    },
    stockListChange(){
      this.param.stockNums =JSON.stringify( this.stockListStr.replace(/[ ,\n\r]+/g, ',')
          .split(',')
          .map(item => item.trim())
          .filter(item => item !== ''));
    },
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
.el-input{
  width 100%
}
.perfect_list{
  background-color:#f9ebe8e6
  display: block
  padding-bottom : 10px
}
.perfect_img{
  display :inline-block
  max-width 400px
  min-width 400px
  border solid 1px black
  position relative
  vertical-align top;
  text-align: center;
}
.perfect_img img{

}
.perfect_img  span{
  white-space normal
  word-break break-all
}
.idx_op{
  background-color white;
  white-space break-spaces;
}
.idx_op span{
  background-color #f3d6d6
  border-radius :3px;
  margin :1px 3px 0px;
  padding 0px 3px 0px;
}
  .time_block{
    display: inline-block
    width :300px;
  }
.industry_row{
  overflow: auto;
  white-space: nowrap;
}
.industry_row > .perfect_img{
  white-space: nowrap;
  display: inline-block;
}
</style>
