/**
* @overview 提示框
* @author Peter
import '@/common/library/toast.js';

// 完整版
option = {
  message: '',
  position: 'middle', // 'top', 'middle', 'bottom'
  duration: 3000 // 多少ms后消失
}
$toast(option);

// 缩略版
$toast('hello world');
*/

// toast样式
var styleString = `.iber-toast {
  position: fixed;
  max-width: 80%;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  box-sizing: border-box;
  transition: opacity .3s linear;
  z-index: 3000;
  padding: 10px;
  font-size: 14px;
  text-align: center;
}

.iber-toast.is-placemiddle {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.iber-toast.is-placetop {
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}

.iber-toast.is-placebottom {
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}`;

/**
 * 动态置入css
 * @param {String} styles 样式
 * @param {String} styleId 引入样式标签的id
 */
function includeStyleElement(styles, styleId) {
  if (document.getElementById(styleId)) {
    return;
  }
  var style = document.createElement("style");
  style.id = styleId;
  //这里最好给ie设置下面的属性
  (document.getElementsByTagName("head")[0] || document.body).appendChild(style);
  if (style.styleSheet) { //for ie
    style.styleSheet.cssText = styles;
  } else { //for w3c
    style.appendChild(document.createTextNode(styles));
  }
}

// 定时器
var toastTimeout = null;

/**
 * @description 全局中间提示
 * @param {String} option 传入参数
 * option = {
 *  message: '',
    position: 'middle', // 'top', 'middle', 'bottom'
    duration: 3000 // 多少ms后消失
 * }
 */
function toast(option) {
  // 清除定时器和原有元素
  clearTimeout(toastTimeout);
  var ele = document.getElementById('iBerToast');
  ele && ele.parentNode.removeChild(ele);
  // 设置样式
  includeStyleElement(styleString, 'iBerToastStyle');
  // 清除原有元素
  var ele = document.getElementById('iBerToast');
  ele && ele.parentNode.removeChild(ele);
  // 创建新元素
  var toastObj = document.createElement('div');
  toastObj.id = 'iBerToast';
  toastObj.classList.add('iber-toast');
  toastObj.classList.add('is-place' + ((option && option.position) || 'middle'));
  toastObj.innerText = typeof (option) === 'string' ? option : (option && option.message);
  document.querySelector('body').appendChild(toastObj);
  toastTimeout = setTimeout(() => {
    // 清除原有元素
    var ele = document.getElementById('iBerToast');
    ele && ele.parentNode.removeChild(ele);
  }, (option && option.duration) ? option.duration : 3000);
}

export default toast;