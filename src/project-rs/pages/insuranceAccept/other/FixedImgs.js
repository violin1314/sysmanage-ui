import React, { Component } from 'react';
import { Form, Icon, Spin, Tabs } from 'antd';

import ImgScroll from '@/project-rs/assets/component/ImgScroll';
import http from '@/utils/http'

class FixedImgs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            caseId: '',
            list: [],
            imgType: '01',
            imgIndex: 0,
            imgList: [],
            isLoading: false,
            isToggle: false
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.id
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.id || nextProps.id === this.props.id) {
            return
        }
        this.setState({
            caseId: nextProps.id,
            list: [],
            imgType: '01',
            imgIndex: 0,
            isLoading: false,
            isToggle: false
        }, () => {
            this.getList()
        })
    }
    toggle = () => {
        this.setState({
            isToggle: !this.state.isToggle
        }, () => {
            // if(this.state.isToggle){
            //     this.getList()
            // }
        })
    }
    render() {
        return(
            <div style={{ position: 'fixed', top: 70, right: 40, zIndex: 100, paddingTop: 36 }}>
                <Icon
                    type={ this.state.isToggle ? 'minus-square' : 'plus-square' }
                    onClick={ this.toggle }
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        fontSize: 36,
                        background: '#fff',
                        cursor: 'pointer'
                    }}
                />
                <div style={{ width: 700, height: 500, overflowY: 'auto', background: '#fff', boxShadow: '0 0 10px #999', display: this.state.isToggle ? 'block' : 'none' }}>
                    <Tabs type="card" activeKey={ this.state.imgType } onChange={ this.changeType }>
                        <Tabs.TabPane tab="医学类" key="01"></Tabs.TabPane>
                        <Tabs.TabPane tab="身份类" key="02"></Tabs.TabPane>
                    </Tabs>
                    <Spin spinning={ this.state.isLoading }>
                        <div style={{ padding: 20 }}>
                            <ImgScroll list={ this.state.imgList } />
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }
    initImgs = () => {
        let imgs = JSON.parse(JSON.stringify(this.state.list))
        let imgList = []
        imgs.forEach(item => {
            if(item.serviceType === this.state.imgType){
                imgList.push(item)
            }
        })
        this.setState({
            imgList
        })
    }
    changeType = v => {
        this.setState({
            imgType: v,
            imgIndex: 0
        }, () => {
            this.initImgs()
        })
    }
    getList = () => {
        this.setState({
            isLoading: true,
            imgIndex: 0,
            imgList: [],
            imgType: '01'
        })
        http.post('/rs/api/claim/attachment/findAttachmentList', { indemnityCaseId: this.state.caseId }).then(res => {
            this.setState({
                list: res,
                isLoading: false
            }, () => {
                this.initImgs()
            })
        })
    }
}
FixedImgs = Form.create()(FixedImgs)
export default FixedImgs;