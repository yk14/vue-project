const products = [{
  id: '0',
  text: '主页',
  expanded: false,
    path: '/home',
    items:[]
},{
    id: '1',
    text: '报表罗列',
    expanded: true,
    items: [/*{
        id: '1_1',
        report_id: 1,
        text: '历史兑付明细',
        expanded: false,
        propPath: '/historyCashDetailProp',
        contentPath: '/historyCashDetailContent'
    },
        {
            id: '1_2',
            report_id: 2,
            text: '资金部MI明细',
            expanded: false,
            propPath: '/treasuryMIDetailProp',
            contentPath: '/treasuryMIDetailContent'
        },
        {
            id: '1_3',
            report_id: 3,
            text: '当日兑付指令清单',
            expanded: false,
            propPath: '/cashOrderProp',
            contentPath: '/cashOrderContent'
        },
        {
            id: '1_4',
            report_id: 14,
            text: '信托计划回款表',
            expanded: false,
            propPath: '/trustPlanCollectionProp',
            contentPath: '/trustPlanCollectionContent'
        },
        {
            id: '1_5',
            report_id: 15,
            text: '信托放款统计信息表',
            expanded: false,
            propPath: '/trustLoanStatisticsProp',
            contentPath: '/trustLoanStatisticsContent'
        },
        {
            id: '1_6',
            report_id: 16,
            text: '底层资产回款统计表',
            expanded: false,
            propPath: '/underAssetsCollectionProp',
            contentPath: '/underAssetsCollectionContent'
        },
        {
            id: '1_7',
            report_id: 17,
            text: '底层资产基础信息表',
            expanded: false,
            propPath: '/underAssetsInfoProp',
            contentPath: '/underAssetsInfoContent'
        },
        {
            id: '1_8',
            report_id: 18,
            text: '信托放款历史兑付明细',
            expanded: false,
            propPath: '/trustLoanHistoricalRedemptionProp',
            contentPath: '/trustLoanHistoricalRedemptionContent'
        }*/
    ]
}];

export default {
    getProducts() {
        return products;
    }
};
