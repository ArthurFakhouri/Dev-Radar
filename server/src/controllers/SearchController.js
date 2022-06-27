const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res){
        // Search 4 users within a 10km radius
        // Possibility to techs filter
        const {latitude, longitude, techs} = req.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, //this line is readed like meters and not kilometers so we wanna find users within 10km radius so we need 10000 meters
                },
            }
        });

        return res.json({dev: devs});
    }
}