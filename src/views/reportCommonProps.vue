<!-- 报表配置页面 -->
<template>
    <div>
        <h2 class="content-block">{{title}}报表配置
            <div style="display: inline-block;position: relative;margin-left:20px;bottom: 2px;">
                <dx-button
                        styling-mode="contained"
                        :type="editDisabled == false ? 'success' : 'normal'"
                        :text="editDisabled == false ? '保存' : '编辑'"
                        @click="editDisabled == false ? saveEdit($event) : changeEditable($event)"
                ></dx-button>

            </div>
            <div v-if="editDisabled == false ? true : false" style="display: inline-block;position: relative;margin-left:20px;bottom: 2px;">
                <dx-button
                    styling-mode="contained"
                    type="danger"
                    text="取消"
                    @click="cancel($event)"
                ></dx-button>
            </div>
        </h2>

        <div class="content-block dx-card responsive-paddings">

            <dx-form
                    :disabled="editDisabled"
                    id="form"
                    label-location="top"
                    col-count="24"
                    :form-data="formData"
                    :min-col-width="233"
            >

                <dx-item
                        :col-span="4"
                        data-field="名称"
                />

                <dx-item
                        :col-span="20"
                        data-field="请求URL"
                />
                <dx-item
                        :col-span="24"
                        :editor-options="{height: 140}"
                        data-field="sql语句"
                        editor-type="dxTextArea"
                />

                <!--<dx-item
                        :col-span="8"
                        data-field="orderBy字段"
                />-->
                <dx-item
                        :col-span="8"
                        :editor-options="{displayExpr: 'name', valueExpr: 'name', value: belongDBSelected, items: belongDB,onValueChanged: belongDBeChange}"
                        data-field="所属数据库"
                        editor-type="dxSelectBox"
                />
                <!-- :validation-rules="validationRules.belongType"-->
                <dx-item
                        :col-span="8"
                        :editor-options="{displayExpr: 'name', valueExpr: 'value', value: belongTypeSelected, items: belongType,onValueChanged: belongTypeChange}"
                        data-field="所属类型"
                        editor-type="dxSelectBox"
                />
                <dx-item
                        :col-span="8"
                        :editor-options="{displayExpr: 'name', valueExpr: 'value', value: RoleTypeSelected, items: RoleType,onValueChanged: RoleTypeChange}"
                        data-field="权限"
                        editor-type="dxSelectBox"
                >
                </dx-item>
            </dx-form>
        </div>
    </div>
</template>

<script>
    import {DxForm, DxItem} from "devextreme-vue/form";
    import 'devextreme-vue/select-box';
    import DxButton from 'devextreme-vue/button';
    import 'devextreme-vue/text-area';

    export default {
        props: {
            picture: String
        },
        data() {
            return {
                title: '',
                report_id: null,
                name:'',
                sql:'',
                reqUrl: '',
                orderBy: '',
                belongDB: [],
                belongDBSelected: '',
                belongType: [],
                belongTypeSelected: '',
                RoleType:[],
                RoleTypeSelected: '',
                SQLTypeList: [],
                SQLTypeSelected: [],
                editDisabled: true,
                formData: {
                    '名称': '历史兑付明细',
                    'sql语句': 'SELECT [Id],ap.[TrustId],t.TrustCode,t.TrustName,[Term],convert(nvarchar,[PayDate],20) as PayDate,[PaymentAmount],[Interest],[Corpus],[Other],[PaymentProperty],[PaymentStatus],ap.[PaymentType],[CollectionOrganisation],[CollectionAccount],[CollectionAccountBank],[SupervisionOrganisation],[SupervisionAccountBank],[SupervisionAccount],[PaymentOrganisation],[PaymentAccount],[PaymentId]  FROM [TrustManagement].[Asset].[ABSActualPayment] as ap  inner join TrustManagement.TrustManagement.Trust as t  on ap.TrustId=t.TrustId',
                    '请求URL': '/TrustManagementService/DataProcessService.svc/jsAccessEP/CommonGetExecute',
                    'orderBy字段': "Id"
                },
                validationRules: {
                    belongDB: [
                        { type: 'required', message: '所属数据库必须选择！' },
                    ],
                    belongType: [
                        { type: 'required', message: '所属类型必须选择！' }
                    ]
                },
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
        computed: {
            pageChange () {
                return this.$store.state.current_item;
            }
        },
        watch: {
            pageChange () {
                this.pageInit();
            }
        },
        methods: {
            //获取selectBox的值
            RoleTypeChange(val){
                this.RoleTypeSelected = val.value
            },
            //获取selectBox的值
            belongDBeChange(val){
                this.belongDBSelected = val.value
            },
            //获取selectBox的值
            belongTypeChange(val){
                this.belongTypeSelected = val.value
            },
            confirmAddBelongType(){
            },
            //修改报表
            saveEdit() {
                let _this = this
                //源xml格式后端没法提供，暂时自己拼接
                _this.formData['sql语句'] = _this.formData['sql语句'].replace(new RegExp("'","gm"),"''")//替换' 为 ''，MSSQL中varchar类型中插入单引号格式转换
                let executeParam = "exec dbo.usp_AddOrUpadeDataExporerData " + _this.report_id + ",N'" + _this.formData['名称']+"'"+","
                    +"N'"+_this.formData['sql语句']+"'"+","+"N'"+ _this.formData['请求URL']+"'"+","+_this.belongDBSelected + "," + _this.belongTypeSelected + ","
                    +"N'"+ _this.formData[['orderBy字段']] +"'"+ "," + _this.RoleTypeSelected
                let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam)
                let serviceUrl = window.GlobalVariable.ReportServicePostUrl
                let formData=new FormData()  //IE不支持URLSearchParams，使用FormData。
                formData.append('query',executeParams)  //KEY值只能是query，后端写死。
                _this.$com.CallWCFSvcPost(serviceUrl, true, 'POST',formData, function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (data.status ==200 && d[0].Status == 1) {
                        _this.$notify('修改保存成功！', 'success', 1000);
                    }else {
                        _this.$notify('修改保存失败！', 'error', 1000);
                    }
                    _this.pageInit();
                    _this.editDisabled = !_this.editDisabled
                    _this.$store.commit('set_refresh', !_this.$store.state.refresh);
                })
                /*_this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    if (data.status ==200 && d[0].Status == 1) {
                        _this.$notify('修改保存成功！', 'success', 1000);
                    }else {
                        _this.$notify('修改保存失败！', 'error', 1000);
                    }
                    _this.pageInit();
                    _this.editDisabled = !_this.editDisabled
                    _this.$store.commit('set_refresh', !_this.$store.state.refresh);
                })*/
            },
            cancel(e) {
                this.editDisabled = true;
            },
            changeEditable (e) {
                this.editDisabled = false;
            },
            //页面初始化
            pageInit: function () {
                if(this.$store.state.current_item != '{}'){
                    this.report_id = JSON.parse(this.$store.state.current_item).report_id;
                    this.title = JSON.parse(this.$store.state.current_item).text;
                }
                //查询报表对应的数据
                let _this = this;
                _this.reportList = [];
                //let executeParam = { SPName: 'dbo.usp_getDataExplorerJsonById', SQLParams: [] };
                //executeParam.SQLParams.push({ Name: 'ID', Value: _this.report_id, DBType: 'string' });
                //let executeParams = encodeURIComponent(JSON.stringify(executeParam));
                //let serviceUrl = window.GlobalVariable.DataProcessServiceUrl + "CommonGetExecute?connConfig=Report&executeParams=" + executeParams;
                let executeParam = 'exec dbo.usp_getDataExplorerJsonById ' + _this.report_id
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let dd;
                    //解决IE数据类型转换问题
                    if (typeof data.data === 'string') {
                        dd = JSON.parse(data.data)
                    } else{
                        dd=data.data
                    }
                    let d = dd[0];
                    _this.formData['名称'] = d.DEC;
                    _this.formData['sql语句'] = d.SQL;
                    _this.formData['请求URL'] = d.SQLURL;
                    _this.formData['orderBy字段'] = d.OrderByName;
                    _this.belongTypeSelected = d.Type;
                    _this.belongDBSelected = d.DB;
                    _this.RoleTypeSelected = d.RoleType
                    _this.getDataExplorerType();
                    _this.getDBType();
                    _this.getRoleType()
                });
            },
            getDataExplorerType: function () {
                let _this = this;
                _this.SQLTypeList = [];
                let executeParam = 'exec [dbo].[usp_GetDataExplorerJsonType] '
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d = data.data;
                    let arr = [];
                    if (d.length > 0) {
                        for (let item of d) {
                            arr.push({
                                name: item.Name,
                                value: item.ID
                            });
                        }
                        _this.belongType = arr;
                    }

                })
            },
            getDBType: function () {
                //暂时写死后期加表
                this.belongDB = [
                    {name:'TrustManagement', value:'TrustManagement'},
                    {name:'ODSInterface', value:'ODSInterface'},
                    {name:'DataInterface', value:'DataInterface'},
                    {name:'ExistingTrusts', value:'ExistingTrusts'}
                    ];
            },

            getRoleType: function () {
                //权限暂时写死，value数据库类型要与返回值一致
                this.RoleType = [
                    {name:'全部可见', value:0},
                    {name:'自己可见', value:1},
                ];
            }
        },
        mounted () {
            this.pageInit();

        },
        components: {
            DxForm,
            DxItem,
            DxButton,
        }
    };
</script>
<style lang="scss">

    .form-avatar {
        float: left;
        height: 120px;
        width: 120px;
        margin-right: 20px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-color: #fff;
        overflow: hidden;

        img {
            height: 120px;
            display: block;
            margin: 0 auto;
        }
    }
</style>

