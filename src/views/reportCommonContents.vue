<!-- 报表内容页面 -->
<template>
    <div>
        <h2 class="content-block">{{title}}报表内容</h2>
        <div class="content-block dx-card responsive-paddings">
            <dx-data-grid
                    :data-source="dataSource"
                    :columns="columns"
                    :allow-column-reordering="true"
                    :allow-column-resizing="true"
                    :column-auto-width="true"
            >
                <dx-scrolling
                        mode="vitual"
                        row-rendering-mode="virtual"
                />
                <dx-export
                        :enabled="true"
                        :file-name=title
                />
                <dx-search-panel :visible="true"/>
                <dx-column-fixing :enabled="true"/>
                <dx-paging :page-size="30"/>
                <dx-header-filter
                        :visible="true"
                        :allow-search="true"
                />
            </dx-data-grid>
        </div>
        <div style="margin-top:10px;margin-bottom:10px;" id="AjaxData"></div>
    </div>
</template>

<script>

    import {
        DxDataGrid,
        DxScrolling,
        DxPaging,
        DxHeaderFilter,
        DxColumnFixing,
        DxExport,
        DxSearchPanel
    } from 'devextreme-vue/data-grid';

    import 'devextreme-vue/text-area';

    export default {
        props: {
            picture: String,
        },
        data() {
            return {
                report_id: '',
                dataSource: [],
                columns: [],
                title:''
            };
        },
        computed: {
            pageChange () {
                return this.$store.state.current_item;
            }
        },
        watch: {
            pageChange (){
                this.pageInit();
            }
        },
        methods: {
            //页面初始化
            pageInit: function () {
                let _this = this
                _this.$("#AjaxData").empty().append();//清空错误信息台
                _this.dataSource =[]
                if(this.$store.state.current_item != '{}'){
                    _this.report_id = JSON.parse(this.$store.state.current_item).report_id;
                    _this.title = JSON.parse(this.$store.state.current_item).text;
                }
                let executeParam = 'exec [dbo].[usp_getDataSQLByID] ' + _this.report_id
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl,true,'GET',function (data) {
                    if (data.status == 200) {
                        let d
                        if (typeof data.data === 'string') {
                            d = JSON.parse(data.data)
                        } else{
                            d=data.data
                        }
                        if (d.length>0 ){
                            if (!d[0].ErrorMessage) {//新的接口，如果返回结果形式  [{"ErrorMessage"：""}]  表示后端报错。（注:要求前端满足后端）
                                _this.dataSource = d
                                _this.columns = Object.keys(d[0])
                            }
                            else if (undefined !== d[0].ErrorMessage) {
                                //新的接口，要求显示如下格式的错误提示，后端没法提供，前端自行拼接。暂时没找使用DevExtreme，后续优化
                                let htmlStr = "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
                                    "  <head>\n" +
                                    "    <title>Request Error</title>\n" +
                                    "    <style>BODY { color: #000000; background-color: white; font-family: Verdana; margin-left: 0px; margin-top: 0px; } #content { margin-left: 30px; font-size: .70em; padding-bottom: 2em; } A:link { color: #336699; font-weight: bold; text-decoration: underline; } A:visited { color: #6699cc; font-weight: bold; text-decoration: underline; } A:active { color: #336699; font-weight: bold; text-decoration: underline; } .heading1 { background-color: #003366; border-bottom: #336699 6px solid; color: #ffffff; font-family: Tahoma; font-size: 26px; font-weight: normal;margin: 0em 0em 10px -20px; padding-bottom: 8px; padding-left: 30px;padding-top: 16px;} pre { font-size:small; background-color: #e5e5cc; padding: 5px; font-family: Courier New; margin-top: 0px; border: 1px #f0f0e0 solid; white-space: pre-wrap; white-space: -pre-wrap; word-wrap: break-word; } table { border-collapse: collapse; border-spacing: 0px; font-family: Verdana;} table th { border-right: 2px white solid; border-bottom: 2px white solid; font-weight: bold; background-color: #cecf9c;} table td { border-right: 2px white solid; border-bottom: 2px white solid; background-color: #e5e5cc;}</style>\n" +
                                    "  </head>\n" +
                                    "  <body>\n" +
                                    "    <div id=\"content\">\n" +
                                    "      <p class=\"heading1\">Request Error</p>\n" +
                                    "      <p>" + d[0].ErrorMessage +
                                    "   </p>\n" +
                                    "    </div>\n" +
                                    "  </body>\n" +
                                    "</html>"
                                _this.$("#AjaxData").empty().append(htmlStr);
                                _this.dataSource=[]
                                _this.columns = []
                            }
                        }
                        else{
                            _this.dataSource = []
                            _this.columns = []
                        }
                    }
                    else {//显示错误信息，需求需要显示错误信息
                        //_this.$("#AjaxData").empty().append(data);按照原先后端接口形式，在这里处理错误控制台输出
                        _this.dataSource=[]
                        _this.columns = []
                    }
                })
            },
            //获取所属类型
            getDataExplorerType: function () {
                let _this = this;
                _this.SQLTypeList = [];
                let executeParam = 'exec dbo.usp_getDataExplorerJsonType '
                let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    if (data.length > 0) {
                        _this.SQLTypeList = data;
                        _this.SQLTypeSelected = data[0].ID;
                    }
                })
            },
            //获取数据库类型。
            getDBType: function () {
                //暂时写死后期加表
                let _this =this
                _this.connConfig = ['TrustManagement', 'ODSInterface', 'DataInterface', 'ExistingTrusts'];
            }
        },
        mounted(){
           this.pageInit()
        },
        components: {
            DxDataGrid,
            DxScrolling,
            DxPaging,
            DxHeaderFilter,
            DxColumnFixing,
            DxExport,
            DxSearchPanel
        }
    };
</script>
<style lang="scss">

</style>

