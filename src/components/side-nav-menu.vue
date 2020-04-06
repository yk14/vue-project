<template>
  <div class="side-navigation-menu">
      <slot />
      <div class="menu-container">
          <dx-tree-view
                  id="simple-treeview"
                  :items="products"
                  :search-enabled="true"
                  search-mode="contains"
                  key-expr="id"
                  display-expr="text"
                  @item-click="selectItem"
          >

          </dx-tree-view>

      </div>
      <!--<div
              v-if="currentItem.price"
              id="product-details"
      >
          <img :src="currentItem.image">
          <div class="name">{{ currentItem.text }}</div>
          <div class="price">{{ "$" + currentItem.price }}</div>
      </div>-->
  </div>
</template>

<script>
    import {
        DxTreeView
    } from 'devextreme-vue';

    export default {
        components: {
            DxTreeView
        },
        data() {
            return {
                originProducts: [],
                products: [{
                    id: '0',
                    text: '主页',
                    expanded: false,
                    path: '/home',
                    items:[]
                },{
                    id: '1',
                    text: '报表管理',
                    expanded: false,
                    path: '/reportManager',
                    items:[]
                }],
                currentItem: {
                    id: '0',
                    text: '主页',
                    expanded: false,
                    path: '/home',
                    items:[]
                },
                reportList: [],
            };
        },
        computed: {
            refresh(){
              return this.$store.state.refresh;
            },
            mode(){
                return this.$store.state.mode;
            },
            current_item(){
                return this.$store.state.current_item;
            }
        },
        watch: {//使用vuex监听路由参数变化，动态修改左侧菜单栏。
            refresh(){
                this.pageInit();
            },
            mode() {
                this.modeChanged();
            },
            current_item(){
                this.currentItemChanged();
            }
        },
        methods: {

            pageInit(){
                let _this = this;
                _this.reportList = [];
                let executeParam = 'select ID,Name from dbo.DataExplorerJsonType order by ID'
                let Base64executeParam =this.$Base64.Base64.encode(executeParam)
                let executeParams = encodeURIComponent(Base64executeParam);
                let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                let count = 1;
                _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                    let d;
                    //解决IE无法解析数据格式问题
                    if (typeof data.data === 'string') {
                        d = JSON.parse(data.data)
                    } else{
                        d=data.data
                    }
                    _this.originProducts = d;
                    //查询到的报表数据放入菜单
                    if (d.length > 0) {
                        let arr = [{
                            id: '0',
                            text: '主页',
                            expanded: false,
                            path: '/home',
                            items:[]
                        }, {
                            id: '1',
                            text: '报表管理',
                            expanded: false,
                            path: '/reportManager',
                            items:[]
                        }]
                        for (let i=2;i<d.length+2;i++){
                            let executeParam = 'exec dbo.usp_GetReportByTypeId ' + d[i-2].ID
                            let Base64executeParam =_this.$Base64.Base64.encode(executeParam)
                            let executeParams = encodeURIComponent(Base64executeParam);
                            let serviceUrl = window.GlobalVariable.ReportServiceUrl + executeParams
                            _this.$com.CallWCFSvc(serviceUrl, true, 'GET', function (data) {
                                let dd;
                                //解决IE无法解析数据格式问题
                                if (typeof data.data === 'string') {
                                    dd = JSON.parse(data.data)
                                } else{
                                    dd = data.data
                                }
                                let arrItem=[]
                                let count = 1;
                                for (let j = 0; j < dd.length; j++) {
                                    //data[i][1]为报表名称
                                    arrItem.push({
                                        id:`${i}_${count++}`,
                                        text: dd[j].DEC,
                                        expanded: false,
                                        propPath: dd[j].PropURL, //PropPath
                                        contentPath: dd[j].ContentURL, //ContentPath
                                        report_id: dd[j].ID
                                    })
                                }
                                arr.push({
                                    id:i,
                                    text: d[i-2].Name,
                                    expanded: true,
                                    type_id: d[i-2].ID,
                                    items: arrItem
                                })
                                }
                            )
                        }
                        _this.products = arr
                    }


                })

                if(this.$store.state.current_item != '{}'){
                    this.currentItem = JSON.parse(this.$store.state.current_item);
                }
                this.selectItem(this.currentItem);

            },
            modeChanged() {
                let mode = Number(this.$store.state.mode)
                if (this.currentItem.path) {
                    this.$router.push({path: this.currentItem.path});
                } else if(!this.currentItem.items) {
                    switch (mode) {
                        case 1: {
                            this.$router.push({path:this.currentItem.contentPath});
                            break;
                        }
                        case 2: {
                            this.$router.push({path:this.currentItem.propPath});
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                }

            },
            currentItemChanged() {
                this.currentItem = JSON.parse(this.$store.state.current_item);
            },
            selectItem(e) {
                this.menuEditable = !this.menuEditable;
                let item;
                //如果是人工选择
                if(e.itemData){
                    item = e.itemData;
                    this.renderSelectItem(item);

                    const pointerEvent = e.event;
                    pointerEvent.stopPropagation();
                }
                //刷新渲染
                else {
                    //如果报表已经被删除，则默认选择主页项
                    if (!e.path) {
                        if(this.products[1].items.findIndex(item => item.report_id = e.report_id) == -1){
                            this.$store.commit('set_current_item', {
                                id: '0',
                                text: '主页',
                                expanded: false,
                                path: '/home',
                                items:[]
                            });
                        }
                    }

                    item = e;
                    this.renderSelectItem(item);
                }
            },
            renderSelectItem(e){
                //如果是大目录
                if (e.path) {
                    this.$router.push({path: e.path});
                } else if(!e.items) {
                    let mode = Number(this.$store.state.mode);
                    switch (mode) {
                        case 1: {
                            this.$router.push({path:e.contentPath});
                            break;
                        }
                        case 2: {
                            this.$router.push({path:e.propPath});
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                }
                //更新当前页面数据
                if (e.expanded == false) {//解决点击左侧所属类型，数据更新问题
                    this.$store.commit('set_current_item', JSON.stringify(e))
                }
            }
        },
        mounted (){
            document.getElementById('simple-treeview')
            .getElementsByClassName('dx-treeview-search')[0]
            .getElementsByClassName('dx-texteditor-container')[0]
            .getElementsByClassName('dx-texteditor-input-container')[0]
            .getElementsByClassName('dx-placeholder')[0].setAttribute('data-dx_placeholder', '搜索');
            this.pageInit();
        },
    }
</script>
<style>
    #simple-treeview > .dx-treeview-search{
        height: 50px!important;

    }
</style>
<style lang="scss" scoped>

    @import "../dx-styles.scss";
    @import "../themes/generated/variables.additional.scss";
    #simple-treeview, #product-details {
        display: inline-block;
    }

    #simple-treeview {
        margin-left: 10px;
        margin-right: 10px;

    }
    /*#simple-treeview .dx-swatch-additional.dx-texteditor .dx-editor-underlined{
        height: 60px!important;
    }*/


    #product-details {
        vertical-align: top;
        width: 400px;
        height: 420px;
        margin-left: 20px;
    }

    #product-details > img {
        border: none;
        height: 300px;
        width: 400px;
    }

    #product-details > .name {
        text-align: center;
        font-size: 20px;
    }

    #product-details > .price {
        text-align: center;
        font-size: 24px;
    }

    .dark #product-details > div {
        color: #f0f0f0;
    }

    .hidden {
        visibility: hidden;
    }
    .side-navigation-menu {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        height: 100%;
        width: 250px !important;

        .menu-container {
            display: flex;
            flex: 1;

            .dx-treeview {
                // ## Long text positioning
                white-space: nowrap;
                // ##

                // ## Icon width customization
                .dx-treeview-item {
                    padding-left: 0;
                    padding-right: 0;

                    .dx-icon {
                        width: $side-panel-min-width !important;
                        margin: 0 !important;
                    }
                }
                // ##

                // ## Arrow customization
                .dx-treeview-node {
                    padding: 0 0 !important;
                }

                .dx-treeview-toggle-item-visibility {
                    right: 10px;
                    left: auto;
                }

                .dx-rtl .dx-treeview-toggle-item-visibility {
                    left: 10px;
                    right: auto;
                }
                // ##

                // ## Item levels customization
                .dx-treeview-node {
                    &[aria-level="1"] {
                        font-weight: bold;
                        border-bottom: 1px solid $base-border-color;
                    }

                    &[aria-level="2"] .dx-treeview-item-content {
                        font-weight: normal;
                        padding: 0 $side-panel-min-width;
                    }
                }
                // ##
            }

            // ## Selected & Focuced items customization
            .dx-treeview {
                .dx-treeview-node-container {
                    .dx-treeview-node {
                        &.dx-state-selected:not(.dx-state-focused) > .dx-treeview-item {
                            background: transparent;
                        }

                        &.dx-state-selected > .dx-treeview-item * {
                            color: $base-accent;
                        }

                        &:not(.dx-state-focused) > .dx-treeview-item.dx-state-hover {
                            background-color: lighten($base-bg, 4);
                        }
                    }
                }
            }

            .dx-theme-generic .dx-treeview {
                .dx-treeview-node-container
                .dx-treeview-node.dx-state-selected.dx-state-focused
                > .dx-treeview-item
                * {
                    color: inherit;
                }
            }
            // ##
        }
    }

</style>
