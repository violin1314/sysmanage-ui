import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Tabs, Modal } from 'antd'
import moment from 'moment'
import http from '@/utils/http'
import icon from '@/project-rs/assets/images/icon/icon-dfsxxcx.png';

import FormSearch from './FormSearch'
import Result from './Result'

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

            visible: false,
            curCase: {},
            type: '',

            detailVisible: false,
            insuranceCode: '',
            tabKey: '0',
            caseDetail: {},
            policyId: ''
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
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                    <Breadcrumb.Item>重开赔案审核</Breadcrumb.Item>
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
                <Result
                    visible={ this.state.visible }
                    type={ this.state.type }
                    caseId={ this.state.curCase.id }
                    onClose={ this.close }
                />
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
            { title: '申请时间', dataIndex: 'renewApplyDate', align: 'center', width: '14%',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '申请原因', dataIndex: 'renewApplyReason', align: 'center', width: '15%' },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="案件详情" onClick={this.showCasedetail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="审核通过" onClick={this.pass.bind(this, record)}>
                            <span id="$button_pass"><Icon type="check-circle" /></span>
                        </Tooltip>
                        <Tooltip title="审核不通过" onClick={this.refuse.bind(this, record)}>
                            <span id="$button_refuse"><Icon type="stop" /></span>
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
            pagination: pagination
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
        data.renewApplyState = '2'

        http.post('/rs/api/claim/renewcasecheck/findRenewCaseInfoByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false,
            })
        })
    }
    pass = item => {
        this.setState({
            visible: true,
            curCase: item,
            type: '1'
        })
    }
    refuse = item => {
        this.setState({
            visible: true,
            curCase: item,
            type: '2'
        })
    }
    close = flag => {
        this.setState({
            visible: false,
            curCase: {}
        })
        if(flag === 'suc'){
            this.getList(1)
        }
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