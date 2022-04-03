import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface List {
    created_at: Date
    id: string
    max_pos: number
    title: string
    updated_at: Date
    user_id: string
}

export const listSlice = createSlice({
    name: 'list',
    initialState: {} as List,
    reducers: {
        setList: (state, action: PayloadAction<List>) => {
            return Object.assign(state, action.payload)
        }
    }
})

export const { setList } = listSlice.actions

export default listSlice.reducer