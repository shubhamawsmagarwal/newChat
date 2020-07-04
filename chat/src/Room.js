import React,{ Component } from 'react';
class Room extends Component{
    render(){
        return(
            <div className="join-container">
        		<header className="join-header">
        			<h1>ChatApp</h1>
        		</header>
        		<main className="join-main">
        			<form onSubmit={(event) => {
                            event.preventDefault();
                            const createRoom = this.createRoom.value;
                            this.props.createRoom(createRoom);
                    }}>
        				<div className="form-control">
        					<label>Create Room</label>
        					<input
        						type="text"
        						ref={(input) => { this.createRoom = input }}
        						placeholder="Enter room name..."
        						required
        					/>
        				</div>
        				<button type="submit" className="btn">Create Room</button>
        			</form>
        			<form onSubmit={(event) => {
                            event.preventDefault();
                            const joinRoom = this.joinRoom.value;
                            this.props.joinRoom(joinRoom);
                    }}>
        				<div className="form-control">
        					<label>Join Room</label>
        					<input
        						type="text"
        						ref={(input) => { this.joinRoom = input }}
        						placeholder="Enter room name..."
        						required
        					/>
        				</div>
        				<button type="submit" className="btn">Join Room</button>
        			</form>
        		</main>
		    </div>
        );
    }
}
export default Room;