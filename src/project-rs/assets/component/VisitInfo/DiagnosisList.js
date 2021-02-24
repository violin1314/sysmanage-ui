import React, { Component } from 'react';
import { Table } from 'antd';

class DiagnosisList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list
        })
    }
    render() {
        const columns = [
            { title: '主从诊断标识', dataIndex: 'l_main_icd', align: 'center'},
            { title: '西医诊断编码', dataIndex: 'l_icd', align: 'center'},
            { title: '西医诊断名称', dataIndex: 'l_icd_name', align: 'center'},
            { title: '诊断日期', dataIndex: 'i_icd_dtime', align: 'center'},
            { title: '诊断顺位', dataIndex: 'l_icd_position', align: 'center'}
        ]
        const props = {
            rowKey: record => record.l_icd + record.l_icd_position,
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false,
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default DiagnosisList;