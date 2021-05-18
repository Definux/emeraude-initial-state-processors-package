const { newGuid } = require('../utils/functions');

const initialState = {
    state: {
        routeName: null,
        stateString: null,
        user: null,
        languageCode: null,
        languageId: 0,
        viewModel: null,
        viewData: [],
        metaTags: null
    },

    getters: {
        routeName(state) {
            return state.routeName;
        },
        stateString(state) {
            return state.stateString;
        },
        user(state) {
            return state.user;
        },
        languageCode(state) {
            return state.languageCode;
        },
        languageId(state) {
            return state.languageId;
        },
        viewModel(state) {
            return state.viewModel;
        },
        viewData(state) {
            return state.viewData;
        },
        metaTags(state) {
            return state.metaTags;
        }
    },

    mutations: {
        SET_STATE_STRING(state, value) {
            state.stateString = value;
        },
        SET_VIEW_MODEL(state, value) {
            state.viewModel = value;
        },
        SET_VIEW_DATA(state, value) {
            state.viewData = value;
        },
        SET_META_TAGS(state, value) {
            state.metaTags = value;
        }
    },

    actions: {
        mapInitialState({ state, commit, rootState }) {
            state.routeName = rootState.data.routeName;
            state.stateString = rootState.data.stateString;
            state.user = rootState.data.user;
            state.languageCode = rootState.data.languageCode;
            state.languageId = rootState.data.languageId;
            state.viewModel = rootState.data.viewModel;
            state.viewData = rootState.data.viewData;
            state.metaTags = rootState.data.metaTags;
        },
        updateStateString(context, value) {
            context.commit('SET_STATE_STRING', value);
        },
        updateViewData(context, value) {
            context.commit('SET_VIEW_DATA', value);
        },
        updateViewModel(context, value) {
            context.commit('SET_VIEW_MODEL', value);
        },
        updateMetaTags(context, value) {
            context.commit('SET_META_TAGS', value);
            try {
                for(let key in value) {
                    if (value[key] !== null && value[key].key !== undefined) {
                        let existingMetaTag = document.querySelector('meta[' + value[key].keyName + '="' + value[key].key + '"]');
                        if (existingMetaTag !== null && value[key].value !== null) {
                            existingMetaTag.setAttribute(value[key].valueName, value[key].value);
                        }
                    }
                }

                document.title = value.title.value;
                let canonicalTag = document.querySelector('link[rel="canonical"]');
                if (canonicalTag !== null) {
                    canonicalTag.setAttribute('href', value.canonical);
                }
            }
            catch (e) {
            }
        },
        resetStateString(context) {
            context.commit('SET_STATE_STRING', newGuid());
        },
    }
};

module.exports = {
    created() {
        this.$store.registerModule('main', initialState);
        this.$store.dispatch('mapInitialState');
        this.$i18n.locale = this.$store.getters.languageCode;
    }
};

