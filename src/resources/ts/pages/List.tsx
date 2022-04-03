import { Button, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Box } from "@mui/material";
import React, { useState } from "react";
import BaseBar from "../components/BaseBar";
import ShowStatements from "../components/ShowStatements";
import StatementDialog from "../components/StatementDialog";

// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & {
//       children: React.ReactElement;
//     },
//     ref: React.Ref<unknown>,
//   ) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

const List = () => {
    return(
        <Box sx={{mt:9}}>
            <BaseBar />
            <StatementDialog />
            <ShowStatements />
        </Box>
    )
}

export default List