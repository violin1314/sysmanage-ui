import axios from 'axios';
import { message } from 'antd';
import utils from './index';
const ajaxUrl = ''
message.config({
    top: 60,
    duration: 2,
    maxCount: 1,
})
axios.defaults.timeout = 600000;
axios.interceptors.request.use(config => {
    // 在这里设置请求头与携带token信息
    if(sessionStorage.getItem('userInfo')){
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        config.headers.Authorization = userInfo.token_type + ' ' + userInfo.access_token
    } 
    return config;
})

// 添加响应拦截器
axios.interceptors.response.use(
    (res) => {
        if(res.data.response === 'error'){
            message.destroy()
            message.error(res.data.error)
            if(document.querySelector('.full-loading')){
                document.querySelector('.full-loading').remove()
            }
            return 'error'
        }else{
            if(res.config.responseType !== 'blob'){
                return res.data.ok
            }else{
                return res.data
            }
        }
    },
    (error) => {
        if(document.querySelector('.full-loading')){
            document.querySelector('.full-loading').remove()
        }
        if(error.response.status === 401){
            sessionStorage.setItem('userInfo', '')
            window.location.href = '/login'
        }else{
            if(error.response.data.error){
                message.error(error.response.data.error)
            }else{
                message.error('网络异常')
            }
        }
        return Promise.reject(error);
    }
)

const get = function (url, params, opts) {
    return new Promise((resolve, reject) => {
        if( params && !params.params ){
            params = { params:params }
        }
        if(opts && opts.isLoading){
            utils.showLoading()
        }
        axios.get(ajaxUrl + url, params).then(res => {
            if(opts && opts.isLoading){
                utils.hideLoading()
            }
            if(res === 'error') return;
            resolve(res);
        }).catch(err => {
            if(opts && opts.isLoading){
                utils.hideLoading()
            }
            reject(err);
        });
    });
}

const post = function (url, params, opts) {
    return new Promise((resolve, reject) => {
        if(!params){
            params = {}
        }
        if(opts && opts.isLoading){
            utils.showLoading()
        }
        axios.post(ajaxUrl + url, params).then(res => {
            if(opts && opts.isLoading){
                utils.hideLoading()
            }
            if(res === 'error') return;
            resolve(res);
        }).catch(err => {
            if(opts && opts.isLoading){
                utils.hideLoading()
            }
            reject(err);
        });
    });
}

const postDownFile = function (url, params, opts) {
    return new Promise((resolve, reject) => {
        if (!params) {
            params = {}
        }
        if (opts && opts.isLoading) {
            utils.showLoading()
        }
        axios({ // 用axios发送post请求
            method: 'post',
            url: ajaxUrl + url, // 请求地址
            data: params, // 参数
            responseType: 'blob' // 表明返回服务器返回的数据类型
        }).then(res => { // 处理返回的文件流
            if (opts && opts.isLoading) {
                utils.hideLoading()
            }
            if(!res){
                return
            }
            if(res.type === 'application/json'){
                var reader = new FileReader();
                reader.readAsText(res)
                reader.onload = file => {
                    let result = JSON.parse(file.currentTarget.result)
                    if(result.response === 'error'){
                        message.error(result.error)
                    }
                }
            }else{
                if(window.navigator.msSaveBlob){
                    try{
                        console.log(res)
                        var blobObject = new Blob([res]); 
                        window.navigator.msSaveBlob(blobObject, opts.fileName); 
                    }
                    catch(e){
                        console.log(e);
                    }
                }else{
                    let fileUrl = URL.createObjectURL(res);
                    const aLink = document.createElement('a');
                    let filename = opts.fileName;
                    aLink.download = filename;

                    aLink.style.display = 'none'
                    aLink.href = fileUrl
                    document.body.appendChild(aLink)
                    aLink.click()
                    URL.revokeObjectURL(aLink.href) // 释放URL 对象
                    document.body.removeChild(aLink)
                }
            }
        }).catch(err => {
            if (opts && opts.isLoading) {
                utils.hideLoading()
            }
            reject(err);
        });
    });
}

export default { get, post, postDownFile}

// import http from "http"
// http.post