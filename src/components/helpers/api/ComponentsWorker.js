export class ChipTypeWorker{
    static #chipTypes = [];
    static #chipTypesMap = new Map();

    static getChipTypes(){
        return this.#chipTypes;
    }

    static getChipTypeById(id){
        return this.#chipTypesMap.get(id);
    }

    static updateChipTypes(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("/api/storage/chiptype", requestOptions)
        .then(response => response.ok && response.json())
        .then(result => {
            if(result != null){
                this.#chipTypes = result;
                result.map(item => 
                    this.#chipTypesMap.set(item.id, item.name)
                )
            }
        })
        .catch(error => console.log('error', error));
    }

    static addNewChipType(token, name, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token)
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            name: name,
        });

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/api/storage/chiptype", requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updateChipTypes(token))
        .catch(error => console.log('error', error));
    }

    static removeChipType(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("/api/storage/chiptype/" + id, requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updateChipTypes(token))
        .catch(error => console.log('error', error));
    }
}

export class TransistorTypeWorker{

    static #transistorTypes = [];
    static #transistorTypesMap = new Map();

    static getTransistorTypes(){
        return this.#transistorTypes;
    }

    static getTransistorTypeById(id){
        return this.#transistorTypesMap.get(id);
    }

    static updateTransistorTypes(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("/api/storage/transistortype", requestOptions)
        .then(response => response.ok && response.json())
        .then(result => {
            if(result != null){
                this.#transistorTypes = result;
                result.map(item => 
                    this.#transistorTypesMap.set(item.id, item.name)
                )
            }
        })
        .catch(error => console.log('error', error));
    }

    static addNewTransistorType(token, name, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token)
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            name: name,
        });

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("/api/storage/transistortype", requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updateTransistorTypes(token))
        .catch(error => console.log('error', error));
    }

    static removeTransistorType(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        fetch("/api/storage/transistortype/" + id, requestOptions)
        .then(response => {
            if(response.ok){
                return true
            } else {
                errorFunc(response.message ?? response.error ?? "Unknown error" );
                return false;
            }})
        .then(result => result && this.updateTransistorTypes(token))
        .catch(error => console.log('error', error));
    }
}

export class PackagesWorker{

    static #packages = [];
    static #packagesMap = new Map();

    static getPackages(){
        return this.#packages;
    }

    static getPackagesById(id){
        return this.#packagesMap.get(id);
    }

    static async updatePackages(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let result = await fetch("/api/storage/packaging", requestOptions)
        if(result.ok){
            let data = await result.json();
            if(data){
                this.#packages = data;
                data.map(item => this.#packagesMap.set(item.id, item.name))
            }

        } else {
            console.error('error', result.error);
            return false;
        }

        return true;
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

    static removePackage(token, id, errorFunc){
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
                errorFunc(response.message ?? response.error ?? "Невідома помилка, перевірте чи використовується цей корпус в базі" );
                return false;
            }})
        .then(result => result && this.updatePackages(token))
        .catch(error => console.log('error', error));
    }
} 