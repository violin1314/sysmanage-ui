import React, { Component } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';

import http from '@/utils/http'

class EnclosureProble extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indemnityCaseId: '',
            visible: false,
            item: {}
        }
    }
    componentDidMount() {
        this.setState({
            indemnityCaseId: this.props.indemnityCaseId,
            visible: this.state.visible,
            item: this.props.item
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            indemnityCaseId: nextProps.indemnityCaseId,
            visible: nextProps.visible,
            item: nextProps.item
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title={this.state.item ? '处理问题件' : '问题件通知' }
                width="500px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel }
                footer={ null }
            >
                <div className="modal-detail-content">
                    <Form {...formItemLayout} onSubmit={ this.query } style={{ marginTop: 20 }}>
                        <Form.Item label="原因">
                            {getFieldDecorator('reason', {
                                rules: [{ required: true, message: '请输入原因' }]
                            })(
                                <Input.TextArea placeholder="请输入原因" rows={4} />
                            )}
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: 20, paddingBottom: 20  }}>
                            <Button type="primary" htmlType="submit">确定</Button>
                            <Button onClick={ this.cancel } style={{ marginLeft: 10 }}>取消</Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
    query = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            let data = {
                indemnityCaseId: this.state.indemnityCaseId,
                reason: values.reason
            }
            let url = '/rs/api/claim/problempiecs/push'
            if(this.state.item){
                data = {
                    policyNo: this.state.item.policyNo,
                    casrptNo: this.state.item.reportNo,
                    problemItemNo: this.state.item.problemNo,
                    revokeReason: values.reason
                }
                url = '/rs/api/claim/problempiecs/cancel'
            }
            http.post(url, data, { isLoading: true }).then(res => {
                message.success(this.state.item ? '问题件撤销成功' : '问题件通知成功')
                this.cancel(this.state.item ? 'suc' : '')
            })
        })
    }
    cancel = flag => {
        this.props.form.resetFields()
        this.setState({
            visible: false
        })
        this.props.onClose(flag)
    }
}
EnclosureProble = Form.create()(EnclosureProble)
export default EnclosureProble;