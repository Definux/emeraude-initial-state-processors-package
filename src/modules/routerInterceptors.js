const redirectToLogin = function(redirectUrl) {
    location.href = '/login?ReturnUrl=' + encodeURIComponent(redirectUrl);
};

const notFoundResult = function() {
    location.href = '/404';
};

const defaultPostHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

module.exports = function (router, store, options = null) {
    router.beforeEach((routeTo, routeFrom, next) => {
        if (typeof(fetch) !== undefined) {
            if (store.getters.stateString !== undefined) {
                let initialStateRequestUrl = new URL(routeTo.path, window.location.origin);
                if (routeTo.query !== null && Object.keys(routeTo.query).length > 0) {
                    initialStateRequestUrl.search = new URLSearchParams(routeTo.query).toString();
                }

                fetch(initialStateRequestUrl.toString(), {
                    method: 'POST',
                    headers: defaultPostHeaders,
                    body: null,
                    credentials: 'include'
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                    })
                    .then(responseData => {
                        if (responseData === undefined) {
                            notFoundResult();
                        }
                        else {
                            store.dispatch('updateViewData', responseData.viewData);
                            store.dispatch('updateViewModel', responseData.viewModel);

                            if (options === null || (options.disableMetaTags === undefined || options.disableMetaTags === false)) {
                                store.dispatch('updateMetaTags', responseData.metaTags);
                            }

                            next();
                        }
                    })
                    .catch(() => {
                        redirectToLogin(routeTo.path);
                    });
            }
            else {
                next();
            }
        }
        else {
            // eslint-disable-next-line no-undef
            if (process.env.VUE_ENV === 'server') {
                next();
            }
            else {
                redirectToLogin('/');
            }
        }
    });
};
