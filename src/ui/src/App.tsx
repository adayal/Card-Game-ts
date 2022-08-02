import React from 'react';
import './App.css';
import constants from '../../common/CONSTANTS'
import { Button } from './components/Button'
import { Server, Socket } from "socket.io"

class App extends React.Component<{}, any> {
  constructor() {
    super({});
    this.state = {
      username: localStorage.getItem(constants.LOCALSTORAGE.GET_USERNAME),
      socket: null
    };
  }

  initState() {
    let { socket } = this.state;
    if (!socket) {
      console.log("connecting again")
      socket = io(constants.APP_PATH.SOCKET_PATH);
      this.setState({socket});
    }
  }

  componentDidMount() {
    this.initState();
  }

  submitUserName = () => {
    let inputBox = document.getElementById("usernameInput") as HTMLInputElement;
    this.setState({
      username: inputBox.value
    });
    let { socket } = this.state;
    socket.emit("username", inputBox.value)
  }
  
  render() {
    const { username } = this.state;
    return (
      <div className="App">
        {username!= null && username.length > 0 &&
          <div>
            <div>
              <h2>Welcome {this.state.username}!</h2>
            </div>
            <div>
              <Button name={"List Rooms"} route={constants.APP_PATH.LIST_ROOMS}/>
            </div>
            <div>
              <Button name={"Create Room"} route={constants.APP_PATH.CREATE_ROOM}/>
            </div>
          </div>
        }
        {(username == null || username.length === 0) &&
          <div>
            <div>
              <h2>Welcome! Please type in your username: </h2>  
            </div>
            <div>
              <input type="text" id="usernameInput" placeholder='Type your Username here'/>
            </div>
            <div>
              <Button name={"Submit Name"} onclick={this.submitUserName}></Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
