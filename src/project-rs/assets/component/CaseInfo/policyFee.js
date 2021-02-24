import React, { Component } from 'react';
import { Table } from 'antd';

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class PolicyFee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list ? this.props.list : []
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list ? nextProps.list : []
        })
    }
    render() {
        return (
            <div>
                { this.renderList() }
            </div>
        )
    }
    renderList(){
        let columns = [
            { title: '保单号', dataIndex: 'policyNo', align: 'center', width: 140 },
            { title: '险种', dataIndex: 'insuranceCode', align: 'center', width: 80 },
            { title: '赔案号', dataIndex: 'indemnityCaseNo', align: 'center', width: 160 },
            { title: '给付责任名称', dataIndex: 'payDutyName', align: 'center', width: 200 },
            { title: '免赔额抵扣', dataIndex: 'franchisePay', align: 'center', width: 100 },
            { title: '商保赔付金额', dataIndex: 'insurancePay', align: 'center', width: 100 },
            { title: '本次计算前免赔额抵扣累计', dataIndex: 'beforeOldFranchisePay', align: 'center', width: 200 },
            { title: '本次计算前理赔金累计', dataIndex: 'beforeOldInsurancePay', align: 'center', width: 200 },
            { title: '合规费用', dataIndex: 'complianceFee', align: 'center', width: 100 },
            { title: '次免赔额', dataIndex: 'singleFranchise', align: 'center', width: 100 }
        ]
        if(this.state.list.length > 0 && OTHERCODES.indexOf(this.state.list[0].insuranceCode) !== -1){
            columns = columns.concat([
                { title: '赔付比例', dataIndex: 'punishmentPayProportion', align: 'center', width: 100 }
            ])
        }else{
            columns = columns.concat([
                { title: '赔付比例', dataIndex: 'onePayProportion', align: 'center', width: 100 },
                { title: '罚则比例', dataIndex: 'punishmentPayProportion', align: 'center', width: 100 }
            ])
        }
        columns = columns.concat([
            { title: '其他扣除', dataIndex: 'otherDeductMoney', align: 'center', width: 100 },
            { title: '扣款金额', dataIndex: 'personDeductMoney', align: 'center', width: 100 },
            { title: '限额', dataIndex: 'limitMoney', align: 'center', width: 100 },
            { title: '计算公式', dataIndex: 'comFormula', align: 'center' }
        ])

        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false,
            tableLayout: 'auto',
            scroll: { x: 2800 }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default PolicyFee;