import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import axios from "../lib/axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GetStatement = (props) => {
    const navigate = useNavigate()
    const auth = useAuth()
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState({})
    const selectedListRef = useRef<HTMLElement>(null);

    const handleListChange = (e) => {
        setSelectedList(e.target.value)
    }
    const handleCancel = () => {
        props.closeDialog()
    }
    const handleSave = () => {
        const listToSave = props.lists.find((list) => {
            return list.title === selectedList
        })
        const statement = props.statement
        const dataToSend = {
            title: statement.title,
            topic_id: statement.topic_id,
            question: statement.question,
            text: statement.text,
            memo: '',
            position: listToSave.max_pos + 1,
            is_public: false,
            user_id: auth.user.id,
            list_id:listToSave.id,
            publisher_id: statement.publisher_id,
        }
        axios.post('/api/v1/statements/create', dataToSend).then((res) => {
            const dataToUpdate = {
                max_pos: listToSave.max_pos + 1
            }
            axios.put('/api/v1/lists/update/'  + listToSave.id, dataToUpdate).then((res) => {
                props.closeDialog()
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
            if(err.message === "Unauthenticated.") {
                navigate('../login')
            }
        })   
    }
    return(
        <Dialog
        open={props.isOpenImport}
        onClose={handleCancel}
        >
            <DialogTitle>論証をストックする</DialogTitle>
            <DialogContent>
                <RadioGroup
                // ref={selectedListRef}
                value={selectedList}
                onChange={handleListChange}>
                    {props.lists ? props.lists.map((list) => (
                        <FormControlLabel
                        value={list.title}
                        key={list.id}
                        control={<Radio />}
                        label={list.title}
                      />
                    )) : <div>n</div>}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                キャンセル
                </Button>
                <Button onClick={handleSave}>追加</Button>
            </DialogActions>
        </Dialog>
    )
}

export default GetStatement