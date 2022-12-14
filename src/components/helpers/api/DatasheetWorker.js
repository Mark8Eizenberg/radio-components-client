export async function addDatasheet(token, file){
    var formData = new FormData();
    formData.append('file', file, file.name);
        
    var addFileHeaders = new Headers();
    addFileHeaders.append("Authorization", "Bearer " + token);
        
    var addFileRequestOption = {
        method: 'POST',
        headers: addFileHeaders,
        body: formData,
        redirect: 'follow'
    }

    try {
        let resultForAddingFile = await fetch(`/api/files/upload`, addFileRequestOption);
        if(!resultForAddingFile.ok){
            var error = await resultForAddingFile.json();
            return {
                isOk : false,
                error : error,
            };
        } else {
            var responce = await resultForAddingFile.json();
            return{
                isOk : true,
                fileId : responce?.fileId
            };
        }
    } catch (error) {
        return {
            isOk : false,
            error : error,
        };
    }    
}

export async function deleteDatasheetById(token, fileId){
   
    var addFileHeaders = new Headers();
    addFileHeaders.append("Authorization", "Bearer " + token);
        
    var requestOption = {
        method: 'DELETE',
        headers: addFileHeaders,
        redirect: 'follow'
    }

    try {
        let result = await fetch(`/api/files/delete/` + fileId, requestOption);
        if(!result.ok){
            var error = await result.json();
            return {
                isOk : false,
                error : error,
            };
        } else {
            return{
                isOk : true,
            };
        }
    } catch (error) {
        return {
            isOk : false,
            error : error,
        };
    }
    
}

export async function setDatasheetToComponent(token, fileId, compoonentId){
    var requestHeaders = new Headers();
    requestHeaders.append("Authorization", "Bearer " + token);
        
    var requestOption = {
        method: 'POST',
        headers: requestHeaders,
        redirect: 'follow'
    }

    try {
        let result = await fetch(`/api/files/SetFileToComponent?fileId=${fileId}&componentId=${compoonentId}`, requestOption);
        if(!result.ok){
            var error = await result.json();
            return {
                isOk : false,
                error : error,
            };
        } else {
            var responce = await result.json();
            return{
                isOk : true,
                fileId : responce?.fileId,
                componentId : responce?.componentId
            };
        }
    } catch (error) {
        return {
            isOk : false,
            error : error,
        };
    } 
}

export async function unSetDatasheetFromComponent(token, fileId, compoonentId){
    var requestHeaders = new Headers();
    requestHeaders.append("Authorization", "Bearer " + token);
        
    var requestOption = {
        method: 'POST',
        headers: requestHeaders,
        redirect: 'follow'
    }

    try {
        let result = await fetch(`/api/files/UnSetFileToComponent?fileId=${fileId}&componentId=${compoonentId}`, requestOption);
        if(!result.ok){
            var error = await result.json();
            return {
                isOk : false,
                error : error,
            };
        } else {
            var responce = await result.json();
            return{
                isOk : true,
                fileId : responce?.fileId,
                componentId : responce?.componentId
            };
        }
    } catch (error) {
        return {
            isOk : false,
            error : error,
        };
    } 
}

export async function downloadDatasheetById(token, fileId){
    var requestHeaders = new Headers();
    requestHeaders.append("Authorization", "Bearer " + token);
        
    var requestOption = {
        method: 'GET',
        headers: requestHeaders,
        redirect: 'follow'
    }

    try {
        let result = await fetch(`/api/files/download/${fileId}`, requestOption);
        if(!result.ok){
            var error = await result.json();
            return {
                isOk : false,
                error : error,
            };
        } else {
            var blob = await result.blob();
            return{
                isOk : true,
                data: blob
            };
        }
    } catch (error) {
        return {
            isOk : false,
            error : error,
        };
    } 
}