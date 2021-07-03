import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from "react-redux";
import { withRouter } from "react-router-dom";
import {addLike, removeLike, addFavorite, removeFavorite} from "../actions/images";
import {IconButton} from "@material-ui/core";
import GradeOutlinedIcon from '@material-ui/icons/GradeOutlined';
import GradeIcon from '@material-ui/icons/Grade';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import Grow from "@material-ui/core/Grow";

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

    const handleItemClick = () => {

    }

    const handleFavoriteClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(props.image.isFavorite)
                deleteFavorite();
            else
                favorite();
        }
    }

    const handleUpClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(props.image.isLike === true)
                deleteLike();
            else
                like(true);
        }
    }

    const handleDownClick = () => {
        if(currentUser === null){
            props.history.push("/login");
        }else{
            if(props.image.isLike === false)
                deleteLike();
            else
                like(false);
        }

    }

    return (
        <Grow in={true}>
            <Card>
                <CardActionArea onClick={handleItemClick}>
                    <CardMedia
                        component="img"
                        alt="Gallery Image"
                        image={props.image.path}
                        title="Gallery Image"
                    />
                    <CardContent style={{height: "fit-content"}} className="media-card">
                        <Typography gutterBottom={false} variant="subtitle1" component="p">
                            {props.image.title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className="media-action-bar">
                    <IconButton size={"small"} onClick={handleUpClick}>
                        {props.image.isLike === true && <ThumbUpAltIcon style={{color: "darkgreen"}}/>}
                        {!props.image.isLike && <ThumbUpAltOutlinedIcon/>}
                    </IconButton>
                    <IconButton size={"small"} onClick={handleDownClick}>
                        {props.image.isLike === false && <ThumbDownAltIcon style={{color: "#AC3B61"}}/>}
                        {(props.image.isLike === true || props.image.isLike === null) && <ThumbDownAltOutlinedIcon/>}
                    </IconButton>
                    <IconButton size={"small"} onClick={handleFavoriteClick}>
                        {props.image.isFavorite && <GradeIcon style={{color: "#ffbe00"}}/>}
                        {!props.image.isFavorite && <GradeOutlinedIcon/>}
                    </IconButton>
                </CardActions>
            </Card>
        </Grow>

    );
}

export default withRouter(ImageItem);