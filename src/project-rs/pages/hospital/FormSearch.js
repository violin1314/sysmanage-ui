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
            <Form layout="inline" onSubmit={ this.searchSubmit }>
                <Form.Item label="医院名称">
                    {getFieldDecorator('orgName')(
                        <Input placeholder="请输入医院名称" autoComplete="off" />
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