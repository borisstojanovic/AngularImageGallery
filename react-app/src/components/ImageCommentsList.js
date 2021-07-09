import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {addComment, getAllCommentsPaginated} from "../actions/comments";
import {withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import CommentItem from "./CommentItem";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

const ImageCommentsList = (props) => {
    const {comments, allLoaded, size} = useSelector((state) => state.comments);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const commentRef = useRef(null);

    const [startId, setStartId] = useState(0);
    const [comment, setComment] = useState({value:"", error:""});
    const [loaded, setLoaded] = useState(false);
    const [imageId, setImageId] = useState(0);
    const dispatch = useDispatch();

    const getAllComments = () => {
        if(comments.length === 0){
            setStartId(0);
        }else{
            setStartId(comments[comments.length-1].id);
        }
    }

    useEffect(() => {
        setImageId(props.imageId);
        setLoaded(true);
    }, [props.imageId])

    useEffect(() => {
        if(!loaded){
            return;
        }
        dispatch(getAllCommentsPaginated(imageId, startId, size));
    }, [dispatch, startId, imageId, loaded, size]);

    const onChangeComment = (e) => {
        const newComment = e.target.value;
        let error = comment.error;
        if(newComment.length >= 1 && newComment.length <= 256){
            error = "";
        }
        setComment({value: newComment, error: error});
    }

    const handleComment = (e) => {
        e.preventDefault();
        if(comment.value.length === 0){
            setComment({value: comment.value, error: "Comment cannot be empty"});
            return;
        }
        if(comment.value.length > 256){
            setComment({value: comment.value, error: "Comment cannot be longer than 256 characters"});
            return;
        }
        dispatch(addComment(props.imageId, comment.value)).catch(err=> {
            if(commentRef.current){
                commentRef.current.value = "";
                setComment({value: "", error: err});
            }
        });
        if(commentRef.current){
            commentRef.current.value = "";
            setComment({value: "", error: ""});
        }
    }

    return (
        <div style={{width: "100%"}}>
            <div>
                <form style={{width: "100%"}} onSubmit={handleComment}>
                    <TextField
                        inputRef={commentRef}
                        multiline={true}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="comment"
                        label={isLoggedIn?"Comment":"Log in or sign up to comment!"}
                        name="comment"
                        disabled={!isLoggedIn}
                        autoComplete="off"
                        onChange={onChangeComment}
                        error={comment.error.length > 0}
                        helperText={comment.error}
                    />
                    <Button size="small" hidden={true} disabled={true}>
                    </Button>
                    {isLoggedIn &&
                    <Button size="small" type="submit" style={{float: "right", background: "#AC3B61", color: "#EEE2DC"}}>
                        Post
                    </Button>}

                </form>
            </div>
            <Paper style={{ padding: "0px 20px", background: "#fef0e7", marginTop: "10px" }}>
            {loaded && comments.length>0 && comments.map((comment) => (
                    <div key={comment.id}>
                        <CommentItem comment={comment}/>
                        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
                    </div>
            ))}
            </Paper>
            {!allLoaded &&
            <Button fullWidth variant="contained" style={{background: "#AC3B61", color: "#EEE2DC"}} onClick={getAllComments}>
                Load More
            </Button>
            }
        </div>
    );
}

export default withRouter(ImageCommentsList);