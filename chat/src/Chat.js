import React,{ Component } from 'react';
class Chat extends Component{
    render(){
        const onlineUsers=this.props.onlineUsers.map((user,index)=>(
            <li key={index}>{user}</li>
        ));
        const messages=this.props.messages.map((msg,index)=>(
            <div className="message" key={index}>
  						<p className="meta">{msg.username+"   "}<span>{msg.time}</span></p>
  						<p>{msg.msg}</p>
          	</div>
        ));
        return(
            <div className="chat-container">
                <header className="chat-header">
                  <h1>ChatApp</h1>
                  <button onClick={(event) => {
                            event.preventDefault()
                            this.props.leaveRoom();}} 
                          className="btn">Leave Room</button>
                </header>
                <main className="chat-main">
                  <div className="chat-sidebar">
                    <h2>{this.props.user}</h2>
                    <h3>Room Name:</h3>
                    <h2>{this.props.room}</h2>
                    <h3>Online Users</h3>
                    <ul>{onlineUsers}</ul>
                  </div>
                  <div className="chat-messages">{messages}</div>
                </main>
                <div className="chat-form-container">
                  <form onSubmit={(event) => {
                            event.preventDefault()
                            const msg = this.msg.value;
                            this.props.send(msg,this.props.user);
                  }}>
                    <input
                      type="text"
                      ref={(input) => { this.msg = input }}
                      placeholder="Enter Message"
                      required
                      autoComplete="off"
                    />
                    <button type="submit" className="btn">Send</button>
                  </form>
                </div>
            </div>
        );
    }
}
export default Chat;