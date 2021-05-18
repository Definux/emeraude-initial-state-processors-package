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

function getQuerySearchFromQueryObject(query) {
    let result = '';
    if (query !== null && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams();
        const queryKeys = Object.keys(query);
        for (const queryKey of queryKeys) {
            if (Array.isArray(query[queryKey])) {
                for (let i = 0; i < query[queryKey].length; i++) {
                    searchParams.append(queryKey, query[queryKey][i]);
                }
            }
            else {
                searchParams.append(queryKey, query[queryKey]);
            }
        }

        result = searchParams.toString();
    }

    return result;
}

module.exports = function (router, store, options = null) {
    router.beforeEach((routeTo, routeFrom, next) => {
        if (typeof(fetch) !== undefined) {
            if (store.getters.stateString !== undefined) {
                let initialStateRequestUrl = new URL(routeTo.path, window.location.origin);
                initialStateRequestUrl.search = getQuerySearchFromQueryObject(routeTo.query);

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
