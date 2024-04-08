/**
 * @param {{url: string, param: any, method: string}} config 
 * @returns 
 */

async function Handler(config) {
    const { url, param, method } = config;

    const apiUrl = "http://localhost:3005/" + url;
    const requestOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (param) requestOptions.body = JSON.stringify(param)

    try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


