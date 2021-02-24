import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, DatePicker, InputNumber, message } from 'antd';
import moment from 'moment'
class FormSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.searchSubmit} className="form-search">
                <Row>
                    <Col span={8}>
                        <Form.Item label="身份证号">
                            {getFieldDecorator('idCode')(
                                <Input placeholder="请输入身份证号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="个人保单号">
                            {getFieldDecorator('policyNo')(
                                <Input placeholder="请输入个人保单号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="报案号">
                            {getFieldDecorator('reportNo')(
                                <Input placeholder="请输入报案号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={8}>
                        <Form.Item label="报案日期">
                            {getFieldDecorator('acceptDateRange')(
                                <DatePicker.RangePicker style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="赔付金额">
                            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                                {getFieldDecorator('insurancePayDown')(
                                    <InputNumber min={0} placeholder="最小值" style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                            <span style={{ display: 'inline-block', width: 24, textAlign: 'center' }}>-</span>
                            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                                {getFieldDecorator('insurancePayUp')(
                                    <InputNumber min={0} placeholder="最大值" style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="案件受理人">
                            {getFieldDecorator('caseAcceptOper')(
                                <Input placeholder="请输入案件受理人" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{ textAlign: 'right', marginTop: 10 }}>
                        <Button type="primary" id="$button_final_query" htmlType="submit">查询</Button>
                        <Button onClick={this.searchReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
    searchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(values.acceptDateRange && values.acceptDateRange.length > 0 ){
                values.acceptDateRange = [moment(values.acceptDateRange[0]).format('YYYY-MM-DD'), moment(values.acceptDateRange[1]).format('YYYY-MM-DD')]
            }
            if(values.insurancePayDown && values.insurancePayUp && (values.insurancePayDown > values.insurancePayUp) ){
                message.error('赔付金额范围不合规，请重新输入')
                return
            }
            this.props.query(values)
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        this.props.query({})
    }
}
FormSearch = Form.create()(FormSearch)
export default FormSearch;