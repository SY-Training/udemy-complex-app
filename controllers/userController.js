// Controllers handles the functions used in a route. 
// It is much cleaner to do it this way than have a massive router page. 

exports.login = () => {

}

exports.logout = () => {

}

exports.register = (req, res) => {
    res.send("thanks for trying to register")
}

exports.home = (req, res) => {
    res.render('home-guest');
}

