import React, {useEffect} from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux";
import {Image} from 'cloudinary-react';
import {getAll} from '../../actions/images'
import { makeStyles } from '@material-ui/core/styles';
import Masonry from "react-masonry-css"
import ImageItem from "../ImageItem"

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

const ImagesList = () => {
    const classes = useStyles();

    const { user: currentUser } = useSelector((state) => state.auth);
    const { images: images } = useSelector((state) => state.images);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAll());
    }, [dispatch]);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {images.map((image) => (
                    <div key={image.id}>
                        <ImageItem image={image}/>
                    </div>

                ))}
            </Masonry>
        </div>
    );
}

export default ImagesList;