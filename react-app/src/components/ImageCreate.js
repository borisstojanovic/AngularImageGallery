import {makeStyles} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage, setMessage} from "../actions/apiMessage";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Redirect} from "react-router-dom";
import {add, edit, getImage, update} from "../actions/images";

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
    },
    description: {
        background: "#fff4eb"
    },

}));

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ImageCreate = (props) => {
    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageInputRef = useRef(null);

    const [title, setTitle] = useState({value: "", error: ""});
    const [description, setDescription] = useState({value: "", error: ""});
    const [image, setImage] = useState("");
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false);

    const { message } = useSelector(state => state.message);
    const { user: currentUser } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const classes = useStyles();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    const onChangeTitle = (e) => {
        const newTitle = e.target.value;
        let error = title.error;
        if(newTitle.length >= 6 && newTitle.length <= 45){
            error = "";
        }
        setTitle({value: newTitle, error: error});
    };

    const onChangeDescription = (e) => {
        const newDescription = e.target.value;
        let error = description.error;
        if(newDescription.length >= 6 && newDescription.length <= 256){
            error = "";
        }
        setDescription({value: newDescription, error: error});
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

    const handleCreate = (e) => {
        e.preventDefault();

        setLoading(true);
        if (validate()) {
            dispatch(add(currentUser.id, title.value, description.value, image))
                .then(() => {
                    setLoading(false);
                    props.history.push('/images');
                })
                .catch(() => {
                    setLoading(false);
                });
        }else{
            setLoading(false);
        }
    };

    const validate = () => {
        let validated = true;
        if(title.value.length < 6 || title.value.length > 45) {
            setTitle({value: title.value, error: "Title must be between 6 and 45 characters!"});
            validated = false;
        }
        if(description.value.length < 6 || description.value.length > 256){
            setDescription({value: description.value, error: "Description must be between 6 and 256 characters!"});
            validated = false;
        }

        if(!image){
            setImageError("Select an image");
            validated = false;
        }

        return validated;
    }

    const handleClose = () => {
        dispatch(setMessage(""));
    }

    const handleImageErrorClose = () => {
        setImageError("");
    }

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

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
                    src="createImagePlaceholderDarker.png"
                    alt="Image"
                    style={{width: "100%", cursor: "pointer"}}
                    onClick={imageClick}
                />
                <form className={classes.form} onSubmit={handleCreate}>
                    <TextField
                        inputRef={titleRef}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoComplete="off"
                        onChange={onChangeTitle}
                        InputProps={{classes: {input: classes.input}}}
                        error={title.error.length > 0}
                        helperText={title.error}
                    />
                    <TextField
                        inputRef={descriptionRef}
                        multiline={true}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="description"
                        label={"Description"}
                        name="description"
                        autoComplete="off"
                        onChange={onChangeDescription}
                        error={description.error.length > 0}
                        className={classes.description}
                        helperText={description.error}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        Add image
                    </Button>
                    <Snackbar open={(message !== undefined && message.length > 0)} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">{message}</Alert>
                    </Snackbar>
                    <Snackbar open={imageError.length>0} autoHideDuration={6000} onClose={handleImageErrorClose}>
                        <Alert onClose={handleImageErrorClose} severity="error">{imageError}</Alert>
                    </Snackbar>
                    {loading && (
                        <div className={classes.spinner} color="secondary">
                            <CircularProgress />
                        </div>

                    )}
                </form>
            </div>
        </Container>
    )
};

export default ImageCreate;