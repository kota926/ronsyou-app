import { configureStore } from "@reduxjs/toolkit";
import statementReducer from './modules/statement'
import statementArrayReducer from './modules/statementArray'
import statementsWithLikeResucer from "./modules/statementsWithLike";
import listReducer from './modules/lists'
import isUpdateReducer from "./modules/isUpdate";
import statementUIReducer from "./modules/statementUI";

export const store = configureStore({
    reducer: {
        statement: statementReducer,
        statementArray: statementArrayReducer,
        statementsWithLike:statementsWithLikeResucer,
        list: listReducer,
        isUpdate: isUpdateReducer,
        statementUI: statementUIReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch