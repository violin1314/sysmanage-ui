import React, { Component } from 'react';
import { Form, Row, Col, Button, Input, Select } from 'antd';

import utils from '@/utils/index'

class FormSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reporterChannels: []
        }
    }
    componentDidMount() {
        utils.getCodeList(['reporter_channel'], res => {
            this.setState({
                reporterChannels: res[0].value
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
                        <Form.Item label="被保险人姓名">
                            {getFieldDecorator('insuredName')(
                                <Input placeholder="请输入被保险人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="被保险人身份证号">
                            {getFieldDecorator('idCode')(
                                <Input placeholder="请输入被保险人身份证号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="报案人姓名">
                            {getFieldDecorator('reporterName')(
                                <Input placeholder="请输入报案人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="报案人电话">
                            {getFieldDecorator('reporterPhone')(
                                <Input placeholder="请输入报案人电话" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="保单号">
                            {getFieldDecorator('policyNo')(
                                <Input placeholder="请输入保单号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
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
                    <Col span={ this.state.isMulti ? 8 : 16 } style={{ textAlign: 'right' }}>
                        <Button type="primary" id="$button_accept_query" htmlType="submit">查询</Button>
                        <Button onClick={ this.searchReset }>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
    searchSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
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