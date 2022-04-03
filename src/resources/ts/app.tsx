import React from "react";
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Top from './pages/Top'
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import List from "./pages/List"
import Search from "./pages/Search"
import ProvideAuth, { PrivateRoute, PublicRoute } from './AuthContext'

const App = () => {
    return (
        <Provider store={store}>
            <ProvideAuth>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<PublicRoute children={<Login />} />} />
                        <Route path="register" element={<PublicRoute children={<Register />} />} />
                        <Route path="login" element={<PublicRoute children={<Login />} />} />
                        <Route path="home" element={<PrivateRoute children={<Home />} />} />
                        <Route path="list/:id" element={<PrivateRoute children={<List />} />} />
                        <Route path="search" element={<Search />} />
                    </Routes>
                </BrowserRouter>
            </ProvideAuth>
        </Provider>
    )
}
 
ReactDOM.render(
    <App />,
    document.getElementById('app')
)