import apiUrl from "./apiSettings";

export const Components = {
    resistor: 'resistor',
    capacitor: "capacitor",
    chip: "chip",
    diode: "diode",
    optocouple: "optocouple",
    quartz: "quartz",
    stabilizer: "stabilizer",
    tranzistor: "tranzistor",
    zenerDiode: "zenerDiode",
}

export function addComponent(component, componentBody, token, errorFunc, okFunc){
    
    if(Components[component] == null){
        errorFunc({
            message: `Component ${component} does not exixts`
        })
        return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(componentBody);

    var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`/api/storage/${Components[component]}/add`, requestOptions)
    .then(response => {
        if(response.ok) return response.json(); 
        errorFunc(response.json());
        throw response.statusText;        
    })
    .then(result => {
        okFunc(result);
    })
    .catch(error => console.error('error', error));

    return true;
}

export function removeComponent(component, id, token, errorFunc, okFunc){
    
    if(Components[component] == null){
        errorFunc({
            message: `Component ${component} does not exixts`
        })
        return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`/api/storage/${Components[component]}/delete/${id}`, requestOptions)
    .then(response => {
        if(response.ok) return true;
        errorFunc(response.json());
    })
    .then(result => {
        okFunc(result);
    })
    .catch(error => console.log('error', error));

    return true;
}

export function showAllComponent(component, token, errorFunc, okFunc){
    
    if(Components[component] == null){
        errorFunc({
            message: `Component ${component} does not exixts`
        })
        return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`/api/storage/${Components[component]}/all`, requestOptions)
    .then(response => {
        if(response.ok) return response.json();
        errorFunc(response.json());
    })
    .then(result => {
        okFunc(result);
    })
    .catch(error => console.log('error', error));

    return true;
}

export function showAllActiveComponent(component, token, errorFunc, okFunc){
    
    if(Components[component] == null){
        errorFunc({
            message: `Component ${component} does not exixts`
        })
        return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`/api/storage/${Components[component]}/active`, requestOptions)
    .then(response => {
        if(response.ok) return response.json();
        errorFunc(response.json());
    })
    .then(result => {
        okFunc(result);
    })
    .catch(error => console.log('error', error));

    return true;
}


export async function getComponentInfo(id, token){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    redirect: 'follow'
    };
    
    var response = await fetch(`/api/storage/info/${id}`, requestOptions);
    if(!response.ok){
        try{
            var error = await response.json();
            return {
                isOk: false,
                error: error.message,
            };
        }
        catch{
            return {
                isOk: false,
                error: null,
            };
        }
    }
    
    var result = await response.json();
    
    return {
        isOk: true,
        data: result,
    }
}

export function OmToReadeble(om){
    if(om / 1000 < 1){
        return `${om} Om`;
    } else if(om / 1000000 < 1){
        return `${om / 1000} kOm`; 
    } else {
        return `${om / 1000000 } MOm`
    }
}

export function microFaradToReadeble(mF){
    if(mF > 1){
        if(mF / 1000 < 1){
            return `${mF} µF` 
        } else if(mF / 1000000 < 1){
            return `${mF/1000} mF`
        } else {
            return `${mF / 1000000} F`
        }
    } else {
        if(mF * 1000 < 1){
            return `${mF * 1000000} pF`
        }
        return `${mF * 1000} nF`
    }
}