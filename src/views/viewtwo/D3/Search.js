import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import "./D3ForceGraphCss.css";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        width: "95%",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    iconButton: {
        padding: 10
    },
}));

export default function SearchBar(props) {
    const classes = useStyles();
    return (
        <div className="searchBar">
            <Paper className={classes.root}>
                <InputBase
                    className={classes.input}
                    onChange={props.updateText}
                    placeholder="Search"
                    inputProps={{"aria-label": "search force graph"}}
                />
                <IconButton
                    onClick={props.highLightNode}
                    className={classes.iconButton}
                    aria-label="search"
                >
                    <SearchIcon/>
                </IconButton>
            </Paper>
        </div>
    );
}
