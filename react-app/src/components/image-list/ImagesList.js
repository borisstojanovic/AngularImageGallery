import React, {useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    getAllByTitle, getAllForUser,
    getAllPaginatedSort,
} from '../../actions/images'
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
    const { images: images, allLoaded: allLoaded, sort: sortType, search: search} = useSelector((state) => state.images);
    const [state, setState] = useState({sort: "newest", page: 1});
    const size = 20;
    const dispatch = useDispatch();

    const getAllImages = () => {
        let pageNum = state.page;
        if(state.sort !== sortType){
            setState({sort: state.sort, page: 1});
            pageNum = 1;
        }
        setState({sort: state.sort, page: pageNum + 1})
        if(search.length > 0)
            dispatch(getAllByTitle(search, pageNum+1, size, state.sort));
        else
            dispatch(getAllPaginatedSort(pageNum+1, size, state.sort));

    }

    useEffect(() => {
        dispatch(getAllPaginatedSort(state.page, size, state.sort));
    }, [dispatch]);

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        800: 3,
        700: 2,
        450: 1
    };

    const classes = useStyles();

    const handleChange = (event) => {
        const value = event.target.value;
        setState({sort: value, page: 1});
        if(search.length !== 0){
            if(search.startsWith('@')){
                dispatch(getAllForUser(search, 1, size, value));
            }else{
                dispatch(getAllByTitle(search, 1, size, value));
            }
        }else{
            dispatch(getAllPaginatedSort(1, size, value));
        }
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