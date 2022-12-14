export class ChipTypeWorker{
    static #chipTypes = [];
    static #chipTypesMap = new Map();

    static getChipTypes(){
        return this.#chipTypes;
    }

    static getChipTypeById(id){
        return this.#chipTypesMap.get(id);
    }

    static async updateChipTypes(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let responce = await fetch("/api/storage/chiptype", requestOptions);

        if(responce.ok){
            let data = await responce.json();
            this.#chipTypes = data;
            data.map(item => 
                this.#chipTypesMap.set(item.id, item.name)
            )
        } else {
            let error = await responce.json();
            console.error(error);
        }
    }

    static async addNewChipType(token, name, errorFunc){
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

        let responce = await fetch("/api/storage/chiptype", requestOptions);

        if(responce.ok){
            await this.updateChipTypes(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }

    static async removeChipType(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        let responce = await fetch("/api/storage/chiptype/" + id, requestOptions);

        if(responce.ok){
            await this.updateChipTypes(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
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

    static async updateTransistorTypes(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let responce = await fetch("/api/storage/transistortype", requestOptions);
        
        if(responce.ok){
            let data = await responce.json();
            this.#transistorTypes = data;
            data.map(item => 
                this.#transistorTypesMap.set(item.id, item.name)
            )
        } else {
            let error = await responce.json();
            console.error(error);
        }
    }

    static async addNewTransistorType(token, name, errorFunc){
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

        let responce = await fetch("/api/storage/transistortype", requestOptions)
        if(responce.ok){
            await this.updateTransistorTypes(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }

    static async removeTransistorType(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        let responce = await fetch("/api/storage/transistortype/" + id, requestOptions)

        if(responce.ok){
            await this.updateTransistorTypes(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
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

    static async addNewPackages(token, name, description, errorFunc){
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

        let responce = await fetch("/api/storage/packaging", requestOptions);
        
        if(responce.ok){
            await this.updatePackages(token)
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }

    static async removePackage(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
        
        let responce = await fetch("/api/storage/packaging/" + id, requestOptions);
        
        if(responce.ok){
            await this.updatePackages(token)
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }
} 

export class MaterialWorker{

    static #materials = [];
    static #materialMap = new Map();

    static getMaterials(){
        return this.#materials;
    }

    static getMaterialById(id){
        return this.#materialMap.get(id);
    }

    static async updateMaterials(token){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let responce = await fetch("/api/storage/material", requestOptions);
        
        if(responce.ok){
            let data = await responce.json();
            this.#materials = data;
            data.map(item => 
                this.#materialMap.set(item.id, item.name)
            )
        } else {
            let error = await responce.json();
            console.error(error);
        }
    }

    static async addNewMaterial(token, name, errorFunc){
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

        let responce = await fetch("/api/storage/material", requestOptions)
        if(responce.ok){
            await this.updateMaterials(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }

    static async removeMaterial(token, id, errorFunc){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        let responce = await fetch("/api/storage/material/" + id, requestOptions)

        if(responce.ok){
            await this.updateMaterials(token);
            return true
        } else {
            let error = await responce.json();
            errorFunc(error.message ?? error.error ?? "Unknown error" );
            return false;
        }
    }
}