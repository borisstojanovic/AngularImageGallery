import React, {useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import {getAllPaginated, getAllPaginatedSortByLikes, getAllPaginatedSortByViews} from '../../actions/images'
import Masonry from "react-masonry-css"
import ImageItem from "../ImageItem"
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ImagesList = () => {
    const { images: images, page: page, size: size, allLoaded: allLoaded, sort: sortType } = useSelector((state) => state.images);

    const dispatch = useDispatch();

    const getAllImages = () => {
        let pageNum = page;
        if(state.sort !== sortType){
            pageNum = 1;
        }
        if(state.sort === "newest"){
            dispatch(getAllPaginated(pageNum, size));
        }else if(state.sort === "views"){
            dispatch(getAllPaginatedSortByViews(pageNum, size));
        }else{
            dispatch(getAllPaginatedSortByLikes(pageNum, size));
        }
    }

    useEffect(() => {
        dispatch(getAllPaginated(page, size));
    }, [dispatch]);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        800: 3,
        700: 2,
        450: 1
    };

    const classes = useStyles();
    const [state, setState] = useState({sort: "Newest"});

    const handleChange = (event) => {
        const value = event.target.value;
        setState({sort: value});
        if(value === "newest")
            dispatch(getAllPaginated(1, size));
        else if(value === "views")
            dispatch(getAllPaginatedSortByViews(1, size));
        else
            dispatch(getAllPaginatedSortByLikes(1, size));
    };

    return (
        <div>
            <FormControl>
                <NativeSelect
                    value={state.sort}
                    onChange={handleChange}
                    name="sort"
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'sort' }}
                >
                    <option value={"newest"}>Sort by newest</option>
                    <option value={"views"}>Sort by views</option>
                    <option value={"likes"}>Sort by likes</option>
                </NativeSelect>
                <FormHelperText>Sort By</FormHelperText>
            </FormControl>
            <InfiniteScroll
                dataLength={images.length}
                next={getAllImages}
                hasMore={!allLoaded}
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