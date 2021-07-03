import React, {useEffect} from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import {getAllPaginated} from '../../actions/images'
import Masonry from "react-masonry-css"
import ImageItem from "../ImageItem"

const ImagesList = () => {

    const { user: currentUser } = useSelector((state) => state.auth);
    const { images: images, page: page, size: size } = useSelector((state) => state.images);

    const dispatch = useDispatch();

    const getAllImages = () => {
        dispatch(getAllPaginated(page, size));
    }

    useEffect(() => {
        dispatch(getAllPaginated(page, size));
    }, [dispatch]);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div>
            <InfiniteScroll
                dataLength={images.length} //This is important field to render the next data
                next={getAllImages}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
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
            </InfiniteScroll>

        </div>
    );
}

export default ImagesList;