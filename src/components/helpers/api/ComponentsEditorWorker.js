export const Components = {
    resistor: 'resistor',
    capacitor: "capacitor",
    chip: "chip",
    diode: "diode",
    optocouple: "optocouple",
    quartz: "quartz",
    stabilizer: "stabilizer",
    transistor: "transistor",
    zenerDiode: "zenerDiode",
    other: "other"
}

export async function addComponent(component, componentBody, token, errorFunc, okFunc){
    
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

    let result = await fetch(`/api/storage/${Components[component]}/add`, requestOptions);
    
    if(result.ok){
        var data = await result.json();
        okFunc(data);
    } else {
        var error = await result.json();
        errorFunc(error);
        return false;
    }

    return true;
}

export async function removeComponent(component, id, token, errorFunc, okFunc){
    
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

    let result = await fetch(`/api/storage/${Components[component]}/delete/${id}`, requestOptions);
    
    if(!result.ok){
        var error = await result.json();
        errorFunc(error);
        return false;
    }

    okFunc();
    return true;
}

export async function showAllComponent(component, token, errorFunc, okFunc){
    
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
    
    let result = await fetch(`/api/storage/${Components[component]}/all`, requestOptions);
    
    if(result.ok){
        var data = await result.json();
        okFunc(data);
    } else {
        var error = await result.json();
        errorFunc(error);
        return false;
    }

    return true;
}

export async function showAllActiveComponent(component, token, errorFunc, okFunc){
    
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

    let result = await fetch(`/api/storage/${Components[component]}/active`, requestOptions);
    
    if(result.ok){
        var data = await result.json();
        okFunc(data);
    } else {
        var error = await result.json();
        errorFunc(error);
        return false;
    }

    return true;
}

export async function editComponentInfo(token, component){
    var componentPath = null;

    if(component.resistance){
        componentPath = 'resistor';
    } else if(component.capacity){
        componentPath = 'capacitor';
    } else if(component.frequency){
        componentPath = 'quartz';
    } else if(component.chipTypeId){
        componentPath = 'chip';
    } else if(component.transistorTypeId){
        componentPath = 'transistor';
    } else {
        componentPath = 'other';
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify(component);
    
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    
    var response = await fetch(`/api/storage/${componentPath}/Edit`, requestOptions);

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
        component: result
    }
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

export async function addComponentToStorage(token, id, count){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "componentId": id,
    "count": count
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let responce = await fetch("/api/storage/add", requestOptions);
    if(responce.ok){
        return true;
    } else {
        return false;
    }
}

export async function takeComponentFromStorage(token, id, count){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "componentId": id,
    "count": count
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let responce = await fetch("/api/storage/remove", requestOptions);
    if(responce.ok){
        return true;
    } else {
        return false;
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

export function HzToReadeble(om){
    if(om / 1000 < 1){
        return `${om} Hz`;
    } else if(om / 1000000 < 1){
        return `${om / 1000} kHz`; 
    } else {
        return `${om / 1000000 } MHz`
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