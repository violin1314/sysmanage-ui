import React, { Component } from 'react';
import { Form, Modal, Row, Col, Input, Select, Button, message } from 'antd';

import http from '@/utils/http'
import EnclosureManage from './EnclosureManage'

class Check extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            conHeight: '',

            curCase: {},
            userInfo: JSON.parse(sessionStorage.userInfo),
            currentInvestigation: {},

            enclosureVisible: false,
            isInit: ''
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            curCase: this.props.case,
            visible: this.props.visible,
        }, () => {
            this.getInvestigations()
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.case.id || nextProps.case.id === this.props.case.id) {
            return
        }
        this.setState({
            curCase: nextProps.case,
            visible: nextProps.visible
        }, () => {
            this.getInvestigations()
        })
    }
    getInvestigations = () => {
        if(!this.state.curCase.id) {
            return
        }
        let data = {
            id: this.state.curCase.id,
            policyId: this.state.curCase.policyId,
            queryInvestFlag: true
        }

        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
            res.caseInvestigationInfoDs.forEach(item => {
                if(item.taskState === '0'){
                    this.setState({
                        currentInvestigation: item
                    })
                }
            })
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        }
        const formItemLayout24 = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title="稽核信息录入"
                width="1200px"
                centered
                visible={this.state.visible}
                onCancel={this.cancel}
                footer={null}
            >
                <Form {...formItemLayout} onSubmit={this.onSubmit} style={{ padding: 20 }}>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="任务发起机构" style={{ marginBottom: 0 }}>
                                { this.state.userInfo.org_name }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="任务发起人" style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.taskLaunchPer }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="任务发起日期" style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.taskLaunchDate }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="是否即时调查" style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.isImmediate === 1 ? '是' : '否' }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="调查次数" style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.timesNum }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="调查人" style={{ marginBottom: 0 }}>
                                {getFieldDecorator('investigator', {
                                    initialValue: this.state.userInfo.user_name
                                })(
                                    <Input readOnly />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="事故类型" style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.accidentTypeName }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="本地/异地" style={{ marginBottom: 0 }}>
                                {getFieldDecorator('isNative', {
                                    rules: [{ required: true, message: '本地/异地' }],
                                    initialValue: '01'
                                })(
                                    <Select placeholder="请选择" style={{ width: '100%' }} >
                                        <Select.Option value='01'>本地</Select.Option>
                                        <Select.Option value="02">异地</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="调查机构" style={{ marginBottom: 0 }}>
                                {getFieldDecorator('investigationOrg', {
                                    initialValue: this.state.userInfo.org_name
                                })(
                                    <Input readOnly />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="调查任务描述" {...formItemLayout24} style={{ marginBottom: 0 }}>
                                { this.state.currentInvestigation.taskDescribe }
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="被保险人职业和单位" {...formItemLayout24} style={{ marginBottom: 5 }}>
                                {getFieldDecorator('assuredProfessionKind', {
                                    initialValue: this.state.currentInvestigation.assuredProfessionKind
                                })(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="案情简介" {...formItemLayout24} style={{ marginBottom: 5 }}>
                                {getFieldDecorator('caseAbstract')(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="调查思路及计划" {...formItemLayout24} style={{ marginBottom: 5 }}>
                                {getFieldDecorator('investigationPlan')(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="调查经过" {...formItemLayout24} style={{ marginBottom: 5 }}>
                                {getFieldDecorator('investigationProcess')(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="分析" {...formItemLayout24} style={{ marginBottom: 5 }}>
                                {getFieldDecorator('analysis')(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="调查结论" {...formItemLayout24}>
                                {getFieldDecorator('investigationConclusion', {
                                    rules: [{ required: true, message: '请录入调查结论' }]
                                })(
                                    <Input.TextArea rows={2} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button onClick={this.cancel} style={{ marginLeft: 20 }}>返回</Button>
                        <Button type="primary" style={{ marginLeft: 20 }} onClick={ this.shwoEnclosure }>上传附件</Button>
                    </div>
                </Form>

                <Modal
                    className="modal-detail"
                    title="附件管理"
                    width="1000px"
                    centered
                    visible={ this.state.enclosureVisible }
                    onCancel={ this.closeEnclosure }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                        <EnclosureManage currentInvestigation={ this.state.currentInvestigation } isInit={ this.state.isInit } onClose={ this.closeEnclosure } />
                    </div>
                </Modal>
            </Modal>
        )
    }

    cancel = flag => {
        this.props.form.resetFields()
        this.setState({
            visible: false
        })
        this.props.onClose(flag)
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err) {
                return
            }
            let data = values
            data.id = this.state.currentInvestigation.id
            data.indemnityCaseId = this.state.curCase.id
            data.taskState = '1'
            data.taskDescribe = this.state.currentInvestigation.taskDescribe
            http.post('/rs/api/claim/investigation/updateInvestigation', data, { isLoading: true }).then(res => {
                message.success('稽核成功')
                this.cancel('suc')
            })
        })
    }

    shwoEnclosure = () => {
        this.setState({
            enclosureVisible: true,
            isInit: '1'
        })
    }
    closeEnclosure = () => {
        this.setState({
            enclosureVisible: false,
            isInit: ''
        })
    }
}
Check = Form.create()(Check)
export default Check