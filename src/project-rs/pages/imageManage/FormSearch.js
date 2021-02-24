import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, Select, DatePicker } from 'antd';
import utils from '@/utils'

class FormSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reporterChannels: [],
            cancelFlags: [],
            caseStates: []
        }
    }
    componentDidMount() {
        utils.getCodeList(['reporter_channel', 'cancel_flag', 'case_state'], res => {
            this.setState({
                reporterChannels: res[0].value,
                cancelFlags: res[1].value,
                caseStates: res[2].value
            })
        })
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
                        <Form.Item label="报案号">
                            {getFieldDecorator('reportNo')(
                                <Input placeholder="请输入报案号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="报案人姓名">
                            {getFieldDecorator('reporterName')(
                                <Input placeholder="请输入报案人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="被保险人姓名">
                            {getFieldDecorator('insuredName')(
                                <Input placeholder="请输入被保险人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="被保险人身份证号">
                            {getFieldDecorator('idCode')(
                                <Input placeholder="请输入被保险人身份证号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="报案方式">
                            {getFieldDecorator('reporterChannel')(
                                <Select placeholder="请选择报案方式">
                                {
                                    this.state.reporterChannels.map(item => (
                                        <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                    ))
                                }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="报案日期">
                            {getFieldDecorator('acceptDateRange')(
                                <DatePicker.RangePicker
                                    placeholder={['开始日期', '终止日期']}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={8}>
                        <Form.Item label="出险日期">
                            {getFieldDecorator('accidentDateRange')(
                                <DatePicker.RangePicker
                                    placeholder={['开始日期', '终止日期']}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="案件状态">
                            {getFieldDecorator('caseStateList')(
                                <Select mode="multiple" allowClear placeholder="请选择案件状态">
                                {
                                    this.state.caseStates.map(item => (
                                        <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                    ))
                                }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={this.searchReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
    searchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            values.acceptDateRange = values.acceptDateRange && values.acceptDateRange.length > 0 ? [values.acceptDateRange[0].format('YYYY-MM-DD'), values.acceptDateRange[1].format('YYYY-MM-DD')] : undefined
            values.accidentDateRange = values.accidentDateRange && values.accidentDateRange.length > 0 ? [values.accidentDateRange[0].format('YYYY-MM-DD'), values.accidentDateRange[1].format('YYYY-MM-DD')] : undefined

            this.props.query(values)
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        let data = {}
        this.props.query(data)
    }
}
FormSearch = Form.create()(FormSearch)
export default FormSearch;