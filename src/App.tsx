import React, { Fragment } from 'react';
import { createRoot } from 'react-dom/client';

const App = (): JSX.Element => (
    <Fragment>
        <h1 className="title">⚡ Webpack React Boilerplate ⚡</h1>
    </Fragment>
);

export default (): void => {
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(<App />);
};
