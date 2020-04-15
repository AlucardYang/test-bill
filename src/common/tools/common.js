/**
 * @overview 公共常用方法
 * @author Peter
 * 导出规则
 * import {} from "@/common/tools/common.js";
 */

/**
* 功能：浏览器版本
* import {Brower} from "@/common/tools/common.js";
*/
const ua = navigator.userAgent.toLowerCase();
let Brower = {
  ua: ua,
  ios: ua.match(/iphone/i) != null,
  android: ua.match(/android/i) != null,
  iphoneX: (window.screen.height >= 812) && ua.match(/iphone/i),  //.4rem
  huawei: ua.match(/\/huawei/g) != null,  //华为
  samsung: ua.match(/\Wsm-/g) != null,  //三星
  qihu: ua.match(/build\/mmb29m/g) != null,  //360
  chrome: ua.match(/chrome/i) != null,
  safari: ua.match(/iphone/i) != null && ua.match(/safari\/[1-9]/i) != null,
  qq: ua.match(/QQ\/[1-9]/i) != null,
  fb: ua.match(/fb.{2,}\//) != null,
  weibo: ua.match(/weibo/g) != null,
  fbixm: (ua.match(/iphone/) != null && ua.match(/fb.{2,}\//) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
  wxix: ua.match(/iphone/) != null && ua.match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375,
  wxixb: (window.screen.height - document.documentElement.clientHeight) > 120,
  tab: window.screen.height - document.documentElement.clientHeight > 10,
  wxixm: (ua.match(/iphone/) != null && ua.match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
  iphoneX: (ua.match(/iphone/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
  wx: ua.match(/micromessenger/) != null,

  system: {
    port: window.location.port,
    env: window.location.port == 8080,
    docH: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}

/**
* @description 获取路径参数值
* @param {String} name 参数名
* import { getQueryParams } from "@/common/tools/common.js";
*/
function getQueryParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 格式化时间
 * @param {*} time 时间
 * @param {*} fromat 'yyyy-MM-dd hh:mm'
 * import { formatDate } from "@/common/tools/common.js";
 */
function formatDate(time, fromat) {
  let date = new Date(time);
  let fm = fromat ? fromat : 'yyyy-MM-dd hh:mm';
  // 日期格式化
  function format(date, fmt) {
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
  return format(date, fm);
}

/**
 * 处理部分软键盘在ISO上的微信升级版本至版本 6.7.4存在的灰白BUG(待出最佳方案)
 * import { iosFocusOut } from "@/common/tools/common.js";
 */
function iosFocusOut() {
  document.addEventListener('focusout', (e) => { //软键盘关闭事件
    if (Brower.ios && !Brower.iphone5) {
      window.setTimeout(() => {
        window.scroll(0, 0);
        document.body.scrollTop = document.body.scrollHeight + 1;
      }, 300);
    }
  });
}

/**
 * @description 阻止不是数字的按键
 * @param {Object} event 事件
 * import { preventNotNumber } from "@/common/tools/common.js";
 */
function preventNotNumber(event) {
  var keyValue = event["key"],
    keyUnicode = event["keyIdentifier"];

  function isBackspace() {
    if (keyValue) {
      return keyValue === "Backspace";
    } else if (keyUnicode) {
      return keyUnicode === "U+0008";
    }
  }

  function isDot() {
    if (keyValue) {
      return keyValue === ".";
    } else if (keyUnicode) {
      return keyUnicode === "U+002E";
    }
  }

  function isNumber() {
    if (keyValue) {
      return keyValue >= 0 && keyValue <= 9;
    } else if (keyUnicode) {
      var unicode = Number(
        keyUnicode.slice(keyUnicode.length - 4, keyUnicode.length)
      );
      return unicode >= 30 && unicode <= 39;
    }
  }
  if (!(isBackspace() || isDot() || isNumber())) {
    // 其他按键
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

export {
  Brower,
  getQueryParams,
  formatDate,
  iosFocusOut,
  preventNotNumber,
}