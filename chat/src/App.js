import React,{ Component } from 'react';
import axios from 'axios';
import Room from './Room';
import Chat from './Chat';
import User from './User';
class App extends Component{
  ws = new WebSocket("");
  componentDidMount() {
     this.ws.onopen = evt => {
      this.setState({loading:false});
    };
    this.ws.onclose = () => {
    };
    this.ws.onmessage = evt => {
      const mess=JSON.parse(evt.data);
      if(mess.action==='disconnect'){
        const msg=`${mess.username} leaves chat`;
        this.setState({onlineUsers:mess.users,messages:[...this.state.messages,{username:"",msg:msg,time:mess.time}]});
      }else if(mess.action==='add'){
        const msg=`${mess.username} joins chat`;
        this.setState({onlineUsers:mess.users,messages:[...this.state.messages,{username:"",msg:msg,time:mess.time}]});
      }else if(mess.action==='send'){
        this.setState({messages:[...this.state.messages,{username:mess.username,msg:mess.msg,time:mess.time}]});
      }
    };
  }
  constructor(props){
    super(props);
    this.state={
      user:"",
      status:0,
      room:"",
      loading:true,
      onlineUsers:[],
      messages:[],
      url:""
    };
    this.checkUsername=this.checkUsername.bind(this);
    this.createRoom=this.createRoom.bind(this);
    this.joinRoom=this.joinRoom.bind(this);
    this.leaveRoom=this.leaveRoom.bind(this);
    this.send=this.send.bind(this);
  }
  async checkUsername(user){
    var flag=true;
    if(user==='user')
      flag=false;
    await axios.get(this.state.url+'/checkusername', {params:{username:user}}).then(res => {if(res.data.length>0){flag=false;}}).catch(err=>{console.log(err.response)});
    if(flag){
      this.setState({user:user,status:1});
    }else{
      alert("Username not available");
    }
  } 
  async createRoom(room){
    var flag=true;
    if(room==='Default')
      flag=false;
    await axios.get(this.state.url+'/checkroom', {params:{room:room}}).then(res => {if(res.data.length>0){flag=false;}}).catch(err=>{console.log(err.response)});
    if(flag){
      this.setState({loading:true,room:room});
      const user=this.state.user;
      await this.ws.send(JSON.stringify({action: 'add',user:user,room:room}));
      this.setState({loading:false,status:2});
    }else{
      alert("Room not available");
    }
  }
  async joinRoom(room){
    var flag=true;
    if(room==='Default')
      flag=false;
    await axios.get(this.state.url+'/checkroom', {params:{room:room}}).then(res => {if(res.data.length===0){flag=false;}}).catch(err=>{console.log(err.response)});
    if(flag){
      this.setState({loading:true,room:room});
      const user=this.state.user;
      await this.ws.send(JSON.stringify({action: 'add',user:user,room:room}));
      this.setState({loading:false,status:2});
    }else{
      alert("No such room exists");
    }
  }
  async leaveRoom(){
    this.setState({loading:true,status:1,room:"",onlineUsers:[],messages:[]});
    await this.ws.send(JSON.stringify({action:'leave'}));
    this.setState({loading:false});
  }
  async send(msg,user){
    this.setState({loading:true});
    await this.ws.send(JSON.stringify({action: 'send',msg:msg,user:user}));
    this.setState({loading:false});
  } 
  render(){
    if(this.state.loading)
      return(<div>Loading...</div>);
    else
      return(
        <div>
          {(this.state.status===0)
          ?<User checkUsername={this.checkUsername}/>
          :(this.state.status===1)
          ?<Room joinRoom={this.joinRoom} createRoom={this.createRoom}/>
          :<Chat send={this.send} leaveRoom={this.leaveRoom} user={this.state.user} room={this.state.room} messages={this.state.messages} onlineUsers={this.state.onlineUsers}/> 
          }
        </div>
      );
  }
}
export default App;
