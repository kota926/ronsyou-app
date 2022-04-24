import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Stack,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from "react-router-dom";

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

const BaseBar = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const [anchor, setAnchor] = useState<Anchor>('left')
    const [isOpen, setIsOpen] = useState(false)

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

    const logout = () => {
        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.signout().then(() => {
                navigate('../login')
            })
        })
    }

    return(
        <Fragment>
            <HideOnScroll>
                <AppBar sx={{bgcolor: 'black'}}>
                    <Toolbar>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <div>
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
                                    edge="start"
                                    color="inherit"
                                    // aria-label="icon"
                                    sx={{ml:1}}
                                >
                                    <GavelIcon />
                                </IconButton>
                            </Link>
                        </div>
                        <Link to="../search">
                            <IconButton
                                size="large"
                                // sx={{ml: 'auto'}}
                                edge='end'
                                color="inherit"
                                // aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Link>
                    </Stack>
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
                        <ListItem>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText>ホーム</ListItemText>
                        </ListItem>
                        <Link to='../search'>
                            <ListItem>
                                <ListItemIcon><ContentPasteSearchIcon /></ListItemIcon>
                                <ListItemText>検索</ListItemText>
                            </ListItem>
                        </Link>
                        {/* <ListItem>
                            <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                            <ListItemText>ユーザー情報</ListItemText>
                        </ListItem> */}
                        {auth.user ? (<ListItem onClick={logout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText>ログアウト</ListItemText>
                        </ListItem>) : (<Link to='../login'>
                            <ListItem>
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText>ログイン</ListItemText>
                            </ListItem>
                        </Link>)}
                    </List>
                </Box>
            </Drawer>
        </Fragment>
    )
}

export default BaseBar