<!--文件管理页面 -->
<template>
    <div style="height:100%">
        <dx-toolbar class="header-toolbar">
            <dx-item
                    location="before"
            >
            </dx-item>
        </dx-toolbar>

        <div class="content-block dx-card responsive-paddings">
            <form
                    id="form"
                    :ref="formRefName"
                    method="post"
                    :action="actionUrl"
                    enctype="multipart/form-data"
            >
                <div style="margin-bottom: 15px;">
                    <dx-file-uploader
                            select-button-text="选择文件"
                            label-text=""
                            :multiple="multiple"
                            accept="*"
                            upload-mode="useForm"
                            @value-changed = "uploadFile"
                    />
                    <dx-button
                            class="button"
                            text="上传"
                            type="success"
                            @click="onUploadSubmit"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<script>

    import { DxFileUploader } from 'devextreme-vue/file-uploader';
    import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
    import DxButton from 'devextreme-vue/button';
    import $ from 'jquery'
    export default {
        name: 'fileManager',
        props: {
            picture: String
        },
        data() {
            return {
                //task相关
                url:'',
                clientName:'TaskProcess',
                appDomain:'ConsumerLoan',
                taskCode:'ExportReportData',
                Variables: [],
                VariableTemp: '<SessionVariable><Name>{0}</Name><Value>{1}</Value><DataType>{2}</DataType><IsConstant>{3}</IsConstant><IsKey>{4}</IsKey><KeyIndex>{5}</KeyIndex></SessionVariable>',
                //文件上传
                multiple: false,//是否支持多文件
                Files : [],
                formRefName:'Upload',
                actionUrl:'',
            };
        },
        computed: {
            pageChange () {
                return this.$store.state.current_item;
            }
        },
        watch: {
            pageChange () {
                //this.pageInit();
            }
        },
        methods: {
            TaskTest(){
                let _this = this
                _this.Variables = []
                var newDate = new Date().getTime();
                var url = "E:\\" + newDate + '.csv';
                let DB = 'TrustManagement'
                let DBServer = 'mssql'
                let sqlSelete ='SELECT [Id],ap.[TrustId],t.TrustCode,t.TrustName,[Term]\n' +
                    ',convert(nvarchar,[PayDate],20) as PayDate,[PaymentAmount],[Interest]\n' +
                    ',[Corpus],[Other],[PaymentProperty],[PaymentStatus],ap.[PaymentType]\n' +
                    ',[CollectionOrganisation],[CollectionAccount],[CollectionAccountBank],[SupervisionOrganisation]\n' +
                    ',[SupervisionAccountBank],[SupervisionAccount],[PaymentOrganisation],[PaymentAccount],[PaymentId]\n' +
                    '  FROM [TrustManagement].[Asset].[ABSActualPayment] as ap\n' +
                    '  inner join TrustManagement.TrustManagement.Trust as t\n' +
                    '  on ap.TrustId=t.TrustId'
                _this.AddVariableItem('DBName', DB, 'String');
                _this.AddVariableItem('DBServer', DBServer, 'String');
                _this.AddVariableItem('ExportFile', url, 'String');
                _this.AddVariableItem('Query', sqlSelete, 'String');
                _this.Variables = _this.BuildVariables()
                _this.url  = window.GlobalVariable.TaskProcessUrl+'?clientName='
                    + _this.clientName + '&appDomain=' + _this.appDomain + '&taskCode=' + _this.taskCode + '&sContext=' + encodeURIComponent(_this.Variables.toString());
                _this.show()

            },
            uploadFile(e){
                this.Files = e.value
                let FileName = ''
                if (this.Files.length>0) {
                    FileName=this.Files[0].name
                }
                this.actionUrl =window.GlobalVariable.DataProcessServiceUrl+'FileUpload?fileName=' + FileName + '&fileFolder=IncludeExcludeAsset'
            },
            onUploadSubmit(){
                let form = this.$refs[this.formRefName];
                form.submit();
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
            show: function () {
                let _this =this
                $.anyDialog({
                    title: '任务处理',
                    url: _this.url,
                    height: 550,
                    width: 500,
                    scrollable: true,
                    isMaskClickToClose: false,
                    dragable: true,
                    onClose: function () {
                        console.log('back')
                    }
                })
            },
        },
        mounted () {

        },
        components: {
            DxButton,
            DxToolbar,
            DxItem,
            DxFileUploader
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

