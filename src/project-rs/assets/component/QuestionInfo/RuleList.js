import React, { Component } from 'react';
import { Table } from 'antd';

class RuleList extends Component {
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
            { title: '规则编号', dataIndex: 'ruleCode', align: 'center' },
            { title: '规则名称', dataIndex: 'ruleName', align: 'center' }
        ]
        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false,
            expandedRowRender: record => (
                <p>{ record.ruleDescribe }</p>
            )
        }
        return(
            <div>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default RuleList;