module.exports = {
    transformSchema: (document, returnedObj) => {
        returnedObj.id = returnedObj._id;
        delete returnedObj._id;
        delete returnedObj.__v;
    }
}
