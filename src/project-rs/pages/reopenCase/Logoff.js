import React, { Component } from 'react';
import { Form, Modal, Input, message } from 'antd';

import http from '@/utils/http'

class Logoff extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            caseId: ''
        }
    }
    componentDidMount() {
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
                title="注销"
                width="600px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel.bind(this, '1') }
                onOk={ this.onSubmit }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Form.Item label="注销原因">
                        {getFieldDecorator('renewCaseCancelReason', {
                            rules: [{ required: true, message: '请输入注销原因' }]
                        })(
                            <Input.TextArea rows={4} placeholder="请输入注销原因" />
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
            data.id = this.state.caseId

            http.post('/rs/api/claim/renewcaseinfo/cancelRenewCaseInfo', data, { isLoading: true }).then(res => {
                message.success('注销成功')
                this.cancel('suc')
            })
        })
    }
}
Logoff = Form.create()(Logoff)
export default Logoff