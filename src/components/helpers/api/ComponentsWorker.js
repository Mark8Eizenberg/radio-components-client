import apiUrl from "./apiSettings";

export class PackagesWorker{
    constructor(props){

    }

    static #packages = [];
    static #packagesMap = new Map();

    static getPackages(){
        return this.#packages;
    }

    static getPackagesById(id){
        return this.#packagesMap.get(id);
    }

    static updatePackages(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("/api/storage/packaging", requestOptions)
        .then(response => response.ok && response.json())
        .then(result => {
            if(result != null){
                this.#packages = result;
                result.map(item => {
                    this.#packagesMap.set(item.id, item.name);
                })
            }
        })
        .catch(error => console.log('error', error));
    }

    static addNewPackages(token, name, description, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token)
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            name: name,
            description: description
        });

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/api/storage/packaging", requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updatePackages(token))
        .catch(error => console.log('error', error));
    }

    static renovePackage(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("/api/storage/packaging/" + id, requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updatePackages(token))
        .catch(error => console.log('error', error));
    }
} 