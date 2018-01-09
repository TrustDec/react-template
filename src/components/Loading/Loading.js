import React, {Component} from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const style = {
    container: {
        position: 'relative',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
};
export default class Loading extends Component {
    render() {
        return (
            <div style={style.container}>
                <MuiThemeProvider>
                    <RefreshIndicator
                        size={50}
                        left={(window.innerWidth / 2) - (50/2)}
                        top={window.innerHeight / 2 - (50*2)}
                        loadingColor="#188eee"
                        status="loading"
                        style={style.refresh}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}