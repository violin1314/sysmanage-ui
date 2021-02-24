import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';

class FormSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={ this.searchSubmit } className="form-search">
                <Form.Item label="姓名">
                    {getFieldDecorator('insuredName')(
                        <Input placeholder="请输入姓名" autoComplete="off" />
                    )}
                </Form.Item>
                <Form.Item label="身份证号">
                    {getFieldDecorator('idCode')(
                        <Input placeholder="请输入身份证号" autoComplete="off" style={{ width: 200 }} />
                    )}
                </Form.Item>
                <Form.Item label="保单号">
                    {getFieldDecorator('policyNo')(
                        <Input placeholder="请输入保单号" autoComplete="off" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button onClick={ this.searchReset }>重置</Button>
                </Form.Item>
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