import React, { Component } from 'react';
import { Row, Col, Form, Table } from 'antd';
import http from '@/utils/http'
import Attachments from './attachments'

class HistoryInvestigate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            selectedKeys: [],
            selectedRow: {},
            attachmentsList: [],
            expandedRowKeys: []
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
                                <Form.Item label="任务发起机构">{ this.state.selectedRow.taskLaunchOrgName }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="任务发起人">{ this.state.selectedRow.taskLaunchPer }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="任务发起日期">{ this.state.selectedRow.taskLaunchDate }</Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="是否即时调查">{ this.state.selectedRow.isImmediate === '1' ? '是' : '否' }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="调查次数">{ this.state.selectedRow.timesNum }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="调查人">{ this.state.selectedRow.investigator }</Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="事故类型">{ this.state.selectedRow.accidentTypeName }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="本地/异地">{ this.state.selectedRow.isNativeName }</Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="调查完成时间">{ this.state.selectedRow.enterCompleteDate }</Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="调查机构" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.investigationOrgName } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="调查任务描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.taskDescribe } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="被保险人职业和单位" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.assuredProfessionKindName } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="案情简介" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.caseAbstract } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="调查思路及计划" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.investigationPlan } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="调查经过" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.investigationProcess } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="分析" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.analysis } </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="调查结论" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.selectedRow.investigationConclusion } </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                : ''}
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '调查机构', dataIndex: 'investigationOrgName', align: 'center'},
            { title: '调查人', dataIndex: 'investigator', align: 'center'},
            { title: '任务状态', dataIndex: 'taskStateName', align: 'center'},
            { title: '任务发起人', dataIndex: 'taskLaunchPer', align: 'center'},
            { title: '任务发起时间', dataIndex: 'taskLaunchDate', align: 'center'},
            { title: '本地/异地', dataIndex: 'isNativeName', align: 'center'},
            { title: '完成时间', dataIndex: 'enterCompleteDate', align: 'center'}
        ]
        const expandedRowRender = () => {
            return (
                <Attachments list={ this.state.attachmentsList } />
            );
        }
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
            },
            expandedRowRender : expandedRowRender,
            expandedRowKeys: this.state.expandedRowKeys,
            onExpand : this.getAttachmentList
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
    getAttachmentList = (expanded, record) =>{
        if(!expanded){
            this.setState({
                expandedRowKeys: []
            })
            return
        }
        this.setState({
            expandedRowKeys: [record.id],
            attachmentsList: []
        })
        let data = {
            investigationId: record.id,
            cityCode: record.cityCode
        }
        http.post('/rs/api/claim/investigationAttachment/findAttachmentList', data).then(res => {
            this.setState({
                attachmentsList: res
            })
        })
    }
}
export default HistoryInvestigate;