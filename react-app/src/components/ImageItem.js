import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useSelector} from "react-redux";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';


const ImageItem = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    image={props.image.path}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.image.user.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">{props.image.description}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{justifyContent: "center"}}>
                {currentUser && props.image.user.id === currentUser.id &&
                    <Button size="small" color="primary">
                        <EditIcon/>
                    </Button>
                }
                {currentUser && props.image.user.id === currentUser.id &&
                    <Button size="small" color="primary">
                        <DeleteIcon/>
                    </Button>
                }
                <Button size="small" color="primary">
                    <InfoIcon/>
                </Button>
            </CardActions>
        </Card>
    );
}

export default ImageItem;