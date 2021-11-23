module.exports = {
    transformSchema: (document, returnedObj) => {
        returnedObj.id = returnedObj._id;
        delete returnedObj._id;
        delete returnedObj.__v;
    },
    getPaginateOptions: (opts) => {
        return {
            page: opts?.page || 1,
            limit: opts?.limit || 20,
            customLabels:  {
                totalDocs: 'totalCount',
                docs: 'data',
                limit: 'limit',
                page: 'page',
                nextPage: 'next',
                prevPage: 'prev',
                totalPages: 'pageCount',
                pagingCounter: 'slNo',
                meta: 'paginator'
            }
        };
    }
};
