import React, {useState, useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';

import { login } from "../actions/auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import {clearMessage, setMessage} from "../actions/apiMessage";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    spinner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    input: {
        WebkitBoxShadow: "0 0 0 1000px #fff4eb inset",
        background: "#fff4eb"
    }
}));

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = ({history}) => {
    const [username, setUsername] = useState({value: "", error: ""});
    const [password, setPassword] = useState({value: "", error: ""});
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useSelector(state => state.auth);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        dispatch(clearMessage())
    }, [history.location, dispatch])

    const classes = useStyles();

    const onChangeUsername = (e) => {
        const newUsername = e.target.value;
        let error = username.error;
        if(newUsername.length >= 6 && newUsername.length <= 24){
            error = "";
        }
        setUsername({value: newUsername, error: error});
    };

    const onChangePassword = (e) => {
        const newPassword = e.target.value;
        let error = password.error;
        if(newPassword.length >= 6 && newPassword.length <= 24){
            error = "";
        }
        setPassword({value: newPassword, error: error});
    };

    const register = () => {
        history.push('/register');
    }

    const validate = () => {
        let validated = true;
        if(username.value.length < 6 || username.value.length > 24) {
            setUsername({value: username.value, error: "Username must be between 6 and 24 characters!"});
            validated = false;
        }
        if(password.value.length < 6 || password.value.length > 24){
            setPassword({value: password.value, error: "Password must be between 6 and 24 characters!"});
            validated = false;
        }
        return validated;
    }

    const handleClose = () => {
        dispatch(setMessage(""));
    }

    const clearFields = () => {
        setUsername({value: "", error: username.error});
        setPassword({value: "", error: password.error});
        usernameRef.current.value = "";
        passwordRef.current.value = "";
    }

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        if (validate()) {
            dispatch(login(username.value, password.value))
                .then(() => {
                    history.push("/profile");
                })
                .catch(() => {
                    clearFields();
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    if (isLoggedIn) {
        return <Redirect to="/profile" />;
    }

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleLogin}>
                    <TextField
                        inputRef={usernameRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={onChangeUsername}
                        InputProps={{classes: {input: classes.input}}}
                        error={username.error.length > 0}
                        helperText={username.error}
                    />
                    <TextField
                        inputRef={passwordRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={onChangePassword}
                        autoComplete="current-password"
                        InputProps={{ classes: { input: classes.input } }}
                        error={password.error.length > 0}
                        helperText={password.error}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        Sign In
                    </Button>
                    <Snackbar open={message !== undefined && message.length > 0} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">Incorrect username or password!</Alert>
                    </Snackbar>
                    <Grid container>
                        <Grid item>
                            <Link onClick={register} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                    {loading && (
                        <div className={classes.spinner} color="secondary">
                            <CircularProgress />
                        </div>

                    )}
                </form>
            </div>
        </Container>
    )

    /*
    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <Form onSubmit={handleLogin} ref={form}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="username"
                            value={username}
                            onChange={onChangeUsername}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={onChangePassword}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary btn-block" disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                        </button>
                    </div>


                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );

     */
};

export default Login;