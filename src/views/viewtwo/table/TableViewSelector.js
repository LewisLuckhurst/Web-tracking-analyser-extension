import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        backgroundColor: 'black',
        color: 'white',
    },
});

export default function NavigationBarTest(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props.view);
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        sleep(300).then(() => {
            props.changeView(newValue);
        });
    };

    return (
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
            >
                <Tab label="All Sites" />
                <Tab label="Only Tracked Sites"/>
                <Tab label="Only Trackers"/>
            </Tabs>
        </Paper>
    );
}