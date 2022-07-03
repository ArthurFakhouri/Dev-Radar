const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');
const Dev = require('../models/Dev');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray);

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        } else {
            dev = { error: 'This user is already registered!' };
        }

        return res.json(dev);
    },

    async update(req, res) {
        const { github_username, name, avatar_url, bio, latitude, longitude, techs } = req.query;

        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };

        await Dev.updateOne({ github_username }, { name, avatar_url, bio, location, techs: techsArray }).then(() => res.json({ 'callback': 'Updated with success!' }))
            .catch(error => res.json({ 'callback': error }));
    },

    async destroy(req, res) {
        const { github_username } = req.query;

        const dev = await Dev.findOne({github_username});

        const [longitude, latitude] = dev.location.coordinates;
        const techsArray = dev.techs;

        await Dev.deleteOne({ github_username }).then(() => {
            const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray);

            sendMessage(sendSocketMessageTo, 'removed-dev', github_username);
            res.json({ callback: `${github_username} was deleted with success!` })
        }).catch(error => { res.json({ callback: error }) });
    }
}