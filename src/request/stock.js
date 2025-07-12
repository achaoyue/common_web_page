import { get,post } from './http'

/* 获取股票列表 */
// export const getPerfectList = p => get('/stock/get/perfectList', p);
export const getPerfectList = p => get('stock/score/query', p);
export const getStock = p => get('stock/get', p);
export const calcStockScore = p => get('stock/score/calc', p);
export const bigThan = p => get('stock/bigThan', p);
export const industryList = p => get('stock/industryList', p);
export const getStockList = p => get('stock/stockList', p);
export const queryDayLine = p => get('stock/queryDayLine', p);
export const queryUpDownSizeByIndustry = p => get('stock/queryUpDownSizeByIndustry', p);
export const getDayInfoList = p => get('stock/getDayInfoList', p);
export const crowStock = p => get('stock/crowStock', p);
export const crowStockDayInfo = p => get('stock/crowStockDayInfo', p);
export const getDataBoard = p => get('stock/getDataBoard', p);
export const editFavorite = p => post('stock/editFavorite', p);
export const getNoticeList = p => get('stock/getNoticeList', p);
export const queryIndustryLine = p => get("stock/queryIndustryLine", p)
export const queryKLine = p => get("stock/queryKLine", p)
export const queryDetail = p => get("stock/detail", p)
export const stockSelect = p => post("stock/stockSelect", p)
export const startMonitor = p => post("stock/monitor/start", p)
export const stopMonitor = p => post("stock/monitor/stop", p)
export const monitorList = p => get("stock/monitor/list", p)
export const tradeDetail = p => get("stock/trade/detail", p)
export const upTopList = p => get("stock/upTop/list", p)
export const getDayPeriodList = p => get("stock/getDayPeriodList", p)
export const queryIndex = p => get("stock/queryIndex", p)
export const addNote = p => post("/stock/note/add", p)
export const queryNote = p => get("/stock/note/query", p)
export const queryFund = p => get("/stock/queryFund", p)
export const testFund = p => get("/stock/testFund", p)
export const crowTime = p => get("/stock/crowTime", p)
export const getDayMinutesTrade = p => get("/stock/getDayMinutesTrade", p)





