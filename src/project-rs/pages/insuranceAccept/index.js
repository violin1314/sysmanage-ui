import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Modal, Tabs, Badge } from 'antd';

import moment from 'moment'
import http from '@/utils/http'
import icon1 from '@/project-rs/assets/images/icon/icon-bdxx.png';

import FormSearch from './FormSearch'
import CaseDetail from './CaseDetail'
import BankInput from './BankInput'
import ApplyInput from './ApplyInput'
// import EnclosureManage from './EnclosureManage'

import ApplyInputOther from './other/ApplyInput'
import EnclosureManageOther from './other/EnclosureManage'

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

const { TabPane } = Tabs

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            caseNum: 0,
            conHeight: '',
            disposeState: '1',

            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            curInsuranceCode: '',

            visible: false,
            caseId: '',

            bankVisible: false,
            policyId: '',

            applyCase: {},
            applyVisible: false,
            enclosureVisible: false,
            reportNo: '',
			caseState: '',

            insuranceCode: '',
            caseDetailVisible: false,
            tabKey: '0',
            caseDetail: {},
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.getList(1)
        this.getCaseNum()
    }
    render(){
        return (
            <div className="content">
                <div style={{ display: this.state.applyVisible ? 'none' : 'block' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                        <Breadcrumb.Item>案件受理</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="card">
                        <div className="card-title">
                            <div className="title">
                                <Badge count={ this.state.caseNum }>
                                    <img src={ icon1 } alt=""/>
                                </Badge>
                                <span>保单信息</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <FormSearch query={ this.querySearch } />
                            <Tabs type="card" defaultActiveKey="1" onChange={ this.changeTab }>
                                <TabPane tab="未处理" key="1"></TabPane>
                                <TabPane tab="正处理" key="2"></TabPane>
                                <TabPane tab="已处理" key="3"></TabPane>
                            </Tabs>
                            { this.renderList() }
                        </div>
                    </div>
                    <Modal
                        className="modal-detail"
                        title="案件详情"
                        width="80%"
                        centered
                        visible={ this.state.visible }
                        onCancel={ this.closeDetail }
                        footer={ null }
                    >
                        <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                            <CaseDetail id={ this.state.caseId } />
                        </div>
                    </Modal>
                    <Modal
                        className="modal-detail"
                        title="银行信息录入"
                        width="600px"
                        centered
                        visible={ this.state.bankVisible }
                        onCancel={ this.closeBank }
                        footer={ null }
                        style={{ position: 'absolute', left: 20, top: 20 }}
                    >
                        <div className="modal-detail-content">
                            <BankInput policyId={ this.state.policyId } caseId={ this.state.caseId } disposeState={ this.state.disposeState } onClose={ this.closeBank } />
                        </div>
                    </Modal>
                    {/* <Modal
                        className="modal-detail"
                        title="案件受理"
                        width="92%"
                        centered
                        visible={ this.state.applyVisible }
                        onCancel={ this.closeApply }
                        footer={ null }
                        maskClosable={ false }
                    >
                        <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                            {
                                OTHERCODES.indexOf(this.state.curInsuranceCode) !== -1 &&
                                <ApplyInputOther case={ this.state.applyCase } onClose={ this.closeApply } />
                            }
                            {
                                this.state.curInsuranceCode !== '' && OTHERCODES.indexOf(this.state.curInsuranceCode) === -1 &&
                                <ApplyInput case={ this.state.applyCase } onClose={ this.closeApply } />
                            }
                        </div>
                    </Modal> */}
                    <Modal
                        className="modal-detail"
                        title="附件管理"
                        width="1000px"
                        centered
                        visible={ this.state.enclosureVisible }
                        onCancel={ this.closeEnclosure }
                        footer={ null }
                    >
                        <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                            {/* {
                                OTHERCODES.indexOf(this.state.curInsuranceCode) !== -1 &&
                                <EnclosureManageOther id={ this.state.caseId } reportNo={ this.state.reportNo } onClose={ this.closeEnclosure } />
                            } */}
                            {/* {
                                this.state.curInsuranceCode !== '' && OTHERCODES.indexOf(this.state.curInsuranceCode) === -1 &&
                                <EnclosureManage id={ this.state.caseId } onClose={ this.closeEnclosure } />
                            } */}

                            <EnclosureManageOther id={ this.state.caseId } reportNo={ this.state.reportNo } caseState={ this.state.caseState } onClose={ this.closeEnclosure } />
                        </div>
                    </Modal>
                    { this.renderDetailModal() }
                </div>
                <div style={{ display: this.state.applyVisible ? 'block' : 'none' }}>
                    {
                        OTHERCODES.indexOf(this.state.curInsuranceCode) !== -1 &&
                        <ApplyInputOther case={ this.state.applyCase } onClose={ this.closeApply } />
                    }
                    {
                        this.state.curInsuranceCode !== '' && OTHERCODES.indexOf(this.state.curInsuranceCode) === -1 &&
                        <ApplyInput case={ this.state.applyCase } onClose={ this.closeApply } />
                    }
                </div>
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '案件号', dataIndex: 'reportNo', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center',
                render: (text, record) => <p><span  style={{ color: record.color }}>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' }</span></p>
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '险种', dataIndex: 'insuranceCode', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text ? moment(text).format('YYYY-MM-DD') : '' }</span></p>
            },
            { title: '是否存在未处理的问题件', dataIndex: 'isProblemItems', align: 'center', width: 100,
                render: (text, record) => <p><span style={{ color: record.color }}>{ text === '1' && '是' }{ text === '0' && '否' }</span></p>
            },
            { title: '是否六地市', dataIndex: 'isSix', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text === '1' && '是' }{ text === '0' && '否' }</span></p>
            },
            { title: '操作', key: 'action', align: 'center', width: 110,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="案件详情" onClick={this.showCasedetail.bind(this, record)}>
                            <span><Icon type="file-protect" /></span>
                        </Tooltip>
                        {
                            this.state.disposeState === '3' ?
                            <Tooltip title="查看详情" onClick={this.detail.bind(this, record.id)}>
                                <span id="$button_search"><Icon type="profile" /></span>
                            </Tooltip> :
                            <Tooltip title="申请" onClick={this.apply.bind(this, record)}>
                                <span id="$button_accept" ><Icon type="form" /></span>
                            </Tooltip>
                        }
                        <Tooltip title="银行信息录入" onClick={this.bankInfo.bind(this, record)}>
                            {
                                this.state.disposeState === '3' ?
                                <span id="$button_BankInput"><Icon type="bank" /></span>
                                : ''
                            }
                            {
                                this.state.disposeState !== '3' ?
                                <span id="$button_BankInput" style={{ color: record.isBankCode === '2' && !this.state.isLoading ? '#f00' : '' }}><Icon type="bank" /></span>
                                : ''
                            }
                        </Tooltip>
                        <Tooltip title="附件管理" onClick={this.showEnclosure.bind(this, record)}>
                            <span id="$button_attachment"><Icon type="paper-clip" /></span>
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
    getCaseNum = () => {
        http.post('/rs/api/claim/queryCaseInfo/findCaseNum', {queryCaseNumFlag: '1'}).then(res => {
            this.setState({
                caseNum: res
            })
            setTimeout(() => {
                this.setState({
                    caseNum: 0
                })
            }, 3000)
        })
    }
    changeTab = t => {
        this.setState({
            disposeState: t,
            isLoading: true
        }, () => {
            this.getList(1)
        })
    }
    querySearch = v => {
        this.setState({
            searchData: v
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
        data.permissionFlag = '1'
        let url = ''
        if(this.state.disposeState === '1'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForNoDeal'
        }else if(this.state.disposeState === '2'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForDealing'
        }else if(this.state.disposeState === '3'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForDealed'
        }
        http.post(url, data).then(res => {
            if(this.state.disposeState !== '3'){
                res.content.forEach(item => {
                    if(item.isDown === '1'){
                        item.color = '#ccc'
                    }else if(item.isManager === '1' || item.isBusyFlag === '1' || item.returnAcceptFlag === '1' || item.isRedList === '1'){
                        item.color = '#f00'
                    }
                })
            }
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    detail = id => {
        this.setState({
            visible: true,
            caseId: id
        })
    }
    closeDetail = () => {
        if(document.querySelector('.modal-detail-content')){
            document.querySelector('.modal-detail-content').scrollTop = 0
        }
        this.setState({
            visible: false,
            caseId: ''
        })
    }

    receiveCaseTask = (id, callback) => {
        if(this.state.disposeState === '1'){
            let data = {
                indemnityCaseId: id,
                nodeCode: '03' // 认领
            }
            http.post('/rs/api/claim/caseinfo/receiveCaseTask', data, { isLoading: true }).then(res => {
                this.getList(1)
                callback()
            })
        }else{
            callback()
        }
    }

    bankInfo = record => {
        this.receiveCaseTask(record.id, () => {
            this.setState({
                bankVisible: true,
                policyId: record.policyId,
                caseId: record.id
            })
        })
    }
    closeBank = flag => {
        this.setState({
            bankVisible: false,
            policyId: ''
        })
        if(flag === 'suc'){
            this.getList(1)
        }
    }
    apply = record => {
        this.receiveCaseTask(record.id, () => {
            this.setState({
                applyVisible: true,
                applyCase: record,
                curInsuranceCode: record.insuranceCode
            })
            // http.post('/rs/api/claim/caseinfo/isExistNoEndCase', { id: record.id }, { isLoading: true }).then(res => {
            //     if(res){
            //         this.setState({
            //             applyVisible: true,
            //             applyCase: record,
            //             curInsuranceCode: record.insuranceCode
            //         })
            //     }
            // })
        })
    }
    closeApply = flag => {
        this.setState({
            applyVisible: false,
            applyCase: {},
            curInsuranceCode: ''
        })
        if(flag === 'suc'){
            this.getList(1)
        }
    }
    showEnclosure = record => {
        this.receiveCaseTask(record.id, () => {
            this.setState({
                enclosureVisible: true,
                caseId: record.id,
                reportNo: record.reportNo,
				caseState: record.caseState
            })
        })
    }
    closeEnclosure = () => {
        this.setState({
            enclosureVisible: false,
            caseId: '',
            reportNo: '',
			caseState: ''
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
                visible={ this.state.caseDetailVisible }
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
            caseDetailVisible: true,
            policyId: record.policyId,
            tabKey: '0',
            caseDetail: {}
        })
        let data = {
            id: record.id,
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
            caseDetailVisible: false,
            policyId: '',
            caseDetail: {}
        })
    }
}
export default index
