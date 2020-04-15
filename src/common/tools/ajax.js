import toast from '@/common/library/toast.js';

// const axios = require('axios');

// 生成全局提示框
window.$toast = toast;

// 请求配置 
window.baseURL = 'http://180.76.138.146/api/';
if (/127.0.0.1/.test(window.location.origin)) {
  // 本地
  window.baseURL = 'http://127.0.0.1:3000/api/';
  // window.baseURL = 'http://192.168.0.185:3000/api/';
} else {
  // 百度云服务器地址 180.76.138.146
  window.baseURL = 'http://180.76.138.146/api/';
}

axios.defaults.baseURL = window.baseURL;
axios.defaults.timeout = 15000;

/**
 *
 *完整版
  $http({
    base: '',
    path: '',
    method: 'GET',        //默认GET
    timeout: 15000,       //默认15000
    toast: true,          //默认true，false时即错误状态不显示Toast
    data: {},             //默认{}
    header: {},           //默认{}
    complete() {
      //完成状态，包括异常、成功、错误状态
    }, 
    errExpt() {
      //
    },
    except(res) {         
      //错误状态，即res.code != 0
    },  
    error(err) {
      //异常状态
    }, 
    success(res) {
      //业务成功, 即res.code == 0
    }        
  }).then((res)=> {       
    //响应成功, 即res.code == 0
  }).catch((err)=> {
    //响应错误
  });   

 *简洁版
  $http({
    path: '',
    method: '',
    data: {},      
    except(res) { res.msg
      //业务异常，即res.code != 0
    }
  }).then((res)=> {       
    //响应成功, 即res.code == 0
  }).catch((err)=> {
    //响应错误
  }); 

  *Peter定制版
  $http({
    path: '',
    method: '',
    data: {}
  }).then((res)=> {       
    //响应成功
  }).catch((err)=> {
    //响应错误
  });
 *
 */
export default (options) => {
  //初始化变量
  options = options || {};
  options.method = options.method || "GET";
  options.timeout = options.timeout || 15000;
  options.data = options.data || {};
  options.header = options.header || {};
  options.toast = typeof options.toast == 'boolean' ? options.toast : true;

  //追加header头部信息
  let headInfo = {};
  for (let key in options.header) {
    headInfo[key] = options.header[key];
  }

  //request数据
  let headersJSON = {
    method: options.method,
    timeout: options.timeout,
    url: `${options.base ? options.base : ''}${options.path}`,
    headers: headInfo,
  };

  if (options.method.toUpperCase() == "GET") {
    headersJSON.params = options.data;
  }
  if (options.method.toUpperCase() == "POST") {
    headersJSON.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headersJSON.data = require('qs').stringify(options.data);
  }

  //Axios HTTP
  let promise = new Promise((resolve, reject) => {

    axios(headersJSON).then((res) => {
      //完成状态，例如AJAX请求完成时，需要隐藏Progress、pageLoading、Loading等手动关闭的浮层框。
      options.complete && options.complete();

      //异常与错误公共函数
      if (res.data.code && options.errExpt) {
        options.errExpt(res.data, res.data.msg);
        return;
      }

      //普通异常
      if (res.data.code && options.except) {
        options.except(res.data, res.data.msg);
        return;
      }

      //响应成功，即res.data.code == 0
      if (!res.data.code && options.success) {
        options.success();
        return;
      }
      resolve(res.data);
    }).catch((err) => {
      //完成状态，例如AJAX请求完成时，需要隐藏Progress、pageLoading、Loading等手动关闭的浮层框。
      options.complete && options.complete();

      let err_info = window.simply ? "系统繁忙，请稍后再试" : "系統繁忙，請稍後再試";

      //异常与错误公共函数
      if (options.errExpt) {
        options.errExpt({ msg: err_info }, err_info);
        return;
      }

      //拦截不需要Toast的情形
      if (!options.toast) {
        reject(err);
        return;
      }

      //自定义错误模型
      if (options.error) {
        options.error(err_info, err);
        return;
      }

      //错误模型
      options.toast && $toast({ message: err_info });

      reject(err);
    }).finally(() => {

    });
  });

  promise.catch((err) => {
    let err_info = window.simply ? "系统繁忙，请稍后再试" : "系統繁忙，請稍後再試";
    //自定义错误模型
    if (options.error) {
      options.error(err_info, err);
      return;
    }
    //拦截不需要Toast的情形
    if (!options.toast) {
      return;
    }
    $toast({ message: err_info });
  });

  return promise;
};