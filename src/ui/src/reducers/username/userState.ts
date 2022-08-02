import { createSlice } from '@reduxjs/toolkit'

export interface userState {
    username: string
}

interface SliceState {
    user: userState
}

const userState = createSlice({
    name: 'user',
    initialState: {
        user: {
            username: ''
        },
    } as SliceState,
    reducers: {
        setUsername: (state: any, action: any) => {
            state.user = {
                username: action.payload
            }
        }
    }
})

export const { setUsername } = userState.actions;
export default userState.reducer;