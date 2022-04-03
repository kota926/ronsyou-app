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

interface Like {
    count: number
    is_exist: boolean
}

interface StatementWithLike {
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
    like: Like
}


export const statementsWithLikeSlice = createSlice({
    name: 'statementsWithLike',
    initialState: [] as StatementWithLike[],
    reducers: {
        setStatementsWithLike: (state, action: PayloadAction<StatementWithLike[]>) => {
            return action.payload
        }
    }
})

export const { setStatementsWithLike } = statementsWithLikeSlice.actions

export default statementsWithLikeSlice.reducer