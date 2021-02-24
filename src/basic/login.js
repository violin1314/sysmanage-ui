import React, { Component } from 'react';
import { Form, Checkbox, Input, Button } from 'antd';
import http from '@/utils/http'
import '@/common/sass/login.scss'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            isCheck: false
        }
    }
    componentDidMount(){
        if(localStorage.account){
			this.setState({
				isCheck: true
			})
			this.props.form.setFieldsValue({
				account: localStorage.account,
				password: localStorage.password
			})
		}
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login-box">
				<Form onSubmit={this.handleSubmit} className="login-form">
					<div className="login-title">商保两核服务系统</div>
					<Form.Item className="login-input">
						{getFieldDecorator('account', {
							rules: [{ required: true, message: '请输入用户名！' }],
						})(
							<Input size="large" placeholder="请输入用户名" />
						)}
					</Form.Item>
					<Form.Item  className="login-input password-input">
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码！' }],
						})(
							<Input size="large" type="password" placeholder="请输入密码" />
						)}
					</Form.Item>
					<Form.Item style={{ paddingLeft: 10}}>
						<Checkbox checked={this.state.isCheck} onChange={this.onChange}>记住密码</Checkbox>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" className="login-button">登录</Button>
					</Form.Item>
				</Form>
			</div>
        )
    }
    onChange = (e) => {
		this.setState({
			isCheck: e.target.checked
		})
	}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                http.post('/api/console/auth/login', values, { isLoading: true }).then(res => {
					sessionStorage.setItem('userInfo', JSON.stringify(res))
					sessionStorage.setItem('cityList', JSON.stringify([{
						cityCode: res.city_code,
						cityName: res.city_name
					}]))
                    if(this.state.isCheck){
                        localStorage.account = values.account
                        localStorage.password = values.password
                    }else{
                        localStorage.account = ''
                        localStorage.password = ''
                    }
                    localStorage.loginAccount = values.account
                    this.props.history.push('/home')
                })
            }
        })
    }
}

Login = Form.create()(Login);
export default Login;