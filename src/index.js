import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from "prop-types";
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router} from 'react-router-dom';
import App from 'components/App/App';
import { global } from 'core-js/library/web/timers';
import createHistory from 'history/createBrowserHistory'
/* if (MOCK) {
    require('mock/mock');
} */
const history = createHistory();
renderWithHotReload(App);

if (module.hot) {
    module.hot.accept('components/App/App', () => {
        const NextApp = require('components/App/App').default;
        renderWithHotReload(NextApp);
    });
}
// webpage/schoolbus/_run/index.html
//basename="/wapp/webpage/schoolbus/_run"
// /react-mc
function renderWithHotReload(RootElement) {
    ReactDom.render(
        <AppContainer>
            <Provider store={store}>
                <Router history={history} basename='/wapp/webpage/schoolbus/_run'>
                    <RootElement/>
                </Router>
            </Provider>
        </AppContainer>,
        document.getElementById('app')
    )
}
