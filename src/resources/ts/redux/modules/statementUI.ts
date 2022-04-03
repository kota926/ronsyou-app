import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const statementUISlice = createSlice({
    name: 'statementUI',
    initialState: {
        isOpenDialog: false,
        isUpdate: false
    },
    reducers: {
        openDialog: (state, action: PayloadAction<boolean>) => {
            return Object.assign(state, {
                isOpenDialog: true,
                isUpdate: action.payload
            })
        },
        closeDialog: (state) => {
            return Object.assign(state, {
                isOpenDialog: false,
            })
        },
    }
})

export const { openDialog, closeDialog } = statementUISlice.actions

export default statementUISlice.reducer