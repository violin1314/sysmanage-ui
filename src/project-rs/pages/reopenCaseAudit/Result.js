import React, { Component } from 'react';
import { Form, Modal, Input, message } from 'antd';

import http from '@/utils/http'

class Result extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            caseId: '',
            type: ''
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.caseId,
            type: this.props.type,
            visible: this.props.visible
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.caseId || nextProps.caseId === this.props.caseId){
            return
        }
        this.setState({
            caseId: nextProps.caseId,
            type: nextProps.type,
            visible: nextProps.visible
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title={ this.state.type === '1' ? '审核通过' : '审核不通过'}
                width="600px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel.bind(this, '1') }
                onOk={ this.onSubmit }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    {
                        this.state.type === '1' ?
                        <Form.Item label="审核结论">
                            {getFieldDecorator('renewCheckConclusion', {
                                rules: [{ required: true, message: '请输入审核结论' }]
                            })(
                                <Input.TextArea rows={4} placeholder="请输入审核结论" />
                            )}
                        </Form.Item> :
                        <Form.Item label="不通过原因">
                            {getFieldDecorator('renewNoCheckReason', {
                                rules: [{ required: true, message: '请输入不通过原因' }]
                            })(
                                <Input.TextArea rows={4} placeholder="请输入不通过原因" />
                            )}
                        </Form.Item>
                    }
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
            data.id = this.state.caseId
            let url = '/rs/api/claim/renewcasecheck/saveRenewCheckCase'
            if(this.state.type === '2'){
                url = '/rs/api/claim/renewcasecheck/saveRenewNoCheckCase'
            }

            http.post(url, data, { isLoading: true }).then(res => {
                message.success(this.state.type === '1' ? '审核通过成功' : '审核拒绝成功')
                this.cancel('suc')
            })
        })
    }
}
Result = Form.create()(Result)
export default Result