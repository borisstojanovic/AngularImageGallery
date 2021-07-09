import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from "react-redux";
import {addLike, removeLike, addFavorite, removeFavorite, getImage, addViews} from "../actions/images";
import {IconButton} from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Grow from "@material-ui/core/Grow";
import queryString from "query-string";
import Container from "@material-ui/core/Container";
import ImageCommentsList from "./ImageCommentsList";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


function formatDate(date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: "80%",
        background: "#eee2dc"
    },
    mediaActionBar: {
        justifyContent: "space-evenly",
        background: "#fff4eb"
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fff4eb",
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const ImageDetails = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { image } = useSelector((state) => state.singleImage);

    const [loaded, setLoaded] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    const classes = useStyles();

    const like = (is_like) => {
        dispatch(addLike(currentUser.id, image.id, is_like));
    };

    const favorite = () => {
        dispatch(addFavorite(currentUser.id, image.id));
    };

    const deleteLike = () => {
        dispatch(removeLike(currentUser.id, image.id));
    };

    const deleteFavorite = () => {
        dispatch(removeFavorite(currentUser.id, image.id));
    };

    const handleItemClick = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleFavoriteClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(image.isFavorite)
                deleteFavorite();
            else
                favorite();
        }
    }

    const handleUpClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(image.isLike === true)
                deleteLike();
            else
                like(true);
        }
    }

    const handleDownClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(image.isLike === false)
                deleteLike();
            else
                like(false);
        }

    }

    //adds the view if image was changed and image matches the url parameter id
    useEffect(() => {
        let search = queryString.parse(props.location.search);
        if(image && image.id === parseInt(search.id)){
            setLoaded(true);
        }
    }, [image, props.location.search])

    //loads the image using url parameter id
    useEffect(() => {
        let search = queryString.parse(props.location.search);
        if(!search || !search.id){
            props.history.push('/images');
        }
        dispatch(getImage(search.id));
    }, [dispatch, props.location.search, props.history]);

    //if image was loaded adds a view for that image
    useEffect(() => {
        let search = queryString.parse(props.location.search);
        if(!search || !search.id){
            props.history.push('/images');
        }
        if(loaded){
            dispatch(addViews(search.id));
        }

    }, [dispatch, loaded, props.location.search, props.history]);

    return (
        <Container className={classes.container} maxWidth="sm">
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={openModal}
                onClose={handleCloseModal}
                style={{display: 'flex', flexDirection: 'column', margin: 'auto', width: 'fit-content'}}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle><a href={image.path} target="_blank" rel="noreferrer">{image.title}</a> </DialogTitle>
                <DialogContent>
                    <img style={{width: "100%"}} src={image.path} alt={image.description}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Grow in={true}>
                <Card className={classes.root}>
                    {(!image || !image.user) &&
                    <CardHeader
                        avatar={
                            <Avatar aria-label="image" src="betterCroppedImage.jpg"/>
                        }
                        title="Placeholder"
                        subheader="Placeholder"
                    />
                    }
                    {(image && image.user) &&
                    <CardHeader
                        avatar={
                            <Avatar aria-label="image" src={image.user.path}/>
                        }
                        title={image.user.username}
                        subheader={formatDate(image.time)}
                    />
                    }
                    <CardActionArea onClick={handleItemClick}>
                        <CardMedia
                            component="img"
                            alt="Gallery Image"
                            image={image.path}
                            title="Gallery Image"
                            style={{width: "100%"}}
                        />
                        <CardContent style={{height: "fit-content"}} className="media-card">
                            <Typography gutterBottom={false} variant="subtitle1" component="p">
                                {image.title}
                            </Typography>
                            <Typography gutterBottom={false} variant="body2" component="p">
                                {image.description}
                            </Typography>
                            <Typography gutterBottom={false} variant="body2" component="p">
                                Views: {image.views}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={classes.mediaActionBar}>
                        <IconButton size={"small"} onClick={handleUpClick}>
                            {image.isLike === true && <ThumbUpAltIcon style={{color: "darkgreen"}}/>}
                            {!image.isLike && <ThumbUpAltOutlinedIcon/>}
                            {image.isLike === true && <small style={{color: "darkgreen", fontSize: "10pt", marginLeft: "2px", marginTop: "5px"}}>{image.likes}</small>}
                            {!image.isLike && <small style={{fontSize: "10pt", marginLeft: "2px", marginTop: "5px"}}>{image.likes}</small>}
                        </IconButton>
                        <IconButton size={"small"} onClick={handleDownClick}>
                            {image.isLike === false && <ThumbDownAltIcon style={{color: "#AC3B61"}}/>}
                            {(image.isLike === true || image.isLike === undefined || image.isLike === null) && <ThumbDownAltOutlinedIcon/>}
                            {image.isLike === false && <small style={{color: "#AC3B61", fontSize: "10pt", marginLeft: "4px", marginTop: "5px"}}>{image.dislikes}</small>}
                            {(image.isLike === true || image.isLike === undefined || image.isLike === null) &&
                            <small style={{fontSize: "10pt", marginLeft: "4px", marginTop: "5px"}}>{image.dislikes}</small>}
                        </IconButton>
                        <IconButton size={"small"} onClick={handleFavoriteClick}>
                            {image.isFavorite && <FavoriteIcon style={{color: "#ffbe00"}}/>}
                            {!image.isFavorite && <FavoriteBorderIcon/>}
                        </IconButton>
                    </CardActions>
                </Card>
            </Grow>
            {loaded &&
                <ImageCommentsList imageId={image.id}/>
            }
            <div style={{marginBottom: "10px"}}/>


        </Container>


    );
}


export default ImageDetails;