import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface List {
    created_at: Date
    id: string
    max_pos: number
    title: string
    updated_at: Date
    user_id: string
}

export const listArraySlice = createSlice({
    name: 'listArray',
    initialState: [] as List[],
    reducers: {
        setListArray: (state, action: PayloadAction<List[]>) => {
            return action.payload
        }
    }
})

export const { setListArray } = listArraySlice.actions

export default listArraySlice.reducer