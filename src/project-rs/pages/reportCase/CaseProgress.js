import React, { Component } from 'react'
import { Timeline, Spin } from 'antd';

import http from '@/utils/http'
import moment from 'moment'

class CaseProgress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progressList: [],
            isLoading: false
        }
    }
    componentDidMount() {
        this.getProgress(this.props.id)
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.id){
            return
        }
        this.getProgress(nextProps.id)
    }
    render() {
        const { Item } = Timeline
        return (
            <div style={{ padding: '30px 30px 10px'}}>
                <Spin spinning={ this.state.isLoading }>
                    {
                        this.state.progressList.length === 0 ?
                        <div style={{ textAlign: 'center', fontSize: 16, color: '#999' }}>暂无流程</div>
                        :
                        <Timeline>
                            {
                                this.state.progressList.map((item, index) => (
                                    <Item color={ index === this.state.progressList.length - 1 && item.nodeCode !== '09' && item.nodeCode !== '10' ? '#faad14' : 'green' } key={ item.id }>
                                        <strong style={{ fontSize: 16 }}>{ item.nodeCodeName }</strong>
                                        <span style={{ marginLeft: 10 }}>{ item.createdBy }</span>
                                        <p style={{ fontSize: 12, color: '#999' }}>{ item.createdTime ? moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
                                    </Item>
                                ))
                            }
                        </Timeline>
                    }
                </Spin>
            </div>
        )
    }
    getProgress = id => {
        this.setState({
            progressList: [],
            isLoading: true
        })
        http.post('/rs/api/claim/caseTrackInfo/detail', {caseId: id}).then(res => {
            this.setState({
                progressList: res,
                isLoading: false
            })
        })
    }
}
export default CaseProgress