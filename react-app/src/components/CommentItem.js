import React, {useRef, useState} from "react";
import ReplyIcon from '@material-ui/icons/Reply';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Avatar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import {useDispatch} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {addNestedComment} from "../actions/comments";


const useStyles = makeStyles((theme) => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
}));

const CommentItem = (props) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const commentRef = useRef();

    const [expanded, setExpanded] = useState(false);
    const [replyExpanded, setReplyExpanded] = useState(false);
    const [comment, setComment] = useState({value: "", error: ""});

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleReplyExpandClick = () => {
        setReplyExpanded(!replyExpanded);
    };

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
        dispatch(addNestedComment(props.comment.image_id, comment.value, props.comment.id)).catch(err=> {
            if(commentRef.current){
                commentRef.current.value = "";
                setComment({value: "", error: ""});
            }
        });
        if(commentRef.current){
            setExpanded(true);
            commentRef.current.value = "";
            setComment({value: "", error: ""});
        }
    }

    //returns string time + years/months/days/minutes/seconds
    const timeSince = (time) => {
        let date = new Date(time);
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            let floor = Math.floor(interval);
            return floor!==1?floor + " years":floor + " year";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            let floor = Math.floor(interval);
            return floor!==1?floor + " months":floor + " month";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            let floor = Math.floor(interval);
            return floor!==1?floor + " days":floor + " day";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            let floor = Math.floor(interval);
            return floor!==1?floor + " hours":floor + " hour";
        }
        interval = seconds / 60;
        if (interval > 1) {
            let floor = Math.floor(interval);
            return floor!==1?floor + " minutes":floor + " minute";
        }
        let floor = Math.floor(interval);
        return floor!==1?floor + " seconds":floor + " second";
    }

    const showParentReply = () => {
        return (
            <div>
                <IconButton
                    onClick={handleReplyExpandClick}
                    aria-expanded={replyExpanded}
                    aria-label="reply"
                >
                    {replyExpanded && <ReplyIcon style={{color: "#AC3B61"}}/>}
                    {!replyExpanded && <ReplyIcon/>}
                    {!replyExpanded && <Typography variant={"button"}>Reply</Typography>}
                    {replyExpanded && <Typography variant={"button"} style={{color: "#AC3B61"}}>Cancel</Typography>}
                </IconButton>
                <Collapse in={replyExpanded} timeout="auto" unmountOnExit>
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
                </Collapse>
            </div>
        )
    }

    const showChildrenExpand = () => {
        return(
            <div>
                <div>
                    <IconButton
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        {!expanded && <ExpandMoreIcon className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}/>}
                        {expanded && <ExpandMoreIcon style={{color: "#AC3B61"}} className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}/>}
                        {!expanded && <Typography variant={"button"}>View Replies</Typography>}
                        {expanded && <Typography variant={"button"} style={{color: "#AC3B61"}}>Close Replies</Typography>}
                    </IconButton>
                </div>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Paper style={{ padding: "20px 10px", background: "#fbf0e9", marginTop: "10px" }}>
                        {props.comment.children.map((comment) => (
                            <div key={comment.id}>
                                <CommentItem comment={comment}/>
                                <Divider variant="fullWidth" style={{ margin: "20px 0" }} />
                            </div>
                        ))}
                    </Paper>
                </Collapse>
            </div>
        )
    }

    return (
        <Grid container wrap="nowrap" spacing={1}>
            <Grid item>
                <Avatar className={classes.medium} alt="User" src={props.comment.path} />
            </Grid>
            <Grid item xs zeroMinWidth={true}>
                <Typography variant={"body2"} component={"p"} style={{ fontWeight: "bold", margin: 0, textAlign: "left", wordWrap: "break-word" }}>
                    {props.comment.username}
                </Typography>
                <Typography variant={"body1"} component={"p"} style={{ marginTop: "5px", textAlign: "left", wordWrap: "break-word" }}>
                    {props.comment.content}
                </Typography>
                <p style={{ wordWrap: "break-word", textAlign: "left", color: "gray" }}>
                    {timeSince(props.comment.date_created)} ago
                </p>
                <Grid item>
                    {(props.comment.comment_id === null || !props.comment.comment_id) && showParentReply()}
                    {props.comment.children && props.comment.children.length>0 && showChildrenExpand()}
                </Grid>
            </Grid>

        </Grid>
    );
}

export default CommentItem;