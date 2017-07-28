"use strict";

import axios from "axios";
import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import {composeWithDevTools, devToolsEnhancer} from "redux-devtools-extension";
import {createLogger} from "redux-logger";
import thunk from "redux-thunk";

import promise, {PENDING, FULFILLED, REJECTED} from "redux-promise-middleware";
const PROMISE = (action) => (action + "_" + PENDING);
const REJECT = (action) => (action + "_" + REJECTED);
const RESOLVE = (action) => (action + "_" + FULFILLED);

const Menu = {
    state : { //
        // drawer: false, // open drawer
        loading : 0, // loading count
        error: false, // loading error
        items : [] // mcdonalds menu items
    },

    GET_MENU : "GET_MENU",
    // TOGGLE_DRAWER : "TOGGLE_DRAWER",

    reducer : {
        menu : (menu=Menu.state, {type, payload} /* {...action} */) => {
            switch (type) {
            case PROMISE(Menu.GET_MENU):
                return {...menu, loading : menu.loading + 1};
            case REJECT(Menu.GET_MENU):
                return {...menu, loading : menu.loading - 1, error: payload};
            case RESOLVE(Menu.GET_MENU):
                return {...menu, loading: menu.loading - 1, error: false, items: [...menu.items, ...payload]};
            // case Menu.TOGGLE_DRAWER:
                // return {...menu, drawer : !menu.drawer};
            default:
                return menu;
            }
        }
    },

    action : {
        /*
        toggle_drawer : () => {
            const type = Menu.TOGGLE_DRAWER;
            const payload = null;
            return {type, payload};
        },
        */
        get_few_menu : () => {
            const type = Menu.GET_MENU;
            const payload = request_few_menu();
            return {type, payload};
        },
        get_one_menu : (id) => {
            const type = Menu.GET_MENU;
            const payload = request_one_menu(id);
            return {type, payload};
        }
    }
};

class Data {
    static state = {
        menu : Menu.reducer.menu
    }

    constructor() {
        this.dispatch(Menu.action.get_few_menu());
    }

    get store () { // retrieve/create store
        return this.__store_getter || (this.__store_getter = create_store());

        function create_store() {
            const all_reducers = combineReducers(Data.state);
            const all_middlewares = composeWithDevTools(
                applyMiddleware(createLogger(), thunk, promise())
            );
            return createStore(all_reducers, all_middlewares);
        }
    };

    dispatch = (...args) => { return this.store.dispatch(...args); };
}

function request_one_menu(id) {
    const url = `/mcdonalds/${id}?select=*`;
    return axios.get(url).then((response)=> {
        return response.data.rows;
    }).catch((err) => {
        throw new Error(err);
    });
}

function request_few_menu() {
    const url = '/mcdonalds?limit=*&select=*';
    return axios.get(url).then((response)=> {
        return response.data.rows;
    }).catch((err) => {
        throw new Error(err);
    });
}

module.exports = {
    Data, Menu
};
