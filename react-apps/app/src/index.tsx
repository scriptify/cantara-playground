import React from 'react';
import ReactDOM from 'react-dom';

import App from '~/components/App';
import { setupAppMonitoring } from './util/monitoring';

setupAppMonitoring();

ReactDOM.render(<App />, document.querySelector('#app'));
