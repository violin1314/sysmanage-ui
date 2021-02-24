import React, { Component } from 'react';
import { Row, Col, Button, Icon, Spin } from 'antd';
let imgServer = '/images/';

class ImgScroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgList: [],
            imgIndex: 0,
            curImg: {},
            rotateDeg: 0,
            rotateDegZoom: 0,
            imgScaleNum: 50,
            imgLoading: false
        }
    }
    componentDidMount() {
        this.setState({
            imgIndex: 0,
            curImg: this.props.list.length ? this.props.list[0] : {},
            imgList: this.props.list ? this.props.list : []
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.list === this.props.list){
            return
        }
        this.setState({
            imgIndex: 0,
            rotateDeg: 0,
            rotateDegZoom: 0,
            curImg: nextProps.list.length ? nextProps.list[0] : {},
            imgList: nextProps.list ? nextProps.list : [],
            imgLoading: false
        })
    }
    render() {
        return (
            <div className="img-scroll-wrap">
                {
                    this.state.imgList.length > 0 ?
                    <div>
                        <Row type="flex" justify="space-between" style={{ marginBottom: 10 }}>
                            <Col>
                                <Button type="primary" size="small" onClick={ this.changeImg.bind(this, -1) }><Icon type="left" /></Button>
                            </Col>
                            <Col>
                                { this.state.imgIndex + 1 } / { this.state.imgList.length }
                            </Col>
                            <Col>
                                <Button type="primary" size="small" onClick={ this.changeImg.bind(this, 1) }><Icon type="right" /></Button>
                            </Col>
                        </Row>
                        <div className="img-scroll">
                            <p className="img-rotate">
                                <Icon type="undo" onClick={ this.rotate.bind(this, -1 )} style={{ cursor: 'pointer' }} />
                                <Icon type="redo" onClick={ this.rotate.bind(this, 1 )} style={{ cursor: 'pointer', marginLeft: 10 }} />
                            </p>
                            <div className="img-item" id="imgBox" onClick={ this.openImg }>
                                <img
                                    id="curImg"
                                    src={ imgServer + this.state.curImg.reduceFileRoute }
                                    alt={ this.state.curImg.reduceFileRoute }
                                    style={{ transform: `rotate(${this.state.rotateDeg}deg)` }}
                                />
                            </div>
                            <p className="img-desc">
                                {`扫描人2：${this.state.curImg.scaner}`}&nbsp;&nbsp;&nbsp;&nbsp;{`扫描时间：${this.state.curImg.scanDate}`}
                            </p>
                        </div>
                    </div> :
                    <div style={{ textAlign: 'center', padding: '30px 0', fontSize: 16, color: '#999' }}>
                        暂无附件
                    </div>
                }
                { this.renderZoomImg() }
            </div>
        )
    }
    changeImg = flag => {
        let idx = 0;
        if(flag === -1){
            idx = this.state.imgIndex === 0 ? this.state.imgList.length - 1 : this.state.imgIndex - 1
        }else{
            idx = this.state.imgIndex === this.state.imgList.length - 1 ? 0 : this.state.imgIndex + 1
        }
        this.setState({
            imgIndex: idx,
            curImg: this.state.imgList[idx]
        })
        if(this.props.onChange){
            this.props.onChange(idx)
        }
    }

    renderZoomImg() {
        const antIcon = <Icon type="loading" style={{ fontSize: 60 }} spin />
        return (
            <div className="zoom-img" style={{ display: this.state.zoomSrc ? 'flex' : 'none' }}>
                <div className="zoom-img-item" onClick={ this.closeZoom }>
                    { this.state.imgLoading && <Spin indicator={antIcon} style={{ position: 'absolute', left: '50%', top: '50%', margin: '-30px 0 0 -30px', zIndex: 2 }} /> }
                    <img
                        id="zoomImg"
                        src={ this.state.zoomSrc }
                        alt={ this.state.zoomSrc }
                        onClick={ this.closeZoom }
                        style={{ transform: `rotate(${this.state.rotateDegZoom}deg)`, width: `${this.state.imgScaleNum}%`, filter: `blur(${this.state.imgLoading ? '3px' : '0'})` }}
                    />
                </div>
                <p className="zoom-rotate">
                    { this.state.imgIndex + 1 } / { this.state.imgList.length }
                    <Icon type="undo" onClick={ this.rotateZoom.bind(this, -1 )} style={{ cursor: 'pointer', marginLeft: 20 }} title="左旋转" />
                    <Icon type="redo" onClick={ this.rotateZoom.bind(this, 1 )} style={{ cursor: 'pointer', marginLeft: 20 }} title="右旋转" />
                    <Icon type="zoom-out" onClick={ this.imgScale.bind(this, -1 )} style={{ cursor: 'pointer', marginLeft: 20 }} title="缩小" />
                    <Icon type="zoom-in" onClick={ this.imgScale.bind(this, 1 )} style={{ cursor: 'pointer', marginLeft: 20 }} title="放大" />
                    <Icon type="file-image" onClick={ this.originalImg } style={{ cursor: 'pointer', marginLeft: 20 }} title="查看原图" />
                </p>
                <span className="img-btn-prev" onClick={ this.changeZoomImg.bind(this, -1) }><Icon type="left" /></span>
                <span className="img-btn-next" onClick={ this.changeZoomImg.bind(this, 1) }><Icon type="right" /></span>
            </div>
        )
    }
    openImg = () => {
        this.setState({
            zoomSrc: imgServer + this.state.curImg.reduceFileRoute,
            rotateDegZoom: this.state.rotateDeg,
            imgScaleNum: 50,
            imgLoading: false
        })
    }
    closeZoom = () => {
        this.setState({
            zoomSrc: ''
        })
    }
    rotate = flag => {
        let rotateDeg = this.state.rotateDeg;
        if(flag === 1){
            rotateDeg += 90
        }else{
            rotateDeg += -90
        }
        this.setState({
            rotateDeg
        }, () => {
            setTimeout(() => {
                let img = document.querySelector('#curImg').getBoundingClientRect();
                let boxWidth = document.querySelector('#imgBox').clientWidth;
                let boxHeight = document.querySelector('#imgBox').clientHeight;
                if(img.width > boxWidth){
                    let rate = boxWidth/img.width
                    document.querySelector('#curImg').style.transform = `rotate(${this.state.rotateDeg}deg) scale(${rate})`
                }else{
                    document.querySelector('#curImg').style.transform = `rotate(${this.state.rotateDeg}deg) scale(1)`
                }

                if(img.height > boxHeight){
                    let rate = boxHeight/img.height
                    document.querySelector('#curImg').style.transform = `rotate(${this.state.rotateDeg}deg) scale(${rate})`
                }else{
                    document.querySelector('#curImg').style.transform = `rotate(${this.state.rotateDeg}deg) scale(1)`
                }
            }, 300)
        })
    }
    rotateZoom = flag => {
        let rotateDegZoom = this.state.rotateDegZoom
        if(flag === 1){
            rotateDegZoom += 90
        }else{
            rotateDegZoom += -90
        }
        this.setState({
            rotateDegZoom
        })
    }
    changeZoomImg = flag => {
        let idx = 0;
        if(flag === -1){
            idx = this.state.imgIndex === 0 ? this.state.imgList.length - 1 : this.state.imgIndex - 1
        }else{
            idx = this.state.imgIndex === this.state.imgList.length - 1 ? 0 : this.state.imgIndex + 1
        }
        this.setState({
            imgIndex: idx,
            curImg: this.state.imgList[idx]
        }, () => {
            this.setState({
                zoomSrc: imgServer + this.state.curImg.reduceFileRoute
            })
        })
        if(this.props.onChange){
            this.props.onChange(idx)
        }
    }
    imgScale = flag => {
        let num = this.state.imgScaleNum
        if(flag === 1){
            num += 50
        }else{
            if(num === 50){
                return
            }
            num += -50
        }
        this.setState({
            imgScaleNum: num
        })
    }

    originalImg = () => {
        if(this.state.zoomSrc === imgServer + this.state.curImg.fileRoute){
            return
        }
        this.setState({
            zoomSrc: imgServer + this.state.curImg.fileRoute,
            imgLoading: true
        }, () => {
            document.querySelector('#zoomImg').onload = () => {
                this.setState({
                    imgLoading: false
                })
            }
        })
    }
}
export default ImgScroll;