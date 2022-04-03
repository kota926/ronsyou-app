import React, { Fragment, useEffect, useState } from "react";
import axios from "../lib/axios";
import { useAuth } from "../AuthContext";
import {
    AppBar,
    Typography,
    IconButton,
    Toolbar,
    Drawer,
    List,
    ListItem,
    Box,
    ListItemIcon,
    ListItemText,
    useScrollTrigger,
    Slide,
    Dialog,
    Card,
} from "@mui/material";
import GavelIcon from '@mui/icons-material/Gavel';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const HideOnScroll = (props) => {
    const { children, window } = props
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    })
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

const SearchBar = () => {
    const auth = useAuth()
    const [anchor, setAnchor] = useState<Anchor>('left')
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth < 500) {
                setAnchor('bottom')
            } else {
                setAnchor('left')
            }
        }
        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleDrower = (boolean) => {
        setIsOpen(boolean)
    }
    const handleDialog = (boolean) => {
        setIsOpenDialog(boolean)
    }

    const logout = () => {
        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.signout().then(() => {
                window.location.reload()
            })
        })
    }
    return(
        <Fragment>
            <HideOnScroll>
                <AppBar sx={{bgcolor: 'black'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            // aria-label="menu"
                            onClick={() => toggleDrower(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link to="../home">
                            <IconButton
                                // edge="start"
                                color="inherit"
                                // aria-label="icon"
                                sx={{ml:1}}
                            >
                                <GavelIcon />
                            </IconButton>
                        </Link>
                        <Card
                        sx={{
                            bgcolor: '#333333',
                            width: 190,
                            height: 40,
                            ml: 2,
                        }}
                        onClick={() => handleDialog(true)}
                        >
                            <IconButton
                                sx={{my: 'auto', color: '#f1f1f1'}}
                                size="large"
                                edge="end"
                                color="inherit"
                                // aria-label="search"
                                // sx=  {{mr:1}}   
                            >
                                <SearchIcon />
                            </IconButton>
                        </Card>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Drawer
                anchor={anchor}
                open={isOpen}
                onClose={() => toggleDrower(false)}
            >
                <Box>
                    <List sx={{pr:4}}>
                        <Link to="../home">
                            <ListItem>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText>ホーム</ListItemText>
                            </ListItem>
                        </Link>
                        <Link to='../search'>
                            <ListItem>
                                <ListItemIcon><ContentPasteSearchIcon /></ListItemIcon>
                                <ListItemText>検索</ListItemText>
                            </ListItem>
                        </Link>
                        <ListItem onClick={logout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText>ログアウト</ListItemText>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Drawer
                anchor="top"
                open={isOpenDialog}
                onClose={() => handleDialog(false)}
            >
                <SearchBox
                    finishSearching={() => handleDialog(false)}
                />
            </Drawer>
        </Fragment>
    )
}

export default SearchBar