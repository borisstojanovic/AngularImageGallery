import React, {useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    changeSort,
    getAllByTitle,
    getAllForUser,
    getAllPaginatedSort,
} from '../../actions/images'
import Masonry from "react-masonry-css"
import ImageItem from "../ImageItem"
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormHelperText from "@material-ui/core/FormHelperText";
import queryString from 'query-string'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ImagesList = (props) => {
    const {images, allLoaded, sort} = useSelector((state) => state.images);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loaded, setLoaded] = useState(false);
    const size = 20;
    const dispatch = useDispatch();

    const getAllImages = () => {
        setPage(page+1);
    }

    useEffect(() => {
        let values = queryString.parse(props.location.search);
        if(!values.input || values.input.length === 0) {
            setSearch("");
        }else{
            setSearch(values.input);
        }
        setPage(1);
        setLoaded(true);
    }, [props.location.search])

    useEffect(() => {
        if(!loaded){
            return;
        }
        if(search.length === 0){
            dispatch(getAllPaginatedSort(page, size, sort));
        }else {
            if (search.startsWith("@")) {
                dispatch(getAllForUser(search.substring(1), page, size, sort));
            } else {
                dispatch(getAllByTitle(search, page, size, sort));
            }
        }
    }, [dispatch, sort, page, search, loaded]);

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
        setPage(1);
        dispatch(changeSort(value));
    };

    return (
        <div>
            <FormControl>
                <NativeSelect
                    value={sort}
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