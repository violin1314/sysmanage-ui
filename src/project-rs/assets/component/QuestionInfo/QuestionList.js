import React, { Component } from 'react';
import { Table, Tooltip, Icon, message, Modal } from 'antd';

import http from '@/utils/http';
const { confirm } = Modal

class QuestionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            caseId: '',
            readOnly: false
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list,
            caseId: this.props.caseId,
            readOnly: this.props.readOnly
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list,
            caseId: nextProps.caseId,
            readOnly: nextProps.readOnly
        })
    }
    render() {
        const columns = [
            { title: '疑点名称', dataIndex: 'pointName', align: 'center'},
            { title: '疑点编号', dataIndex: 'pointNum', align: 'center'},
            { title: '审核规则', dataIndex: 'ruleName', align: 'center'},
            { title: '备注', dataIndex: 'remark', align: 'center'}
        ]
        if(!this.state.readOnly){
            columns.push( {
                title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="删除" onClick={ this.delete.bind(this, record) }>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                )
            })
        }

        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false
        }
        return(
            <div>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }

    delete = record => {
        confirm({
            title: '提示',
            content: '确定要删除疑点吗？',
            onOk: () => {
                let data = {
                    id: record.id,
                    indemnityCaseId: this.state.caseId
                }
                http.post('/rs/api/claim/question/deleteCaseQuestionablePoint', data, { isLoading: true }).then(res => {
                    message.success('删除疑点成功')
                    this.props.onSuc()
                })
            }
        })
    }
}
export default QuestionList;