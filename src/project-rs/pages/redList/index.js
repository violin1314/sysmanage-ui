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
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},
            loadingId: ''
        }
    }
    componentDidMount(){
        this.getList(1)
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>红名单管理</Breadcrumb.Item>
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
            { title: '姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '身份证号', dataIndex: 'idCode', align: 'center' },
            { title: '保单号', dataIndex: 'policyNo', align: 'center' },
            { title: '保单开始日期', dataIndex: 'startDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '保单终止日期', dataIndex: 'endDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '险种名称', dataIndex: 'insuranceName', align: 'center' },
            { title: '产品名称', dataIndex: 'productName', align: 'center' },
            { title: '是否红名单', key: 'action', align: 'center', width: 70,
                render: (text, record) => (
                    <div className="list-actions">
                        <Switch
                            loading={ this.state.loadingId === record.id }
                            checked={ record.isRedList === '1' }
                            onClick={ this.setRed.bind(this, record )}
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
        data.insurancePolicyState = '1'

        http.post('/rs/api/claim/basicPolicy/findPolicyByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    setRed = record => {
        let data = {
            policyId: record.id
        }
        this.setState({
            loadingId: record.id
        })
        http.post('/rs/api/claim/insurancepolicyinfo/saveRedlist', data).then(res => {
            this.getList(this.state.currentPage)
            this.setState({
                loadingId: ''
            })
        })
    }
}
export default index