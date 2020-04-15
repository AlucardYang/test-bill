/**
 * @overview 过滤器
 * @author Peter
 * 导出规则
 * import "@/common/tools/filters.js";
 */

import Vue from 'vue';

Vue.filter('formatMoney', function (num, places, symbol, thousand, decimal) {
  function formatMoney(num, places, symbol, thousand, decimal) {
    !num && (num = 0);
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : '$';
    thousand = thousand || ',';
    decimal = decimal || '.';
    var number = num,
      negative = number < 0 ? '-' : '',
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
      j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
  }
  return formatMoney(num, places, symbol, thousand, decimal);
});