<template>
  <div class="stock-wrapper">
    <!-- 指数看板 -->
    <ul class="board-list">
      <li
        class="board-item"
        v-for="(item, index) in stockBoardData"
        :key="index"
        :class="item.range >= 0 ? 'red' : 'green'"
      >
        <div class="name">{{ item.name }}</div>
        <div class="value">{{ item.value }}</div>
        <div class="bottom">
          <span class="left">
            <i :class="item.range >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            {{ item.range }}
          </span>
          <span class="right">
            <i :class="item.rate >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            {{ item.rate }}
          </span>
        </div>
      </li>
    </ul>
    <div class="operate-box">
      <el-button class="operate-btn" @click="operateDialogStatus = true" type="primary" size="medium">操作</el-button>
      <el-dialog
        title="操作"
        width="70%"
        :visible.sync="operateDialogStatus"
      >
        <div>
          <el-button round size="mini" @click="updateStockList()" type="primary" style="margin-left: 16px"
            >更新股票列表</el-button
          >
          <div>{{ stockListProgressTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageStockListProgressData"></el-progress>

          <el-divider>
            <div style="display: flex">
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="updateStockTimeInfo()"
                type="primary"
                style="margin-left: 16px"
                >更新股票详情数据</el-button
              >
              <el-button
                icon="el-icon-refresh"
                round
                size="mini"
                @click="stopUpdateTaskByType(1)"
                type="danger"
                style="margin-left: 16px"
                >停止更新</el-button
              >
            </div>
          </el-divider>
          <div>{{ stockDetailProgressTaskInfo }}</div>
          <el-progress :text-inside="true" :percentage="percentageStockDetailProgressData"></el-progress>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="operateDialogStatus = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
    <el-table class="stock-table" :data="stockTableData" v-loading="loading" stripe>
      <el-table-column label="股票编号" width="110">
        <template slot-scope="scope">
          <router-link
            class="stock-num blue"
            tag="a"
            :to="{
              name: 'StockDetail',
              params: { stockNum: scope.row.stockNum }
            }"
            target="_blank"
            >{{ scope.row.stockNum }}</router-link
          >
        </template>
      </el-table-column>
      <el-table-column label="股票名称" width="110">
        <template slot-scope="scope">
          <router-link
            class="stock-name blue"
            tag="a"
            :to="{
              name: 'StockDetail',
              params: { stockNum: scope.row.stockNum }
            }"
            target="_blank"
            >{{ scope.row.stockName }}</router-link
          >
        </template>
      </el-table-column>
      <el-table-column label="最新价" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-close" :class="scope.row.upDownRange.includes('-') ? 'green' : 'red'">{{
            scope.row.close
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-upDownRange" :class="scope.row.upDownRange.includes('-') ? 'green' : 'red'">{{
            scope.row.upDownRange
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-upDownRange3" :class="scope.row.upDownRange3.includes('-') ? 'green' : 'red'">{{
            scope.row.upDownRange3
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="5日涨跌幅" width="94" align="center">
        <template slot-scope="scope">
          <span class="stock-upDownRange5" :class="scope.row.upDownRange5.includes('-') ? 'green' : 'red'">{{
            scope.row.upDownRange5
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="涨跌额" width="90" align="center">
        <template slot-scope="scope">
          <span class="stock-upDownPrices" :class="scope.row.upDownPrices.includes('-') ? 'green' : 'red'">{{
            scope.row.upDownPrices
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="换手率" prop="turnOverrate" width="90" align="center"> </el-table-column>
      <el-table-column label="振幅" prop="amplitude" width="90" align="center"></el-table-column>
      <el-table-column label="上市日期" prop="listingDate" width="120" align="center"></el-table-column>
      <el-table-column label="流通股本" prop="totalFlowShares" align="center"></el-table-column>
      <el-table-column label="总股本" prop="totalShares" align="center"></el-table-column>
    </el-table>
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
</template>

<script>
import {
  getStockList,
  updateStockList,
  updateStockDayInfo,
  updateStockTimeInfo,
  stopUpdateTaskByType,
  getShStock
} from '@/request/stock.js'

export default {
  name: 'StockList',
  data() {
    return {
      stockBoardData: [], //  指数看板数据
      // 表格树
      stockTableData: [],
      // 分页组件数据
      pageData: {
        currentPage: 1, //  页码
        pageCount: 20, //  页大小
        total: 0
      },
      loading: false,
      operateDialogStatus: false,
      percentageStockListProgressData: 0,
      percentageStockDetailProgressData: 0,
      stockListProgressTaskInfo: '',
      stockDetailProgressTaskInfo: ''
    }
  },
  created() {
    this.getStockBoardData()
    this.getStockTableData()
    this.initSocket()
  },
  methods: {
    getSocket() {
      var webSocket = null
      var connectUrl = ''

      if (window.location.protocol == 'http:') {
        connectUrl = 'ws://127.0.0.1:8080/websocket/' + 'stock'
      } else {
        connectUrl = 'wss://127.0.0.1:8080/websocket/' + 'stock'
      }

      if ('WebSocket' in window) {
        webSocket = new WebSocket(connectUrl)
      } else if ('MozWebSocket' in window) {
        webSocket = new MozWebSocket(connectUrl)
      } else {
        console.log('Error: WebSocket is not supported by this browser.')
        return
      }
      return webSocket
    },
    initSocket() {
      let socket = this.getSocket()
      let _this = this

      socket.onopen = function() {
        console.log('Info: WebSocket connection opened.')
      }

      socket.onmessage = function(message) {
        var result = JSON.parse(message.data)
        
        var taskId = result.taskId

        var totalCount = result.totalCount
        var completeCount = result.completeCount
        var taskInfo = result.taskInfo
        var fenzi = (completeCount / totalCount) * 100
        if (taskId == 0) {
          _this.percentageStockListProgressData = fenzi.toFixed(0)
          _this.stockListProgressTaskInfo = taskInfo
        }
        if (taskId == 1) {
          _this.percentageStockDetailProgressData = fenzi.toFixed(0)
          _this.stockDetailProgressTaskInfo = taskInfo
        }
        
        console.log('接受消息：' + result.runTask)
        
      }

      /*
      socket.onclose = function() {
          document.getElementById('chat').onkeydown = null;
          Console.log('Info: WebSocket closed.');
      };*/
    },
    /**
     * 获取指数看板数据
     */
    getStockBoardData() {
      getShStock().then((res) => {
        this.stockBoardData = res.list.map((item) => {
          return {
            name: item[1],
            value: item[2],
            range: Number((item[2] - item[6]).toFixed(2)),
            rate: item[3]
          }
        })
      })
    },
    /**
     * 表格数据获取相关事件 | 获取表格数据
     */
    getStockTableData() {
      this.loading = true
      getStockList({
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.stockTableData = res.data.list.map((item) => {
            return {
              ...item,
              upDownRange: this.doubleToPercent(item.upDownRange),
              upDownRange3: this.doubleToPercent(item.upDownRange3),
              upDownRange5: this.doubleToPercent(item.upDownRange5),
              upDownPrices: item.upDownPrices.toFixed(2),
              turnOverrate: this.doubleToPercent(item.turnOverrate),
              amplitude: this.doubleToPercent(item.amplitude),
              totalFlowShares: this.formatNum(item.totalFlowShares),
              totalShares: this.formatNum(item.totalShares)
            }
          })
          this.pageData.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    
    /**
     * 表格数据获取相关事件 | 分页组件 | 当前页码改变
     */
    handleCurrentChange(currentPage) {
      this.pageData.currentPage = currentPage
      this.getStockTableData()
    },
    /**
     * 表格数据获取相关事件 | 分页组件 | 页大小改变时
     */
    handleSizeChange(pageCount) {
      this.pageData.pageCount = pageCount
      this.getStockTableData()
    },
    updateStockList() {
      updateStockList().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    updateStockDayInfo() {
      updateStockDayInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    updateStockTimeInfo() {
      updateStockTimeInfo().then((res) => {
        if (res.success) {
          alert('成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    stopUpdateTaskByType(taskType) {
      stopUpdateTaskByType({ taskType: taskType }).then((res) => {
        if (res.success) {
          alert('已停止')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

.stock-wrapper {
  display: block !important;
  padding: 16px 0 24px 0;

  .board-list {
    margin-bottom: 16px;
    background: $ThemeColor;
    padding: 48px 0;
    display: flex;
    justify-content: space-between;

    .board-item {
      width: 25%;
      text-align: center;

      .name {
        margin-bottom: 8px;
        height: 24px;
        line-height: 24px;
        font-size: 18px;
        color: #fff;
        font-weight: 300;
      }

      .value {
        margin-bottom: 8px;
        height: 48px;
        line-height: 48px;
        font-size: 36px;
      }

      .bottom {
        font-size: 14px;
      }
    }

    .board-item.red {
      .value, .bottom {
        color: $Danger;
      }
    }

    .board-item.green {
      .value, .bottom {
        color: $Success;
      }
    }
  }

  .operate-box {
    .operate-btn {
      margin-bottom: 16px;
      float: right;
    }
  }

  .stock-table {
    position: sticky;
    top: 0;
    max-height: calc(100vh - 64px);
    width: 100%;

    >>> td {
      padding: 8px 0;

      .blue {
        color: $Primary;
        cursor: pointer;

        &:hover {
          color: $ThemeColor;
        }
      }

      .red {
        color: $Danger;
        cursor: pointer;

        &:hover {
          color: $ThemeColor;
        }
      }

      .green {
        color: $Success;
        cursor: pointer;

        &:hover {
          color: $ThemeColor;
        }
      }
    }

    >>> .el-table__header-wrapper {
      th {
        background: $tabBackColor;
        padding: 8px 0;
        color: $PrimaryText;
      }
    }

    >>> .el-table__body-wrapper {
      max-height: calc(100vh - 104px);
      overflow-y: auto;
      setScrollbar(8px);
    }
  }

  .stock-pagination {
    margin-top: 8px;
    text-align: center;
  }
}
</style>
