import React, {useState, useRef, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import  validator  from "validator";

import { register } from "../actions/auth";
import {clearMessage, setMessage} from "../actions/apiMessage";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
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

const Register = ({history}) => {
    const imageRef = useRef(null);
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const password2Ref = useRef(null);
    const imageInputRef = useRef(null);

    const [username, setUsername] = useState({value: "", error: ""});
    const [email, setEmail] = useState({value: "", error: ""});
    const [password, setPassword] = useState({value: "", error: ""});
    const [password2, setPassword2] = useState({value: "", error: ""});
    const [image, setImage] = useState("");
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false);

    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const classes = useStyles();

    useEffect(() => {
        dispatch(clearMessage())
    }, [history.location, dispatch])

    const onChangeUsername = (e) => {
        const newUsername = e.target.value;
        let error = username.error;
        if(newUsername.length >= 6 && newUsername.length <= 24){
            error = "";
        }
        setUsername({value: newUsername, error: error});
    };

    const onChangeEmail = (e) => {
        const newEmail = e.target.value;
        let error = email.error;
        if(validator.isEmail(newEmail)){
            error = "";
        }
        setEmail({value: newEmail, error: error});
    };

    const onChangePassword = (e) => {
        const newPassword = e.target.value;
        let error = password.error;
        if(newPassword.length >= 6 && newPassword.length <= 24){
            error = "";
        }
        setPassword({value: newPassword, error: error});
    };

    const onChangePassword2 = (e) => {
        const newPassword = e.target.value;
        let error = password2.error;
        if(newPassword.length >= 6 && newPassword.length <= 24){
            error = "";
        }
        setPassword2({value: newPassword, error: error});
    };

    //read and validate the image
    //handles users renaming files with .jpg/.png/.gif... extensions
    //sets the imageError state to the new error
    const reader = new FileReader();
    const onChangeImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const image = e.target.files[0];
        if (!image) {
            setImageError('Please select an image.');
            return false;
        }

        if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            setImageError('Please select a valid image.');
            return false;
        }

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(image);
                imageRef.current.src = URL.createObjectURL(image);
            };
            img.onerror = () => {
                setImageError('Invalid image content.');
                return false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(image);
    };

    const imageClick = () => {
        imageInputRef.current.click();
    }

    const handleRegister = (e) => {
        e.preventDefault();

        setLoading(true);
        if (validate()) {
            console.log(username.value)
            dispatch(register(username.value, email.value, password.value, password2.value, image))
                .then(() => {
                    setLoading(false);
                    history.push('/login');
                })
                .catch(() => {
                    clearFields();
                    setLoading(false);
                });
        }else{
            clearFields();
            setLoading(false);
        }
    };

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
        if(password2.value.length < 6 || password2.value.length > 24){
            setPassword2({value: password2.value, error: "Password must be between 6 and 24 characters!"});
            validated = false;
        }
        if(!validator.isEmail(email.value)){
            setEmail({value: email.value, error: "Invalid email!"});
            validated = false;
        }
        return validated;
    }

    const handleClose = () => {
        dispatch(setMessage(""));
    }

    const clearFields = () => {
        setPassword({value: "", error: password.error});
        passwordRef.current.value = "";
        setPassword2({value: "", error: password2.error});
        password2Ref.current.value = "";
    }

    const login = () => {
        history.push('/login');
    }
//src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" profile pic
    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <input id="imageInput"
                       ref={imageInputRef}
                       accept="image/*"
                       type="file"
                       style={{display: 'none'}}
                       onChange={onChangeImage}
                />

                 <img
                     id="imgDisplay"
                     ref={imageRef}
                     src="betterCroppedImage.jpg"
                     alt="Profile Image"
                     className="profile-img-card"
                     onClick={imageClick}
                 />
                <form className={classes.form} onSubmit={handleRegister}>
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
                        inputRef={emailRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        onChange={onChangeEmail}
                        InputProps={{classes: {input: classes.input}}}
                        error={email.error.length > 0}
                        helperText={email.error}
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
                    <TextField
                        inputRef={password2Ref}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Repeat password"
                        type="password"
                        id="password2"
                        onChange={onChangePassword2}
                        autoComplete="current-password"
                        InputProps={{ classes: { input: classes.input } }}
                        error={password2.error.length > 0}
                        helperText={password2.error}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        Sign Up
                    </Button>
                    <Snackbar open={message !== undefined && message.length > 0} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">{message}</Alert>
                    </Snackbar>
                    <Grid container>
                        <Grid item>
                            <Link onClick={login} variant="body2">
                                {"Already have an account? Login"}
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
        <div style={{justifyContent: "center"}}>
            <div className="card card-container">
                <input id="imageInput"
                       accept="image/*"
                       type="file"
                       style={{display: 'none'}}
                       onChange={onChangeImage}
                />

                <img
                    id="imgDisplay"
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="Profile Image"
                    className="profile-img-card"
                    onClick={imageClick}
                />

                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={onChangeUsername}
                                    validations={[required, vusername]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={onChangeEmail}
                                    validations={[required, validEmail]}
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
                                    validations={[required, vpassword]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password2">Password2</label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password2}
                                    onChange={onChangePassword2}
                                    validations={[required, vpassword]}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Sign Up</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );

     */
};

export default Register;