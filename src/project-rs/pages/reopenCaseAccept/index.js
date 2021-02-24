import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Tabs, Modal, Spin, InputNumber, Button, message } from 'antd'
import moment from 'moment'
import http from '@/utils/http'
import icon from '@/project-rs/assets/images/icon/icon-dfsxxcx.png';

import FormSearch from './FormSearch'
import PaidInputList from './PaidInputList'

import InsurancePolicyDetail from '@/project-rs/assets/component/InsurancePolicyDetail'
import AcceptInfo from '@/project-rs/assets/component/CaseInfo/acceptInfo'
import Attachments from '@/project-rs/assets/component/CaseInfo/attachments'
import FirstAudit from '@/project-rs/assets/component/CaseInfo/firstAudit'
import HistoryInvestigate from '@/project-rs/assets/component/CaseInfo/historyInvestigate'
import HistorySecondAudit from '@/project-rs/assets/component/CaseInfo/historySecondAudit'
import HistoryFinalAudit from '@/project-rs/assets/component/CaseInfo/historyFinalAudit'
import PolicyFee from '@/project-rs/assets/component/CaseInfo/policyFee'
import FeeList from '@/project-rs/assets/component/CaseInfo/feeList'
import CasePayeeInfo from '@/project-rs/assets/component/CaseInfo/casePayeeInfo'
import VisitInfo from '@/project-rs/assets/component/CaseInfo/visitInfo'

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']
const limitDecimals = value => {
    const reg = /^(\d-)*(\d+)\.(\d\d).*$/;
    if(typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    } else {
        return ''
    }
}
class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            conHeight: '',
            caseNum: 0,
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            selectedKeys: [],
            selectedRow: {},
            caseList: [],
            caseLoading: false,
            visitDetailInfos: [],

            detailVisible: false,
            insuranceCode: '',
            tabKey: '0',
            caseDetail: {},
            policyId: '',

            isSupple: false
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.getList(1)
    }
    render(){
        let isSupple = this.state.selectedRow.isSupple === '1' || this.state.isSupple;
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                    <Breadcrumb.Item>重开赔案受理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon } alt="" />
                            <span>案件信息查询</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        { this.renderList() }
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon } alt="" />
                            <span>待重开的赔付信息</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <Spin spinning={ this.state.caseLoading }>
                            <PaidInputList list={ this.state.caseList } onChange={ this.paidChange } />
                            {
                                this.state.visitDetailInfos.length > 0 &&
                                <table className="data-table" style={{ marginTop: 10 }}>
                                    <tbody>
                                        <tr>
                                            <th>医院名称</th>
                                            <th>入院日期</th>
                                            <th>出院日期</th>
                                            <th>总费用</th>
                                            <th>票据号</th>
                                            <th width="120">赔付金额</th>
                                        </tr>
                                        {
                                            this.state.visitDetailInfos.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.medicalOrganizationName}</td>
                                                    <td>{item.inHosDate}</td>
                                                    <td>{item.outHosDate}</td>
                                                    <td>{item.medicalTotalMoney}</td>
                                                    <td>{item.billNo}</td>
                                                    <td>
                                                        <InputNumber
                                                            value={item.insurancePay}
                                                            size="small"
                                                            min={0}
                                                            step={0.01}
                                                            formatter={limitDecimals}
                                                            parser={limitDecimals}
                                                            style={{ width: 100 }}
                                                            onChange={this.changeMondy.bind(this, item)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            }

                            {
                                this.state.caseList.length > 0 &&
                                <div style={{ textAlign: 'center', paddingTop: 20 }}>
                                    <Button type="primary" disabled={ isSupple } onClick={ this.save.bind(this, 1) }>提交</Button>
                                    <Button type="primary" disabled={ !isSupple } onClick={ this.save.bind(this, 2) } style={{ marginLeft: 20 }}>补传</Button>
                                </div>
                            }
                        </Spin>
                    </div>
                </div>
                { this.renderDetailModal() }
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '保单号', dataIndex: 'policyNo', align: 'center' },
            { title: '报案号', dataIndex: 'reportNo', align: 'center', width: '10%'},
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center', width: '10%' },
            { title: '被保险人身份证号', dataIndex: 'idCode', align: 'center', width: '15%' },
            { title: '申请人', dataIndex: 'renewApplyOper', align: 'center', width: '9%' },
            { title: '申请时间', dataIndex: 'renewApplyDate', align: 'center', width: '8%',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '申请原因', dataIndex: 'renewApplyReason', align: 'center', width: '10%' },
            { title: '审核结论', dataIndex: 'renewCheckConclusion', align: 'center', width: '10%' },
            { title: '操作', key: 'action', align: 'center', width: 50,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="案件详情" onClick={this.showCasedetail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current=> {
                this.getList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination,
            rowSelection: {
                type: 'radio',
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys,
                        selectedRow: rows[0]
                    }, () => {
                        this.getCaseInfo()
                    })
                }
            }
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    querySearch = data => {
        this.setState({
            searchData: data
        }, () => {
            this.getList(1)
        })
    }
    
    getList = current => {
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = this.state.searchData
        data.currentPage = current
        data.pageSize = this.state.pageSize
        data.renewApplyState = '3'

        http.post('/rs/api/claim/renewcasecheck/findRenewCaseInfoByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false,
                selectedRow: res.content.length > 0 ? res.content[0] : {},
                selectedKeys: res.content.length > 0 ? [res.content[0].id] : []
            }, () => {
                this.getCaseInfo()
            })
        })
    }
    getCaseInfo = () => {
        this.setState({
            caseLoading: true
        })
        let data = {
            indemnityCaseId: this.state.selectedRow.indemnityCaseId,
            renewIndemnityCaseId: this.state.selectedRow.renewIndemnityCaseId
        }
        http.post('/rs/api/claim/renewcaseaccept/findPolicyFeeForRenew', data).then(res => {
            let list = []
            res.forEach(item => {
                list.push({
                    isValid: '1',
                    id: item.id,
                    payDutyName: item.payDutyName,
                    payDutyCode: item.payDutyCode,
                    franchisePay: item.franchisePay,
                    insurancePay: item.insurancePay,
                    comFormula: item.comFormula
                })
            })
            this.setState({
                caseList: list,
                caseLoading: false
            })
        })

        http.post('/rs/api/claim/visitInfo/queryVisitDetailInfoByCaseInfoId', { id: this.state.selectedRow.indemnityCaseId }).then(res =>{
            this.setState({
                visitDetailInfos: res
            })
        })
    }

    changeMondy = (record, value) => {
        let visitDetailInfos = JSON.parse(JSON.stringify(this.state.visitDetailInfos))
        visitDetailInfos.forEach(item => {
            if(item.id === record.id){
                item.insurancePay = value
            }
        })
        this.setState({
            visitDetailInfos
        })
    }

    paidChange = list => {
        this.setState({
            caseList: list
        })
    }
    save = flag => {
        let caseList = JSON.parse(JSON.stringify(this.state.caseList))
        let valid = true
        caseList.forEach(item => {
            if(item.isValid === '0'){
                valid = false
            }
        })
        if(!valid){
            message.error('信息请填写完整')
            return
        }
        caseList.forEach(item => {
            delete item.isValid
        })

        let visitDetailInfos = JSON.parse(JSON.stringify(this.state.visitDetailInfos));
        let visitDetailInfoEntityList = []
        visitDetailInfos.forEach(item => {
            visitDetailInfoEntityList.push({ id: item.id, insurancePay: item.insurancePay })
        })

        let data = {
            id: this.state.selectedRow.id,
            policyFeeInfoEntityList: caseList,
            visitDetailInfoEntityList
        }
        let url = flag === 1 ? '/rs/api/claim/renewcaseaccept/saveRenewAcceptCase' : '/rs/api/claim/renewcaseaccept/saveRenewAcceptCaseAgain';
        http.post(url, data, { isLoading: true }).then(res => {
            if(res){
                this.setState({
                    isSupple: true
                })
                message.error(res)
            }else{
                this.setState({
                    isSupple: false
                })
                let str = flag === 1 ? '提交' : '补传';
                message.success('赔付信息' + str + '成功')
                this.getList(1)
            }
        })
    }

    renderDetailModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="案件详情"
                width="90%"
                centered
                visible={ this.state.detailVisible }
                onCancel={ this.closeCaseDetail }
                footer={ null }
            >
                <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                    <Tabs activeKey={ this.state.tabKey } onChange={ this.tabChange } >
                        <TabPane tab="保单信息" key="0">
                            <InsurancePolicyDetail id={ this.state.policyId } />
                        </TabPane>
                        <TabPane tab="就诊信息" key="10">
                            <VisitInfo detail={ this.state.caseDetail.visitInfo ? this.state.caseDetail.visitInfo : {} } />
                        </TabPane>
                        <TabPane tab="理赔受理信息" key="1">
                            <AcceptInfo detail={ this.state.caseDetail.caseInfo ? this.state.caseDetail.caseInfo : {} } />
                        </TabPane>
                        <TabPane tab="影像信息" key="2">
                            <Attachments list={ this.state.caseDetail.caseAttachmentDs ? this.state.caseDetail.caseAttachmentDs : [] } />
                        </TabPane>
                        <TabPane tab="系统初审信息" key="3">
                            <FirstAudit detail={ this.state.caseDetail.caseSysFirstAuditInfoDs ? this.state.caseDetail.caseSysFirstAuditInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往稽核" key="4">
                            <HistoryInvestigate list={ this.state.caseDetail.caseInvestigationInfoDs ? this.state.caseDetail.caseInvestigationInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往复审" key="5">
                            <HistorySecondAudit list={ this.state.caseDetail.caseArtificialSecondAuditInfoDs ? this.state.caseDetail.caseArtificialSecondAuditInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往系统终审" key="6">
                            <HistoryFinalAudit list={ this.state.caseDetail.caseFinalAuditingInfoEntityDs ? this.state.caseDetail.caseFinalAuditingInfoEntityDs : [] } />
                        </TabPane>
                        <TabPane tab="赔付信息" key="7">
                            <PolicyFee list={ this.state.caseDetail.policyfeeInfoDs ? this.state.caseDetail.policyfeeInfoDs : [] } />
                        </TabPane>
                        {
                            OTHERCODES.indexOf(this.state.insuranceCode) !== -1 &&
                            <TabPane tab="费用信息" key="8">
                                <FeeList list={ this.state.caseDetail.categoryDs ? this.state.caseDetail.categoryDs : [] } />
                            </TabPane>
                        }
                        <TabPane tab="案件领款人信息" key="9">
                            <CasePayeeInfo detail={ this.state.caseDetail.casePayeeInfoEntity ? this.state.caseDetail.casePayeeInfoEntity : {} } />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
    }
    showCasedetail = record => {
        this.setState({
            detailVisible: true,
            policyId: record.policyId,
            tabKey: '0',
            caseDetail: {}
        })
        let data = {
            id: record.indemnityCaseId,
            policyId: record.policyId,
            queryAttachmentFlag: true,
            queryFinalAuditFlag: true,
            queryInvestFlag: true,
            querySecondAuditFlag: true,
            querySysFirstAuditFlag: true,
            queryPolicyFeeFlag: true,
            queryFeeFlag: true,
            queryVisitFlag: true,
            queryCasePayeeFlag: true
        }

        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data, { isLoading: true }).then(res => {
            this.setState({
                caseDetail: res,
                insuranceCode: res.caseInfo.insuranceCode
            })
        })
    }
    closeCaseDetail = () => {
        this.setState({
            detailVisible: false,
            policyId: '',
            caseDetail: {}
        })
    }
}
export default index