// Controllers handles the functions used in a route. 
// It is much cleaner to do it this way than have a massive router page. 

const User = require('../models/User')

exports.login = () => {

}

exports.logout = () => {

}

exports.register = (req, res) => {
    let user = new User(req.body); 
    user.register();
    if(user.errors.length){
        res.send(user.errors)
    } else {
        res.send("There are no errors.")
    }
}

exports.home = (req, res) => {
    res.render('home-guest');
}

