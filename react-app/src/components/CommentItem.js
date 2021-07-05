import React from "react";

const CommentItem = (props) => {

    return (
        <div>
            {props.comment.content}
        </div>
    );
}

export default CommentItem;