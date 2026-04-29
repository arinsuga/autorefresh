


const handleError = (error: any) => {

    
    switch (error.code) {
        case 400:
            break;
        case 401:
            break;
        case 402:
            break;
        case 403:
            break;
        case 404:
            break;
        case 500:
            break;
        default:
            break;
    }
    
    return error;
};

export default handleError;