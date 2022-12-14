import { get,post } from './http'

/* 获取股票列表 */
// export const getPerfectList = p => get('/stock/get/perfectList', p);
export const getPerfectList = p => get('stock/score/query', p);
export const calcStockScore = p => get('stock/score/calc', p);
export const bigThan = p => get('stock/bigThan', p);
export const industryList = p => get('stock/industryList', p);
export const getDayInfoList = p => get('stock/getDayInfoList', p);
export const crowStock = p => get('stock/crowStock', p);
export const crowStockDayInfo = p => get('stock/crowStockDayInfo', p);
export const getDataBoard = p => get('stock/getDataBoard', p);
export const editFavorite = p => post('stock/editFavorite', p);

export const getStockList = p => get('/stock/getstocklist', p);
export const updateStockList = p => get('/stock/updatestocklist', p);
export const updateStockDayInfo = p => get('/stock/updatestockdayinfo', p);
export const updateStockTimeInfo = p => get('/stock/updatestocktimeinfo', p);
export const updateStockWeekInfo = p => get('/stock/updatestockweekinfo', p);
export const updateStockMonthInfo = p => get('/stock/updatestockmonthinfo', p);
export const stopUpdateTaskByType = p => get('/stock/stopupdatetaskbytype', p);
export const getEchnicalaspect = p => get('/stock/getechnicalaspect', p);

export const getStocktimebar = p => get('/stock/getstocktimebar', p);
export const getStockdaybar = p => get('/stock/getstockdaybar', p);
export const getStockweekbar = p => get('/stock/getstockweekbar', p);
export const getStockmonthbar = p => get('/stock/getstockmonthbar', p);

export const getStockInfoById = p => get('/stock/getstockinfobyid', p);
export const queryStockByFilter = p => get('/stock/querystockbyfilter', p);

export const getShStock = p => get('/stock/getshstock', p);
export const backTest = p => post('/stock/backtest', p)
export const selectReplayList = p => get('/stock/selectreplaylist', p)

export const getStockBid = p => get('/stock/getstockbid', p)





