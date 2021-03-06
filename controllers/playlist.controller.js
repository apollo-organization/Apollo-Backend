const {Playlist, playlistValidation, validatePlaylistEdit} = require('../models/playlist.model')
const {Song} = require('../models/song.model')
const { formatResult } = require('../utils/formatter')
const _ = require("lodash")


//create new playlist
exports.createPlaylist = async(req, res) =>{
    try {
        const {error} = playlistValidation(req.body)
        if(error) return res.status(400).send(error.details)

        let newPlaylist = await Playlist.findOne({playlistName:req.body.playlistName})
        if(newPlaylist){
            res.status("400").send("Playlist already exists");
        }else{
            newPlaylist = new Playlist(_.pick(req.body,['playlistName', 'playlistSongs']))
        try{
            await newPlaylist.save()
            res.send(formatResult({
                status: 201,
                message: "Playlist created successfully",
                data: newPlaylist
            }))
        }catch (ex) {
            return res.status(400).send(ex.details)   
        }
    }
        
}
    catch(err){
        console.log(err)
        return res.status(500).send(err.details)
    }
}

// get one user playlist
exports.getUserPlaylist = async(req, res) =>{
    try{
         const playlistFound = await Playlist.findById(req.params.id)
         if(!playlistFound){
             return res.send(formatResult({
                 status: 404,
                 message: "playlist not found!"
             }))
         }
         return res.send(formatResult({
             status: 200,
             message: "ok",
             data: playlistFound
         }))
    }catch(error){
        res.status(400).send(error.message)
    }
}

//get all user playlist 
exports.getAllPlaylists = async(req, res) =>{
    try {
        const playlists = await Playlist.find()
        return res.send(formatResult({
            status: 200,
            message: "ok",
            data: playlists
        }))
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

//update user playlist
exports.editPlaylist = async (req, res) =>{
    try {
        const {error} = validatePlaylistEdit(req.body)
        if(error) res.status(400).send(error.message)

        const existingPlaylist = await Playlist.findOne({playlistName:req.body.playlistName})
        if(existingPlaylist){
            res.status("400").send("Playlist already exists");
        }

        const playlist = await Playlist.findByIdAndUpdate(req.params.id, {
            playlistName: req.body.playlistName
        })
        return res.send(formatResult({
            status: 200,
            message: "Playlist edited",
            data: playlist
        }))
    } catch (ex) {
        return res.send(formatResult({
            status: 400,
            message: ex.message
        }))
    }
}

exports.deletePlaylist = async(req, res) =>{
    try {
        const playlist = await Playlist.findById(req.params.id)
        const playlistName = playlist.playlistName;

        if(!playlist){
            return res.send(formatResult({
                status: 404,
                message: "Playlist not found"
            }))
        }

        await Playlist.findByIdAndRemove(req.params.id)
        return res.send(formatResult({
            status: 200,
            message: "Playlist "+ playlistName+ " deleted"
        }))
    } catch (error) {
        return res.send(formatResult({
            status: 400,
            message: error.details
        }))
    }
}
exports.addSongs = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
        if(!playlist){
            return res.send(formatResult({
                status: 404,
                message: "Playlist not found"
            }))
        }
        const song = await Song.findById(req.params.songId)
        console.log(song)
        if(!song){
            return res.send(formatResult({
                status: 404,
                message: "Song not found"
            }))
        }
        playlist.playlistSongs.push(song)
        playlist.save()
        console.log(playlist)

        return res.send(formatResult({
            status: 200,
            message: "Song added successfully",
        }))
    }
    catch (error) {
        return res.send(formatResult({
            status: 400,
            message: error.message
        }))
    }
}