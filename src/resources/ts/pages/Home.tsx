import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Box } from "@mui/material";
import ShowList from "../components/ShowList";
import BaseBar from "../components/BaseBar";

const Home = () => {
    return (
      <Box sx={{pt: 8}}>
        <BaseBar />
        <ShowList />
      </Box>
    )
  }
  
  export default Home;