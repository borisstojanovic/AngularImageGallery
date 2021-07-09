import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";


const useStyles = makeStyles((theme) => ({
    toTop: {
        zIndex: 2,
        position: 'fixed',
        bottom: '2vh',
        backgroundColor: '#fff4eb',
        color: 'black',
        "&:hover, &.Mui-focusVisible": {
            transition: '0.3s',
            color: '#397BA6',
            backgroundColor: '#fff4eb',
        },
        right: '5%',
    }
}));

const Scroll = ({showBelow}) => {

    const classes = useStyles();

    const [show, setShow] = useState(!showBelow);

    const handleScroll = useCallback(() => {
        setShow(window.pageYOffset>showBelow);
    }, [showBelow]);

    const handleClick = () => {
        window['scrollTo']({top: 0, behavior: 'smooth'});
    }

    useEffect(() => {
        if(showBelow){
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [showBelow, handleScroll]);

    return (
        <div>
            {show &&
                <IconButton onClick={handleClick} className={classes.toTop}>
                    <ExpandLessIcon/>
                </IconButton>
            }
        </div>
    )
}

export default Scroll;