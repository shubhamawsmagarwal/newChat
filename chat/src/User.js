import React,{ Component } from 'react';
class User extends Component{
    render(){
        return(
            <div className="join-container">
        		<header className="join-header">
        			<h1>ChatApp</h1>
        		</header>
        		<main className="join-main">
        			<form onSubmit={(event) => {
                            event.preventDefault();
                            const user = this.user.value;
                            this.props.checkUsername(user);
                    }}>
        				<div className="form-control">
        					<label>Username</label>
        					<input
        						type="text"
        						ref={(input) => { this.user = input }}
        						placeholder="Choose a username..."
        						required
        					/>
        				</div>
        				<button type="submit" className="btn">Next</button>
        			</form>
        		</main>
		    </div>
        );
    }
}
export default User;