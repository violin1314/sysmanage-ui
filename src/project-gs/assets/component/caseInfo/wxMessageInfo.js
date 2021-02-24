import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, DatePicker, Select } from 'antd';
import moment from 'moment'
class WxMessageInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            caseNo:''
        }
    }
    componentDidMount() {
        this.setState({
            caseNo: this.props.caseNo ? this.props.caseNo : ''
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 19 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.searchSubmit} className="form-search">
                <Row>
                    <Col span={24}>
                        <Form.Item label="消息类型">
                            {getFieldDecorator('messageType',{
                                rules: [{ required: true, message: '请选择消息类型' }]
                            })(
                                <Select placeholder="请选择消息类型">
                                    <Select.Option value="01">银行卡补传</Select.Option>
                                    <Select.Option value="02">出险人身份证补传</Select.Option>
                                    <Select.Option value="03">监护人身份证补传</Select.Option>
                                    <Select.Option value="04">监护证明补传</Select.Option>
                                    <Select.Option value="05">发票影像件问题</Select.Option>
                                    <Select.Option value="06">结案</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span={24}>
                        <Form.Item label="原因说明">
                            {getFieldDecorator('message',{
                                rules: [{ required: true, message: '请输入原因说明' }]
                            })(
                                <Input.TextArea placeholder="请输入原因说明" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button type="primary" id="$button_final_query" htmlType="submit">发送</Button>
                            <Button onClick={this.searchReset}>重置</Button>
                        </Col>
                    </Col>
                </Row>
            </Form>
        )
    }
    searchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.caseNo=this.state.caseNo;
                this.props.sendWxMessage(values)
                this.props.form.resetFields()
            }

        })
    }
    searchReset = () => {
        this.props.form.resetFields()
    }
}
WxMessageInfo = Form.create()(WxMessageInfo)
export default WxMessageInfo;
