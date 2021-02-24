import React, { Component } from 'react';
import { Tabs, Spin } from 'antd';

import http from '@/utils/http'

import QuestionList from './QuestionList'
import RuleList from './RuleList'
import QuestionCreate from './QuestionCreate'

class QuestionInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: '1',
            case: {},
            visit: {},
            isLoading: false,

            readOnly: false,
            qList: [],
            rules: [],
            feeList: [],
            indemnityCaseNo: '',
            insuranceCode: ''
        }
    }
    componentDidMount() {
        this.init(this.props)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.init(nextProps)
    }
    init(props){
        this.setState({
            tabKey: '1',
            visit: props.visit,
            case: props.case,
            readOnly: props.readOnly ? props.readOnly : false,
            indemnityCaseNo: ''
        }, () => {
            if(!this.state.visit.indemnityCaseId){
                return
            }
            this.getRules()
        })
    }
    render() {
        const TabPane = Tabs.TabPane;
        return (
            <Tabs activeKey={ this.state.tabKey } type="card" onChange={ this.tabChange } >
                <TabPane tab="疑点信息" key="1">
                    <Spin spinning={ this.state.isLoading }>
                        <QuestionList
                            caseId={ this.state.visit.indemnityCaseId }
                            list={ this.state.qList }
                            onSuc={ this.delSuc }
                            readOnly={ this.state.readOnly }
                        />
                    </Spin>
                </TabPane>
                <TabPane tab="审核规则" key="2">
                    <Spin spinning={ this.state.isLoading }>
                        <RuleList list={ this.state.rules } />
                    </Spin>
                </TabPane>
                {
                    !this.state.readOnly ?
                    <TabPane tab="疑点录入" key="3">
                        <Spin spinning={ this.state.isLoading }>
                            <QuestionCreate
                                caseId={ this.state.case.id }
                                indemnityCaseNo={ this.state.indemnityCaseNo }
                                rules={ this.state.rules }
                                onSuc={ this.createSuc }
                            />
                        </Spin>
                    </TabPane> : ''
                }
            </Tabs>
        )
    }
    tabChange = key => {
        this.setState({
            tabKey: key,
            indemnityCaseNo: ''
        })
        if(key === '1'){
            this.getRules()
        }
        if(key === '3'){
            this.setState({
                indemnityCaseNo: this.state.case.indemnityCaseNo
            })
        }
    }
    getRules = () => {
        this.setState({
            isLoading: true
        })
        http.post('/rs/api/claim/questionrule/getRuleList').then(res => {
            this.setState({
                rules: res
            }, () => {
                this.getDetail()
            })
        })
    }
    getDetail = () => {
        let data = {
            id: this.state.visit.indemnityCaseId,
            queryQuestionPointFlag: true
        }
        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
            let list = res.caseQuestionPointDTO
            list.forEach(item => {
                this.state.rules.forEach(rule => {
                    if(item.ruleId === rule.ruleCode){
                        item.ruleName = rule.ruleName
                    }
                })
            })
            this.setState({
                qList: list,
                isLoading: false
            })
            sessionStorage.setItem('questionInsuranceCode', res.caseInfo.insuranceCode)
        })
    }
    delSuc = () => {
        this.setState({
            tabKey: '1'
        }, () => {
            this.getDetail()
        })
    }
    createSuc = () => {
        this.setState({
            tabKey: '1'
        }, () => {
            this.getDetail()
        })
    }
}
export default QuestionInfo;