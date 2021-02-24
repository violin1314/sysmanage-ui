import React, { Component } from 'react';
import { Form, Modal, Input, Select, message } from 'antd';

import http from '@/utils/http'

class Audit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            conHeight: '',

            caseId: '',
            userInfo: JSON.parse(sessionStorage.userInfo),
            detail: {}
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            caseId: this.props.caseId,
            visible: this.props.visible
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.caseId || nextProps.caseId === this.props.caseId){
            return
        }
        this.setState({
            caseId: nextProps.caseId,
            visible: nextProps.visible,
            detail: {}
        }, () => {
            let data = {
                indemnityCaseId: nextProps.caseId
            }
            http.post('/rs/api/claim/caseCheck/findCaseCheckInfoByCaseId', data, { isLoading: true }).then(res => {
                this.setState({
                    detail: res || {}
                })
            })
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title="案件审核"
                width="600px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel }
                onOk={ this.onSubmit }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Form.Item label="审核状态">
                        {getFieldDecorator('state', {
                            rules: [{ required: true, message: '请选择审核状态' }],
                            initialValue: this.state.detail.state
                        })(
                            <Select placeholder="请选择审核状态">
                                <Select.Option value="1">通过</Select.Option>
                                <Select.Option value="0">不通过</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="审核结论">
                        {getFieldDecorator('summary', {
                            rules: [{ required: true, message: '请输入审核结论' }],
                            initialValue: this.state.detail.summary
                        })(
                            <Input.TextArea rows={3} placeholder="请输入审核结论" />
                        )}
                    </Form.Item>
                    <Form.Item label="审核意见">
                        {getFieldDecorator('oppositopn', {
                            initialValue: this.state.detail.oppositopn
                        })(
                            <Input.TextArea rows={3} placeholder="请输入审核意见" />
                        )}
                    </Form.Item>
                </Form>
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
            if(err){
                return
            }
            let data = values
            // data.operCode = this.state.userInfo.org_code

            let url = ''
            if(this.state.detail.id){
                url = '/rs/api/claim/caseCheck/updateCaseCheckInfo'
                data.id = this.state.detail.id
            }else{
                url = '/rs/api/claim/caseCheck/addCaseCheckInfo'
                data.indemnityCaseId = this.state.caseId
            }
            http.post(url, data, { isLoading: true }).then(res => {
                message.success('案件审核成功')
                this.cancel('suc')
            })
        })
    }
}
Audit = Form.create()(Audit)
export default Audit