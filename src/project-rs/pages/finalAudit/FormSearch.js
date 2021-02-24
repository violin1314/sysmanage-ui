import React, { Component } from 'react';
import { Row, Col, Form, Button, Input, DatePicker } from 'antd';
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
                        <Form.Item label="被保险人身份证号">
                            {getFieldDecorator('idCode')(
                                <Input placeholder="请输入被保险人身份证号" autoComplete="off" />
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
                        <Form.Item label="赔案号">
                            {getFieldDecorator('indemnityCaseNo')(
                                <Input placeholder="请输入赔案号" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={8}>
                        <Form.Item label="立案日期">
                            {getFieldDecorator('caseDateRange')(
                                <DatePicker.RangePicker style={{ width: '100%' }} />
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
                    <Col span={8} style={{ textAlign: 'right' }}>
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
            if(values.caseDateRange && values.caseDateRange.length > 0 ){
                values.caseDateRange = [moment(values.caseDateRange[0]).format('YYYY-MM-DD'), moment(values.caseDateRange[1]).format('YYYY-MM-DD')]
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