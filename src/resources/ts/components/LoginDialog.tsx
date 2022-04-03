import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const LoginDialog = (props) => {
    return(
        <Dialog
        open={props.dialog}
        onClose={() => props.closeLoginDialog()}
        >
            <DialogTitle>
                ログイン
            </DialogTitle>
            <DialogContent>
                {props.message}を利用するにはログインする必要があります。
            </DialogContent>
            <DialogActions>
                <Button
                variant="outlined"
                color="error"
                onClick={() => props.closeLoginDialog()}
                >キャンセル</Button>
                <Link to='../login'>
                    <Button
                    sx={{mx:2}}
                    variant="outlined"
                    >ログイン</Button>
                </Link>
            </DialogActions>
        </Dialog>
    )
}

export default LoginDialog