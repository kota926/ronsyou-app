import { Container } from "@mui/material";
import React, { Fragment, useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchedStatements from "../components/SearchedStatements";

const Search = () => {
    return(
        <Container sx={{pt:8}}>
            <SearchBar />
            <SearchedStatements />
        </Container>
    )
}

export default Search