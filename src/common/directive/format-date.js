/**
 * @overview 过滤器
 * @author Peter
 * 导出规则
 * import "@/common/directive/format-date.js";
 */

import Vue from 'vue';

Vue.filter('formatDate', function (time, fromat) {
  let date = new Date(time);
  let fm = fromat ? fromat : 'yyyy-MM-dd hh:mm';
  // 日期格式化
  function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
      }
    }
    return fmt;
  }
  return formatDate(date, fm);
});