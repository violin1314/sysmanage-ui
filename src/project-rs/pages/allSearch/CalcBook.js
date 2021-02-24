import React, { Component } from 'react';
import { Row, Col } from 'antd';
import http from '@/utils/http'

class CalcBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indemnityCaseNo: '',
            detail: {},
            typeList: []
        }
    }
    componentDidMount() {
        this.setState({
            indemnityCaseNo: this.props.indemnityCaseNo
        }, () => {
            this.getData()
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.indemnityCaseNo === this.props.indemnityCaseNo){
            return
        }
        this.setState({
            indemnityCaseNo: nextProps.indemnityCaseNo,
            detail: {},
            typeList: []
        }, () => {
            this.getData()
        })
    }
    getData = () => {
        http.post('/rs/api/claim/computeBook/info', { indemnityCaseNo: this.state.indemnityCaseNo }, { isLoading: true }).then(res => {
            this.setState({
                detail: res,
                typeList: res.typeList
            })
        })
    }
    render() {
        return (
            <div>
                <table width="100%" border="1" className="calc-book">
                    <tbody>
                        <tr>
                            <td colSpan="4">
                                <p style={{ padding: 10, textAlign: 'center', fontSize: 18 }}>赔款计算书</p>
                                <Row type="flex" justify="space-between" style={{ paddingBottom: 20 }}>
                                    <Col>
                                        <p>立案号：{ this.state.detail.registerNo }</p>
                                        <p>报案号：{ this.state.detail.reportNo }</p>
                                    </Col>
                                    <Col>
                                        <p>计算书号：{ this.state.detail.computeNo }</p>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <th width="170">被保险人</th>
                            <td width="320">{ this.state.detail.assured }</td>
                            <th width="100">出险日期</th>
                            <td>{ this.state.detail.dangerDate }</td>
                        </tr>
                        <tr>
                            <th>保单号码</th>
                            <td colSpan="3">{ this.state.detail.insurancePolicyNo }</td>
                        </tr>
                        <tr>
                            <th>保险期间</th>
                            <td>{ this.state.detail.insuranceDuration }</td>
                            <th>出险地点</th>
                            <td>{ this.state.detail.assuredAddress }</td>
                        </tr>
                        <tr>
                            <th>出险原因</th>
                            <td colSpan="3">{ this.state.detail.assuredReason }</td>
                        </tr>
                        <tr>
                            <th valign="top">赔款计算过程</th>
                            <td colSpan="3">{ this.state.detail.computeProcess }</td>
                        </tr>
                        <tr>
                            <th>本次赔款金额合计(大写)(币别)</th>
                            <td>{ this.state.detail.moneyType }</td>
                            <td colSpan="2">{ this.state.detail.moneyNum }</td>
                        </tr>
                        <tr>
                            <th width="170">险种</th>
                            <th width="320">保险金额</th>
                            <th width="100">币别</th>
                            <th>金额</th>
                        </tr>
                        {
                            this.state.typeList.map((item, index) => (
                                <tr key={ index }>
                                    <td>{ item.codeName }</td>
                                    <td>{ item.limitMoney }</td>
                                    <td>{ item.moneyType }</td>
                                    <td>{ item.insurancePay }</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <th>赔款收款人</th>
                            <td colSpan="3">{ this.state.detail.payeeName }</td>
                        </tr>
                        <tr>
                            <th>赔款收款人账号</th>
                            <td colSpan="3">{ this.state.detail.payeeAccount }</td>
                        </tr>
                        <tr>
                            <th>赔款收款人开户行</th>
                            <td colSpan="3">{ this.state.detail.payeeBankName }</td>
                        </tr>
                        <tr>
                            <td valign="top">
                                <p>受理人</p>
                                <p style={{ textAlign: 'right', marginTop: 20 }}>{ this.state.detail.accepter }</p>
                                <p style={{ textAlign: 'right' }}>{ this.state.detail.acceptDate }</p>
                            </td>
                            <td valign="top">
                                <p>复审人</p>
                                <p style={{ textAlign: 'right', marginTop: 20 }}>{ this.state.detail.reviewer }</p>
                                <p style={{ textAlign: 'right' }}>{ this.state.detail.reviewDate }</p>
                            </td>
                            <td colSpan="2" valign="top">
                                <p>终审人</p>
                                <p style={{ textAlign: 'right', marginTop: 20 }}>{ this.state.detail.laster }</p>
                                <p style={{ textAlign: 'right' }}>{ this.state.detail.lastDate }</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default CalcBook;