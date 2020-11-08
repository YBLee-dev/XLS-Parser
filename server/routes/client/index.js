module.exports = (router) => {
    router.get('/', function (req, res, params = {}) {
        res.render('app', {
            title: params.title || 'XLS Parser'
        });
    });
};
