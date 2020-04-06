import notify from 'devextreme/ui/notify'
import axios from 'axios';
import $ from 'jquery'
export default{
    //请求wcf服务
    CallWCFSvc: function(svcUrl, isAsync, rqstType, fnCallback) {
    let sourceData;
    axios({
        cache: false,
        method: rqstType,
        async: isAsync,
        url: svcUrl,
        //responseType: "json",
        contentType: "application/xml;charset=utf-8",
        data: {}
    }).then(function (response){
        if (typeof response === 'string'){
            sourceData = JSON.parse(response);
        }
        else{
            sourceData = response;
        }
        if (fnCallback) fnCallback(sourceData);
    }).catch(function (error) {
        //notify(`Error occursed while requiring the remote source data!error info: ${error}`, 1000);
        //console.log(error)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            //console.log(error.response.request.responseText.toString())
            sourceData = error.response.data
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            //console.log('Error', error.message);
        }
        if (fnCallback) fnCallback(sourceData);
        //console.log(error.config);
    })

    if (!isAsync) { return sourceData; }
},
    //Post方式，formData参数
    CallWCFSvcPost: function(svcUrl, isAsync, rqstType,dataParams, fnCallback) {
        let sourceData;
        axios({
            cache: false,
            method: rqstType,
            async: isAsync,
            url: svcUrl,
            //responseType: "json",
            contentType: "application/xml;charset=utf-8",
            data: dataParams
        }).then(function (response){
            if (typeof response === 'string'){
                sourceData = JSON.parse(response);
            }
            else{
                sourceData = response;
            }
            if (fnCallback) fnCallback(sourceData);
        }).catch(function (error) {
            //notify(`Error occursed while requiring the remote source data!error info: ${error}`, 1000);
            //console.log(error)
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                //console.log(error.response.request.responseText.toString())
                sourceData = error.response.data
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                //console.log(error.request)
            } else {
                // Something happened in setting up the request that triggered an Error
                //console.log('Error', error.message);
            }
            if (fnCallback) fnCallback(sourceData);
            //console.log(error.config);
        })

        if (!isAsync) { return sourceData; }
    },
    UploadFile: function(files, fileName, folder, fnCallback){
        let resData;
        let fileData = files[0];
        let svcUrl = window.GlobalVariable.DataProcessServiceUrl;
        fileName = encodeURIComponent(fileName);
        folder = encodeURIComponent(folder);
        console.log(fileData)
        axios({
            url: svcUrl + 'FileUpload?fileName=' + fileName + '&fileFolder=' + folder,
            method: 'POST',
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: "application/xml;charset=utf-8",
            data: fileData,
        }).then(function (res) {
            console.log(res)
            if (res.status == 200) {
                resData = res.data
            }
            if (fnCallback) fnCallback(resData.FileUploadResult)
        }).catch(function (error) {
            notify(`Error occursed while requiring the remote source data!error info: ${error}`, 1000);
        })
    },
    /**
     * 判断IE版本
     * @returns {*}
     * @constructor
     */
    IEVersion:function () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11
    }else{
        return -1;//不是ie浏览器
    }
}
}
