import React, {Component} from 'react'

import homeImg from '@/common/images/home-bg.jpg'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    componentDidMount(){
        
    }
    render(){
        return (
            <img src={homeImg} alt="" width="100%" height="auto" />
        )
    }
}
export default Home;