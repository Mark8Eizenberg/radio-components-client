import apiUrl from "./apiSettings";

export async function signIn(username, password){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "userName": username,
        "password": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("api/users/login", requestOptions)
        .then(responce => { return responce.json(); })
        .then(data => {
            if (data.token != null) {
                localStorage.setItem('token', data.token ?? null);
                localStorage.setItem('userRole', data.role.id);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userFullName', data.userFullName);
                localStorage.setItem('validTo', data.validTo);
                return {isOk: true};
            } else {
                return {isOk: false, error: data};
            }

        })
        .catch(error => {
            return {isOk: false, error: error}
        });
}