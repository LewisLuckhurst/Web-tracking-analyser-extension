import React, {Component} from 'react';
import "./SearchBoxResult.css";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class SearchBoxResult extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="box">
                <div className="text">
                    <p>{this.props.companyName}</p>
                </div>
                <div>
                    <IconButton aria-label="delete">
                        <DeleteIcon onClick={() => this.props.removeSearch(this.props.companyName)}/>
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default SearchBoxResult;