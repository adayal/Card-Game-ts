import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userState from '../reducers/username/userState';

const store = configureStore({
    reducer: combineReducers({
        userState: userState
    }),
})

export default store;