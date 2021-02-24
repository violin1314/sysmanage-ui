import React, { Component } from 'react';
import { Table } from 'antd';

class FeeDetailList extends Component {
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
            { title: '医院项目编码', dataIndex: 'hcode', align: 'center', width: 100},
            { title: '医院项目名称', dataIndex: 'hname', align: 'center', width: 100},
            { title: '医保项目编码', dataIndex: 'code', align: 'center', width: 100},
            { title: '医保项目名称', dataIndex: 'name', align: 'center', width: 100},
            { title: '项目类别', dataIndex: 'categoryName', align: 'center', width: 60},
            { title: '收费项目等级', dataIndex: 'chargeLevel', align: 'center', width: 60},
            { title: '单价', dataIndex: 'price', align: 'center', width: 60},
            { title: '数量', dataIndex: 'amount', align: 'center', width: 60},
            { title: '金额', dataIndex: 'fee', align: 'center', width: 60},
            { title: '自付比例', dataIndex: 'zfuPer', align: 'center', width: 60},
            { title: '自费金额', dataIndex: 'zfeFee', align: 'center', width: 60 }
        ]
        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: { pageSize: 10 },
            tableLayout: 'auto',
            scroll: { x: 1500,y: 240 }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default FeeDetailList;