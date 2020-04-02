import jwt_decode from 'jwt-decode';

function checkSession() {

    const token = sessionStorage.getItem("token");
    const sessionEmail = sessionStorage.getItem("loggedEmail");

    if (token) {
        const decode = jwt_decode(token);
        return sessionEmail === decode.email;
    }

    return false;
}

function getCredentials(){

    const token = sessionStorage.getItem("token");

    if(token){
        const decode = jwt_decode(token);
        console.log(decode);
        return {
            email: decode.email,
            uid: decode.userId,
            role: decode.role,
            username: decode.username
        };
    }

    return null;
}

export { checkSession, getCredentials };