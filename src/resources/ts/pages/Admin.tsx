import React, { Fragment } from "react";
import CreateList from "../components/CreateList";
import CreateTopic from "../components/CreateTopic";
import ShowTopics from "../components/ShowTopics";

const Admin = () => {
    return (
        <Fragment>
            <CreateList />
            <CreateTopic />
            <ShowTopics />
        </Fragment>
    )
}

export default Admin;