window.addEventListener('load', () => {
    import('./App').then(({ default: loadApp }) => {
        loadApp();
    });
});
