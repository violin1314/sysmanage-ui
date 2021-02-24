import React, { Component } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';

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
                        <Form.Item label="被保险人姓名">
                            {getFieldDecorator('insuredName')(
                                <Input placeholder="请输入被保险人姓名" autoComplete="off" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                    <Col span={24} style={{ textAlign: 'right' }}>
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
            this.props.query(values)
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        let data = {
            idCode: '',
            policyNo: '',
            insuredName: ''
        }
        this.props.query(data)
    }
}
FormSearch = Form.create()(FormSearch)
export default FormSearch;