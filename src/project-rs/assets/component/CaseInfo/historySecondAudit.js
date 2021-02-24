import React, { Component } from 'react';
import { Row, Col, Form, Table } from 'antd';

class HistorySecondAudit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            selectedKeys: [],
            selectedRow: {},
            attachmentsList: []
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list ? this.props.list : [],
            selectedRow: this.props.list.length ? this.props.list[0] : {},
            selectedKeys: this.props.list.length ? [this.props.list[0].id] : []
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list ? nextProps.list : [],
            selectedRow: nextProps.list.length ? nextProps.list[0] : {},
            selectedKeys: nextProps.list.length ? [nextProps.list[0].id] : []
        })
    }
    render() {
        const itemlabel = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }
        return (
            <div>
                { this.renderList() }
                { this.state.list.length > 0 ? 
                    <Form className="data-form" {...itemlabel}>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="审核状态">{ this.state.selectedRow.stateName }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="复审员">{ this.state.selectedRow.operName }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="复审次数">{ this.state.selectedRow.timesNum }</Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="复审结论" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.summary } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="复审意见" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.oppositopn } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.remark } </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                : '' }
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '复审次数', dataIndex: 'timesNum', align: 'center'},
            { title: '复审日期', dataIndex: 'operDate', align: 'center'},
            { title: '复审状态', dataIndex: 'stateName', align: 'center'},
            { title: '复审员', dataIndex: 'operName', align: 'center'}
        ]
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: false,
            rowSelection: {
                type: 'radio',
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys,
                        selectedRow: rows[0]
                    })
                }
            }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
}
export default HistorySecondAudit;