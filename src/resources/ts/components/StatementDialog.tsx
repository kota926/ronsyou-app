import { Button, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "../redux/modules/statementUI";
import { RootState } from "../redux/store";
import { Box } from "@mui/system";
import React, { Fragment, useState } from "react";
import CreateStatement from "../components/CreateStatement";
import ShowStatements from "../components/ShowStatements";
import UpdateStatement from "./UpdateStatement";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const StatementDialog = () => {
    const dispatch = useDispatch()
    const statementUI = useSelector((state: RootState) => state.statementUI)
    // const [isOpenDialog, setIsOpenDialog] = useState(false)

    const handleOpenDialog = () => {
        dispatch(openDialog(false))
    }
    // const handleCloseDialog = () => {
    //     setIsOpenDialog(false)
    // }

    return(
        <Fragment>
            <Dialog
            fullScreen
            open={statementUI.isOpenDialog}
            TransitionComponent={Transition}
            >
                {statementUI.isUpdate ? <UpdateStatement /> : <CreateStatement />}
            </Dialog>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Button
                sx={{bgcolor: "white", mx: 'auto', mt: 2}}
                variant="outlined"
                onClick={handleOpenDialog}
                >新規作成
                </Button>
            </Stack>
        </Fragment>
    )
}

export default StatementDialog