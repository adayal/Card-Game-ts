import React from 'react';
import './App.css';
import constants from '../../common/CONSTANTS'
import { Button } from './components/Button'

class App extends React.Component<{}, any> {
  state = {
    username: localStorage.getItem(constants.LOCALSTORAGE.GET_USERNAME)
  }
  
  render() {
    return (
      <div className="App">
        {console.log(this.state)}
        {this.state.username != null && this.state.username.length > 0 &&
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
      </div>
    );
  }
}

export default App;
