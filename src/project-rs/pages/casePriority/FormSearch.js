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
                <Form.Item label="报案号">
                    {getFieldDecorator('reportNo')(
                        <Input placeholder="请输入报案号" autoComplete="off" />
                    )}
                </Form.Item>
                <Form.Item label="被保险人姓名">
                    {getFieldDecorator('insuredName')(
                        <Input placeholder="请输入被保险人姓名" autoComplete="off" />
                    )}
                </Form.Item>
                <Form.Item label="被保险人身份证号">
                    {getFieldDecorator('idCode')(
                        <Input placeholder="请输入被保险人身份证号" autoComplete="off" style={{ width: 200 }} />
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