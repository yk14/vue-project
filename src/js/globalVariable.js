/// Local Environment

var uriHostInfo = /*location.protocol + "//" + location.host*/'';

window.GlobalVariable = (function () {

    return {
        Host:  'http://172.16.6.13',
        ReportServerCommonUrl:uriHostInfo + '/Reporting/api/',//(后端公共接口)
        ReportServiceUrl:uriHostInfo + '/Reporting/api/DataQueryPlain/',
        ReportServicePostUrl:uriHostInfo + '/Reporting/api/DataQueryPost',
        FileUpload: uriHostInfo + '/Reporting/api/Upload',
        MergeFiles: uriHostInfo + '/Reporting/api/MergeFiles'
    }
}());
