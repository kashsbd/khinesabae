const LOCAL_URL = "http://localhost:5000";
const SERVER_URL = "https://api.khinesabaejewellery.com";

//"http://khinesabaejewellery.com:5000";

const BASE_URL = LOCAL_URL;
const USER_LOGIN = BASE_URL + "/users/login";
const USER_SIGNUP = BASE_URL + "/users/signup";
const GET_ALL_USERS = BASE_URL + "/users";
const DELETE_USERS = BASE_URL + "/users/delete";
const UPDATE_USER = BASE_URL + "/users/update";

const CREATE_CATEGORY = BASE_URL + "/categories";
const GET_ALL_CATEGORIES = BASE_URL + "/categories";
const DELETE_CATEGORY = BASE_URL + "/categories/delete";
const UPDATE_CATEGORY = BASE_URL + "/categories/update";

const CREATE_ITEM = BASE_URL + "/items";
const GET_ALL_ITEMS = BASE_URL + "/items";
const DELETE_ITEM = BASE_URL + "/items/delete";
const GET_ITEM_IMAGE = BASE_URL + "/items/media/";
const UPDATE_ITEM = BASE_URL + "/items/update";

const FEATURE_ITEM = BASE_URL + "/items/make_featured";

export {
    USER_LOGIN,
    USER_SIGNUP,
    GET_ALL_USERS,
    DELETE_USERS,
    UPDATE_USER,

    CREATE_CATEGORY,
    GET_ALL_CATEGORIES,
    DELETE_CATEGORY,
    UPDATE_CATEGORY,

    CREATE_ITEM,
    GET_ALL_ITEMS,
    DELETE_ITEM,
    GET_ITEM_IMAGE,
    UPDATE_ITEM,

    FEATURE_ITEM
}
