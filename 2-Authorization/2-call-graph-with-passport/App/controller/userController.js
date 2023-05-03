var { getGraphClient } = require("../uitls/graphClient");
var { ResponseType } = require('@microsoft/microsoft-graph-client');


exports.profile = async (req, res, next) => {
    try {
        const graphResponse = await getGraphClient(req.session.accessToken)
                .api('/me')
                .responseType(ResponseType.RAW)
                .get();
        const graphData = await graphResponse.json();
        res.render('profile', { graphData: graphData });
    } catch (error) {
        next(error)
    }
}