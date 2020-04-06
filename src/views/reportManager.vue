<!-- 报表管理 -->
<template>
    <div style="height:100%">
        <dx-toolbar class="header-toolbar">
            <dx-item
                location="before"
            >
                <div slot-scope="_">
                <dx-button
                        id="delButton"
                        style="margin-left: 20px;"
                        text="删除"
                        type="danger"
                        @click="deleteItems"
                ></dx-button>
                <dx-button
                        id="addButton"
                        style="margin-left: 20px;"
                        text="新增"
                        type="normal"
                        @click="cancelAdd"
                ></dx-button>
                    <dx-button
                            id="UploadButton"
                            style="margin-left: 20px;"
                            text="下载"
                            type="normal"
                            @click="cancelUpload"
                    ></dx-button>
                    <dx-button
                            id="addBelongType"
                            style="margin-left: 20px;"
                            type="normal"
                            text="添加所属类型"
                            @click="addBelongType"
                    ></dx-button>

                </div>
            </dx-item>
        </dx-toolbar>
        <dx-popover
                :show-title="true"
                title="新增报表"
                :width="300"
                :visible.sync="AddDialogVisible"
                target="#addButton"
                position="bottom"
                :animation="animationConfig"
        >
            <div style="margin-bottom: 15px;">
                <dx-text-box placeholder="请输入新增报表名称" v-model="sqlName"></dx-text-box>
                <dx-radio-group
                        :items="RoleType"
                        value="全部可见"
                        layout="horizontal"
                        @valueChanged="RoleSelect"
                />
            </div>
            <div>
                <dx-button
                        style="margin-left: 20px;"
                        text="确定"
                        type="success"
                        @click="confirmAdd"
                ></dx-button>
                <dx-button
                        style="margin-left: 20px;"
                        text="取消"
                        type="danger"
                        @click="cancelAdd"
                ></dx-button>
            </div>
        </dx-popover>
        <dx-popover
                :show-title="true"
                title="新增所属类型"
                :width="300"
                :visible.sync="AddBelongTypeDialogVisible"
                target="#addBelongType"
                position="bottom"
                :animation="animationConfig"
        >
            <div style="margin-bottom: 15px;">
                <dx-text-box placeholder="请输入新增所属类型名称" v-model="NewBelongType"></dx-text-box>
            </div>
            <div>
                <dx-button
                        style="margin-left: 20px;"
                        text="确定"
                        type="success"
                        @click="confirmAddBelongType"
                ></dx-button>
                <dx-button
                        style="margin-left: 20px;"
                        text="取消"
                        type="danger"
                        @click="cancelAddBelongType"
                ></dx-button>
            </div>
        </dx-popover>
        <div class="content-block dx-card responsive-paddings">
            <dx-data-grid
                    :data-source="ReportList"
                    :remote-operations="true"
                    :allow-column-reordering="true"
                    :allow-column-resizing="true"
                    :column-auto-width="true"
                    :selected-row-keys="selectedItemKeys"
                    @selection-changed="selectionChanged"
            >
                <dx-scrolling
                        mode="vitual"
                        row-rendering-mode="virtual"
                />
                <dx-export
                        :enabled="true"
                        file-name= "报表列表"
                />
                <dx-search-panel :visible="true"/>
                <dx-column-fixing :enabled="true"/>
                <dx-paging :page-size="100"/>
                <dx-header-filter
                        :visible="true"
                        :allow-search="true"
                />
                <dx-selection mode="multiple"/>
                <dx-column
                        data-field="ID"
                        caption="ID"
                />
                <dx-column
                        data-field="DEC"
                        caption="名称"
                />
                <dx-column
                        :width = "280"
                        data-field="SQL"
                        caption="SQL语句"
                />
                <dx-column
                        :width = "280"
                        data-field="SQLURL"
                        caption="请求URL"
                />
                <dx-column
                        data-field="DB"
                        caption="链接数据库"
                />
                <dx-column
                        data-field="Type"
                        caption="类型"
                />
                <!--<dx-column
                        data-field="OrderByName"
                        caption="排序"
                />-->
            </dx-data-grid>
        </div>
    </div>
</template>

<script>
    import {
        DxDataGrid,
        DxColumn,
        DxScrolling,
        DxPaging,
        DxHeaderFilter,
        DxColumnFixing,
        DxExport,
        DxSearchPanel,
        DxSelection
    } from 'devextreme-vue/data-grid';
    import DxTextBox from 'devextreme-vue/text-box';
    import {DxPopover} from 'devextreme-vue/popover';
    import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
    import DxButton from 'devextreme-vue/button';
    import { DxRadioGroup } from 'devextreme-vue';
    import $ from 'jquery'
    //import service from '../data'; //测试数据
    export default {
        name: 'reportManager',
        components: {
            DxButton,
            DxToolbar,
            DxColumn,
            DxItem,
            DxPopover,
            DxTextBox,
            DxDataGrid,
            DxScrolling,
            DxPaging,
            DxHeaderFilter,
            DxColumnFixing,
            DxExport,
            DxSearchPanel,
            DxSelection,
            DxRadioGroup,
        },
        data() {
            //const products = service.getProducts()[1].items; //测试数据
            return {
                //task相关
                url:'',
                clientName:'TaskProcess',
                appDomain:'ConsumerLoan',
                taskCode:'ExportReportData',
                Variables: [],
                VariableTemp: '<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>',
                //所属类别
                NewBelongType: '',
                AddBelongTypeDialogVisible: false,
                //权限配置
                RoleType : ['全部可见', '自己可见'],
                RoleTypeSelected: 0,
                //新增报表的默认配置
                type: 'add',
                listId: 0,
                sqlName: '',
                sqlSelect: '',
                sqlURL: '',
                orderByName: '',
                connConfigSelected: 'TrustManagement',
                SQLTypeSelected: 0,
                ReportList:[],
                AddDialogVisible: false,
                UploadDialogVisible: false,
                selectedItemKeys: [],//选中的元素
                showScrollbar: 'always',
                scrollByContent: true,
                scrollByThumb: true,
                animationConfig: {
                    show: {
                        type: 'pop',
                        from: {
                            scale: 0
                        },
                        to: {
                            scale: 1
                        }
                    },
                    hide: {
                        type: 'fade',
                        from: 1,
                        to: 0
                    }
                }
            };
        },
        methods:{
            //下载
            cancelUpload(){
                let _this = this
                if (_this.selectedItemKeys.length != 1){
                    _this.$notify('请选择1条！', 'info', 1000);
                    return
                }
                _this.Variables = []
                var newDate = new Date().getTime();
                var url = "E:\\TSSWCFServices\\AppData\\Files\\Reports\\" + newDate + '.csv';
                let DB = _this.selectedItemKeys[0].DB
                let DBServer = 'mssql'
                let sqlSelete =_this.selectedItemKeys[0].SQL
                _this.AddVariableItem('DBName', DB, 'String');
                _this.AddVariableItem('DBServer', DBServer, 'String');
                _this.AddVariableItem('ExportFile', url, 'String');
                _this.AddVariableItem('Query', sqlSelete, 'String');
                _this.Variables = _this.BuildVariables()
                _this.url  = window.GlobalVariable.TaskProcessUrl+'?clientName='
                    + _this.clientName + '&appDomain=' + _this.appDomain + '&taskCode=' + _this.taskCode + '&sContext=' + encodeURIComponent(_this.Variables.toString());
                _this.show(function(){
                    let openUrl =  window.GlobalVariable.Host+'/AppData/Files/Reports/' + newDate + '.csv';
                    console.log(openUrl)
                    if (confirm("确认要下载生成文件吗？")) {
                        window.open(openUrl, '_black')
                    }
                })
            },
            cancelAddBelongType(){
                this.AddBelongTypeDialogVisible = false;
            },
            addBelongType(){
                this.AddBelongTypeDialogVisible = true;
            },
            confirmAddBelongType(){
                let _this = this
                if (_this.NewBelongType === undefined || _this.NewBelongType === '') {
                    _this.$notify('请输入类型！', 'info', 1000);
                    return
                }
                let executeParam = 'exec dbo.usp_isHasDataExplorerJsonType ' + _this.NewBelongType.toString()
                let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (d[0].result == 1) {
                        _this.$notify('该类型已存在', 'error', 1000);
                        return false;
                    }
                    let executeParam = 'exec [dbo].[usp_saveDataExplorerJsonType] ' + _this.NewBelongType.toString()
                    let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                    let executeParams = encodeURIComponent(Base64executeParam);
                    let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                    _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                        if (data.status === 200) {
                            _this.$notify('添加成功', 'success', 1000);
                        }
                    })
                    _this.$store.commit('set_refresh', !_this.$store.state.refresh);
                })
                _this.AddBelongTypeDialogVisible = !_this.AddBelongTypeDialogVisible;
            },
            RoleSelect(e) {
                if (e.value ='全部可见') {
                    this.RoleTypeSelected = 0
                }
                else if (e.value ='自己可见')
                {
                    this.RoleTypeSelected = 1
                }
            },
            confirmAdd(){
                let _this = this
                let executeParam = "exec dbo.usp_AddOrUpadeDataExporerData " + 0+ ",N'" + _this.sqlName+"'"+","
                    +"'"+_this.sqlSelect+"'"+","+"'"+ _this.sqlURL+"'"+","+_this.connConfigSelected  + "," +1 + ","
                    +"'"+  _this.orderByName +"'"+ "," + _this.RoleTypeSelected
                let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (data.status ==200 && d[0].Status == 1) {
                        _this.$notify('新增成功！', 'success', 1000);
                    }
                    _this.$store.commit('set_refresh', !_this.$store.state.refresh);
                })
                _this.AddDialogVisible = !_this.AddDialogVisible
            },
            cancelAdd(){
                this.AddDialogVisible = !this.AddDialogVisible;
            },
            //批量删除
            deleteItems(){
                let _this = this
                if (_this.selectedItemKeys.length == 0) {
                    _this.$notify('请选择！', 'info', 1000);
                    return
                }
                let deleleItemID = []
                _this.selectedItemKeys.forEach((key) => {
                    deleleItemID.push(key.ID)
                });
                let executeParam = 'exec [dbo].[usp_DelReportById] ' + "'"+deleleItemID +"'"
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (data.status ==200 && d[0].Status == 1) {
                        _this.$notify('删除成功！', 'success', 1000);
                    }
                    _this.getReportList();
                    _this.selectedItemKeys = [];
                    _this.$store.commit('set_refresh', !_this.$store.state.refresh);
                });
            },
            selectionChanged(e){
                let _this =this
                _this.selectedItemKeys = e.selectedRowKeys
            },
            //是否是干节点
            isTrunk(data) {
                return !data.items.length && data.parent;
            },
            getReportList() {
                let _this = this
                let executeParam = 'exec [dbo].[usp_GetReportListByRoleId] '
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE数据类型转换问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (d.length > 0) {
                       _this.ReportList = d
                    }else{
                        _this.ReportList = []
                    }
                })
            },
            //以下为Task相关方法，暂未提成公共方法
            AddVariableItem : function (name, value, dtatType, isConstant, isKey, keyIndex) {
                this.Variables.push({ Name: name, Value: value, DataType: dtatType, IsConstant: isConstant || 0, IsKey: isKey || 0, KeyIndex: keyIndex || 0 });
            },
            BuildVariables : function () {
                let _this = this
                let vars = '';
                _this.Variables.forEach(function (item,i) {
                    vars += _this.strFormat(_this.VariableTemp,item.Name, item.Value, item.DataType, item.IsConstant, item.IsKey, item.KeyIndex);
                })
                //let strReturn = "<SessionVariables>{0}</SessionVariables>".Format(vars);//vue中不支持Format函数，以下问自定义strFormat
                let strReturn = _this.strFormat("<SessionVariables>{0}</SessionVariables>",vars);
                return strReturn;
            },
            strFormat: function (formatted, ...args) {
                for (let i = 0; i < args.length; i++) {
                    let regexp = new RegExp('\\{' + i + '\\}', 'gi')
                    formatted = formatted.toString().replace(regexp, args[i])
                }
                return formatted
            },
            //onClose需要自己写
            show: function (CallBack) {
                let _this =this
                $.anyDialog({
                    title: '任务处理',
                    url: _this.url,
                    height: 550,
                    width: 500,
                    scrollable: true,
                    isMaskClickToClose: false,
                    dragable: true,
                    onClose: CallBack
                })
            }
        },
        mounted() {
            this.getReportList()
        }
    }
</script>

<style scoped>

</style>
