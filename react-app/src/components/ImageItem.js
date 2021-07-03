import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from "react-redux";
import { Redirect } from 'react-router-dom';
import {addLike, removeLike, addFavorite, removeFavorite} from "../actions/images";
import {IconButton} from "@material-ui/core";
import { history } from "../helpers/history";
import GradeOutlinedIcon from '@material-ui/icons/GradeOutlined';
import GradeIcon from '@material-ui/icons/Grade';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';

const ImageItem = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const like = (is_like) => {
        dispatch(addLike(currentUser.id, props.image.id, is_like));
    };

    const favorite = () => {
        dispatch(addFavorite(currentUser.id, props.image.id));
    };

    const deleteLike = () => {
        dispatch(removeLike(currentUser.id, props.image.id));
    };

    const deleteFavorite = () => {
        dispatch(removeFavorite(currentUser.id, props.image.id));
    };

    const handleFavoriteClick = () => {
        if(currentUser === null){
            history.push("/login");
            window.location.reload();
        }
        if(props.image.isFavorite)
            deleteFavorite();
        else
            favorite();
    }

    const handleUpClick = () => {
        if(currentUser === null){
            history.push("/login");
            window.location.reload();
        }
        if(props.image.isLike === true)
            deleteLike();
        else
            like(true);
    }

    const handleDownClick = () => {
        if(currentUser === null){
            history.push("/login");
            window.location.reload();
        }
        if(props.image.isLike === false)
            deleteLike();
        else
            like(false);
    }

    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Gallery Image"
                    image={props.image.path}
                    title="Gallery Image"
                />
                <CardContent className="media-card">
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.image.title}
                    </Typography>
                    <Typography variant="body2" component="p">by: {props.image.user.username}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="media-action-bar">
                <IconButton onClick={handleUpClick}>
                    {props.image.isLike === true && <ThumbUpAltIcon style={{color: "green"}}/>}
                    {!props.image.isLike && <ThumbUpAltOutlinedIcon/>}
                </IconButton>
                <IconButton onClick={handleDownClick}>
                    {props.image.isLike === false && <ThumbDownAltIcon style={{color: "red"}}/>}
                    {(props.image.isLike === true || props.image.isLike === null) && <ThumbDownAltOutlinedIcon/>}
                </IconButton>
                <IconButton onClick={handleFavoriteClick}>
                    {props.image.isFavorite && <GradeIcon style={{color: "gold"}}/>}
                    {!props.image.isFavorite && <GradeOutlinedIcon/>}
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default ImageItem;