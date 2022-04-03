import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const statementSlice = createSlice({
    name: 'isUpdate',
    initialState: false,
    reducers: {
        setIsUpdate: (state, action: PayloadAction<boolean>) => {
            return Object.assign(state, action.payload)
        }
    }
})

export const { setIsUpdate } = statementSlice.actions

export default statementSlice.reducer