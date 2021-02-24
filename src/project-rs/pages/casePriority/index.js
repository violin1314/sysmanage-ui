import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Switch } from 'antd';

import moment from 'moment'
import http from '@/utils/http'
import icon1 from '@/project-rs/assets/images/icon/icon-bdxx.png';

import FormSearch from './FormSearch'

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
            loadingId: '',

            curInsuranceCode: '',

            visible: false,
            caseId: '',

            bankVisible: false,
            policyId: '',

            applyCase: {},
            applyVisible: false,
            enclosureVisible: false,
            reportNo: '',

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
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>案件优先级</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon1 } alt=""/>
                            <span>案件信息</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        { this.renderList() }
                    </div>
                </div>
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center' },
            { title: '报案号', dataIndex: 'reportNo', align: 'center' },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center' },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center' },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center' },
            { title: '有效标志', dataIndex: 'cancelFlagName', align: 'center' },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '是否存在未处理的问题件', dataIndex: 'isProblemItems', align: 'center', width: 100,
                render: text => <span>{ text === '1' && '是' }{ text === '0' && '否' }</span>
            },
            { title: '是否六地市', dataIndex: 'isSix', align: 'center',
                render: text => <span>{ text === '1' && '是' }{ text === '0' && '否' }</span>
            },
            { title: '是否优先', key: 'action', align: 'center', width: 70,
                render: (text, record) => (
                    <div className="list-actions">
                        <Switch
                            loading={ this.state.loadingId === record.id }
                            checked={ record.isBusyFlag === '1' }
                            onClick={ this.setFirst.bind(this, record )}
                        />
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
        data.caseStateList = ['99']

        http.post('/rs/api/claim/queryCaseInfo/findCaseByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    setFirst = record => {
        let data = {
            policyId: record.policyId,
            caseId: record.id
        }
        this.setState({
            loadingId: record.id
        })
        http.post('/rs/api/claim/caseinfo/updateCaseInfoIsBusy', data).then(res => {
            this.getList(this.state.currentPage)
            this.setState({
                loadingId: ''
            })
        })
    }
}
export default index