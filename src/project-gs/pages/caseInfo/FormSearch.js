import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, DatePicker, Select } from 'antd';
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
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.searchSubmit} className="form-search">
                <Row>
                    <Col span={8}>
                        <Form.Item label="申请人身份">
                            {getFieldDecorator('applyType',{
                                rules: [{ required: false, message: '请选择申请人身份' }]
                            })(
                                <Select placeholder="请选择申请人身份">
                                    <Select.Option value="01">本人申请</Select.Option>
                                    <Select.Option value="02">监护人申请</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出险日期">
                            {getFieldDecorator('accidentDateRange')(
                                <DatePicker.RangePicker style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="案件状态">
                            {getFieldDecorator('caseState',{
                                rules: [{ required: false, message: '请选择案件状态' }]
                            })(
                                <Select placeholder="请选择案件状态">
                                    <Select.Option value="01">录入完成,待影像件</Select.Option>
                                    <Select.Option value="02">影像件完成</Select.Option>
                                    <Select.Option value="03">已推送国寿</Select.Option>
                                    <Select.Option value="04">结案</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={8}>
                        <Form.Item label="个人服务号">
                            {getFieldDecorator('claimNo')(
                                <Input placeholder="请输入个人服务号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出险人证件号">
                            {getFieldDecorator('idCode')(
                                <Input placeholder="请输入出险人证件号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出险人姓名">
                            {getFieldDecorator('insuredName')(
                                <Input placeholder="请输入出险人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" id="$button_final_query" htmlType="submit">查询</Button>
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
            if(values.accidentDateRange && values.accidentDateRange.length > 0 ){
                values.accidentDateRange = [moment(values.accidentDateRange[0]).format('YYYY-MM-DD'), moment(values.accidentDateRange[1]).format('YYYY-MM-DD')]
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