import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {addComment, getAllCommentsPaginated} from "../actions/comments";
import {withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

const ImageCommentsList = (props) => {
    const {comments, allLoaded, size} = useSelector((state) => state.comments);

    const commentRef = useRef(null);

    const [startId, setStartId] = useState(0);
    const [comment, setComment] = useState({value:"", error:""});
    const dispatch = useDispatch();

    const getAllComments = () => {
        if(comments.length === 0){
            setStartId(0);
        }else{
            setStartId(comments[comments.length-1].id);
        }
    }

    useEffect(() => {
        dispatch(getAllCommentsPaginated(props.imageId, startId, size));
    }, [dispatch, startId, props.imageId]);

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
                setComment({value: "", error: ""});
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
                        label="Comment"
                        name="comment"
                        autoComplete="off"
                        onChange={onChangeComment}
                        error={comment.error.length > 0}
                        helperText={comment.error}
                    />
                    <Button size="small" hidden={true} disabled={true}>
                    </Button>
                    <Button size="small" type="submit" style={{float: "right", background: "#AC3B61", color: "#EEE2DC"}}>
                        Post
                    </Button>
                </form>
            </div>

            {comments.length>0 && comments.map((comment) => (
                <div key={comment.id}>
                    {comment.content}
                </div>
            ))}
            {!allLoaded &&
            <Button fullWidth variant="contained" style={{background: "#AC3B61", color: "#EEE2DC"}} onClick={getAllComments}>
                Load More
            </Button>
            }
        </div>
    );
}

export default withRouter(ImageCommentsList);