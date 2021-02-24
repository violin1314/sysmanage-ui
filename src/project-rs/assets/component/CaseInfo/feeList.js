import React, { Component } from 'react';
import { Table, Button } from 'antd';
import http from '@/utils/http'

class FeeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            curCase: {}
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list ? this.props.list : [],
            curCase: this.props.curCase ? this.props.curCase : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list ? nextProps.list : [],
            curCase: nextProps.curCase ? nextProps.curCase : {}
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
            { title: '项目名称', dataIndex: 'projectName', align: 'center' },
            { title: '收费项目等级', dataIndex: 'feeProjectGradeName', align: 'center', width: '15%' },
            { title: '单价', dataIndex: 'price', align: 'center', width: '10%' },
            { title: '数量', dataIndex: 'num', align: 'center', width: '10%' },
            { title: '乙类自理金额', dataIndex: 'partSelfAmnt', align: 'center', width: '15%' },
            { title: '自费金额', dataIndex: 'selfAmnt', align: 'center', width: '10%' },
            { title: '金额', dataIndex: 'money', align: 'center', width: '10%' }
        ]
        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false,
            tableLayout: 'auto',
            scroll: { y: this.props.isExport ? 348 : 390 }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                {
                    this.props.isExport &&
                    <div style={{ paddingBottom: 10 }}>
                        <Button type="primary" onClick={ this.export } disabled={ this.state.list.length === 0 }>导出</Button>
                    </div>
                }
                <Table bordered className="list-table table-nowrap" {...props} />
            </div>
        )
    }
    export = () => {
        let data = {
            id: this.state.curCase.id,
            reportNo: this.state.curCase.reportNo
        }
        let opts = {
            isLoading: true,
            fileName: this.state.curCase.reportNo + '_费用信息.xls'
        }
        http.postDownFile('/rs/api/claim/export/exportDetailFile', data, opts).then(res => {})
    }
}
export default FeeList;