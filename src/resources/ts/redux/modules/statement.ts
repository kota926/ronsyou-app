import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Topic {
    id: string
    subject: string
    unit: string
    name: string
    is_available: boolean
    created_at: Date
    updated_at: Date
}

interface Statement {
    id: string
    user_id: string
    publisher_id: string
    list_id: string
    topic_id: string
    topic: Topic
    title: string
    question: string
    text: string
    memo: string
    position: number
    is_public: boolean
    created_at: Date
    updated_at: Date
}

export const statementSlice = createSlice({
    name: 'statement',
    initialState: {} as Statement,
    reducers: {
        setStatement: (state, action: PayloadAction<Statement>) => {
            return Object.assign(state, action.payload)
        }
    }
})

export const { setStatement } = statementSlice.actions

export default statementSlice.reducer