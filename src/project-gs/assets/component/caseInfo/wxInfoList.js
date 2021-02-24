import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
class WxInfoList extends Component {
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
            { title: '时间', dataIndex: 'createdTime', align: 'center', width: '20%',
                render: (text, r) => <span style={{ color: r.color }}>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
            },
            { title: '赔案号', dataIndex: 'indemnityCaseNo', align: 'center', width: '10%'},
            { title: '类型', dataIndex: 'wxMessageName', align: 'center', width: '20%'},
            { title: '消息内容', dataIndex: 'wxMessageInfo', align: 'center', width: '50%'},
        ]
        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: { pageSize: 10 },
            tableLayout: 'auto',
            // scroll: { x: 1500,y: 240 }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default WxInfoList;
