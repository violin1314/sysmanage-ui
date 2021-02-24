import React, { Component } from 'react';
import { Table, Tabs } from 'antd';

class AllPayment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conHeight: '',
            list: [],
            current: 1
        }
    }
    componentDidMount() {
        this.init(this.props.payment)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.init(nextProps.payment)
    }
    init(payment){
        let wHeight = document.body.clientHeight;
        payment.forEach((item, index) => {
            item['key'] = index
        })
        this.setState({
            conHeight: wHeight - 180,
            list: payment
        })
    }
    render(){
        const TabPane = Tabs.TabPane
        return(
            <Tabs defaultActiveKey="1" tabPosition="left">
                <TabPane tab="处方信息" key="1">
                    <div style={{ height: this.state.conHeight, overflowY: 'auto' }}>
                        { this.renderList() }
                    </div>
                </TabPane>
            </Tabs>
        )
    }
    renderList() {
        const coulmns = [
            { title: '单据号', dataIndex: 'billNo', align: 'center' },
            { title: '项目类别名称', dataIndex: 'categoryName', align: 'center'},
            { title: '收费项目名称', dataIndex: 'name', align: 'center'},
            { title: '规格', dataIndex: 'spec', align: 'center'},
            { title: '数量', dataIndex: 'amount', align: 'center'},
            { title: '单位', dataIndex: 'unit', align: 'center'},
            { title: '单价', dataIndex: 'price', align: 'center'},
            { title: '收费项目等级', dataIndex: 'chargeLevel', align: 'center'},
            { title: '金额', dataIndex: 'fee', align: 'center'},
            { title: '最高限价', dataIndex: 'maxPrice', align: 'center'},
            { title: '处方号', dataIndex: 'presNo', align: 'center'},
            { title: '处方日期', dataIndex: 'presDt', align: 'center'},
            { title: '医院内码名称', dataIndex: 'hname', align: 'center'},
            { title: '自费金额', dataIndex: 'zfeFee', align: 'center'},
            { title: '自理金额', dataIndex: 'zliFee', align: 'center'}
        ]
        let pagination = {
            total: this.state.list.length,
            current: this.state.current,
            showTotal: total => `共 ${total} 项`,
            pageSize: 10,
            onChange: current => {
                this.setState({
                    current: current
                })
            }
        }
        const props = {
            rowKey: 'key',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: pagination,
            tableLayout: 'auto',
            scroll: { x: 2000 }
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
}
export default AllPayment;