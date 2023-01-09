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





