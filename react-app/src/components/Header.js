import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    IconButton,
    Drawer,
    fade,
    MenuItem,
} from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React, { useState, useEffect } from "react";
import {Link as RouterLink, withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../actions/apiMessage";
import {logout} from "../actions/auth";
import PersonIcon from '@material-ui/icons/Person'; //profile
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'; //logout
import AddCircleIcon from '@material-ui/icons/AddCircle'; //add image
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; //login
import PostAddIcon from '@material-ui/icons/PostAdd'; //register
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import Tooltip from "@material-ui/core/Tooltip";
import {getAllByTitle, getAllForUser, getAllPaginatedSort} from '../actions/images'
//images

const useStyles = makeStyles((theme) => ({
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        padding: "20px 30px",
        height: "100vh",
        background: "#AC3B61",
        color: "#EEE2DC",
    },
    root: {
        flexGrow: 1,
        background: "#AC3B61",
        color: "#EEE2DC",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const Header = (props) => {
    const classes = useStyles();
    const { user: currentUser } = useSelector((state) => state.auth);
    const { sort: currentSort, page: page } = useSelector((state) => state.images);
    const dispatch = useDispatch();
    const history = props.history;
    const size = 20;

    useEffect(() => {
        history.listen((location) => {
            dispatch(clearMessage()); // clear message when changing location
        });
    }, [dispatch]);

    const logOut = () => {
        dispatch(logout());
        history.push('/login');
    };

    const search = (e) => {
        e.preventDefault();
        if(input.length === 0){
            dispatch(getAllPaginatedSort( 1, size, currentSort));
            return;
        }
        setState({drawerOpen: false, mobileView: mobileView});
        if(input.startsWith("@")){
            console.log(input + "starts with @");
            //todo search by username return all images uploaded by that user
        }else{
            dispatch(getAllByTitle(input, 1, size, currentSort));
        }

    };

    const { logo, toolbar, drawerContainer } = useStyles();

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const [input, setInput] = useState("");

    const onChangeInput = (e) => {
        setInput(e.target.value);
    }

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    const displayDesktop = () => {
        return (
            <Toolbar className={toolbar}>
                {appLogo}
                <div>
                    {currentUser &&
                    <IconButton
                        color="inherit"
                        className={classes.menuButton}
                        edge="start"
                        aria-label="menu"
                        onClick={() => {history.push('/addImage')}}
                    >
                        <AddCircleIcon/>
                        <Typography variant="subtitle1">Add Image</Typography>
                    </IconButton>}
                </div>
                <div style={{justifyContent: "right"}}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <form className="App" onSubmit={search}>
                            <InputBase
                                placeholder="Images or @users…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={onChangeInput}
                            />
                        </form>
                    </div>
                </div>

                <div>
                    <Tooltip title={<h3>List Images</h3>} arrow interactive>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            edge="start"
                            aria-label="menu"
                            onClick={() => history.push('/images')}
                        >
                            <PhotoAlbumIcon/>
                        </IconButton>
                    </Tooltip>

                    {currentUser &&
                    <Tooltip title={<h3>Profile</h3>} arrow interactive>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            edge="start"
                            aria-label="menu"
                            onClick={() => {history.push('/profile')}}
                        >
                            <PersonIcon/>
                        </IconButton>
                    </Tooltip>}
                    {currentUser &&
                    <Tooltip title={<h3>Logout</h3>} arrow interactive>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            edge="start"
                            aria-label="menu"
                            onClick={logOut}
                        >
                            <PowerSettingsNewIcon/>
                        </IconButton>
                    </Tooltip>}

                    {!currentUser &&
                    <Tooltip title={<h3>Sign Up</h3>} arrow interactive>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            edge="start"
                            aria-label="menu"
                            onClick={() => {history.push('/register')}}
                        >
                            <PostAddIcon/>
                            <Typography variant="subtitle1">Sign Up</Typography>
                        </IconButton>
                    </Tooltip>}

                    {!currentUser &&
                    <Tooltip title={<h3>Login</h3>} arrow interactive>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            edge="start"
                            aria-label="menu"
                            onClick={() => {history.push('/login')}}
                        >
                            <ExitToAppIcon/>
                            <Typography variant="subtitle1">Login</Typography>
                        </IconButton>
                    </Tooltip>}
                </div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        return (
            <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "inherit",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>
                        <MenuItem>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <form className="App" onSubmit={search}>
                                    <InputBase
                                        placeholder="Images or @users…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={onChangeInput}
                                    />
                                </form>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            {currentUser &&
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    history.push('/addImage');
                                }}
                            >
                                <AddCircleIcon/>
                                <Typography variant="subtitle1">Add Image</Typography>
                            </IconButton>}
                        </MenuItem>
                        <MenuItem>
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    history.push('/images');
                                }}
                            >
                                <PhotoAlbumIcon/>
                                <Typography variant="subtitle1">Images</Typography>
                            </IconButton>
                        </MenuItem>
                        {currentUser &&
                        <MenuItem>
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    history.push('/profile');
                                }}
                            >
                                <PersonIcon/>
                                <Typography variant="subtitle1">Profile</Typography>
                            </IconButton>
                        </MenuItem>}

                        {currentUser &&
                        <MenuItem>
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    logOut();
                                }}
                            >
                                <PowerSettingsNewIcon/>
                                <Typography variant="subtitle1">Logout</Typography>
                            </IconButton>
                        </MenuItem>}

                        {!currentUser &&
                        <MenuItem>
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    history.push('/register');
                                }}
                            >
                                <PostAddIcon/>
                                <Typography variant="subtitle1">Sign Up</Typography>
                            </IconButton>
                        </MenuItem>}

                        {!currentUser &&
                        <MenuItem>
                            <IconButton
                                color="inherit"
                                className={classes.menuButton}
                                edge="start"
                                aria-label="menu"
                                onClick={() => {
                                    setState({drawerOpen: false, mobileView: mobileView})
                                    history.push('/login');
                                }}
                            >
                                <ExitToAppIcon/>
                                <Typography variant="subtitle1">Login</Typography>
                            </IconButton>
                        </MenuItem>}
                    </div>
                </Drawer>

                <div>{appLogo}</div>
            </Toolbar>
        );
    };

    const appLogo = (
        <Typography variant="h6" component="h1" className={logo}>
            Image Gallery
        </Typography>
    );

    return (
        <header>
            <AppBar className={classes.root}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    );
}

export default withRouter(Header)