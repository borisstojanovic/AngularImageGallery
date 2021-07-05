import React, {useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {getAllCommentsPaginated} from "../actions/comments";
import {withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';

const ImageCommentsList = (props) => {
    const {comments, allLoaded, size} = useSelector((state) => state.comments);

    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const getAllComments = () => {
        setPage(page+1);
    }

    useEffect(() => {
        if(props.imageId){
            dispatch(getAllCommentsPaginated(props.imageId, page, size));
        }
    }, [dispatch, page, props.imageId]);

    return (
        <div>
            {comments.length>0 && comments.map((comment) => (
                <div key={comment.id}>
                    {comment.content}
                </div>
            ))}
            {!allLoaded &&
            <Button variant="contained" color="secondary" onClick={getAllComments}>
                Load More
            </Button>
            }
        </div>
    );
}

export default withRouter(ImageCommentsList);