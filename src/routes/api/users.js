const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('../../utils/auth');
const router = require('express').Router();
const User = mongoose.model('User');

router.get('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then(user => {
    if (!user){ return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then(user => {
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/user/login', (req, res, next) => {
  if(!req.body.user.email){
    return res.status(422).json({ errors: ['Username can not be blank.'] });
  }

  if(!req.body.user.password){
    return res.status(422).json({ errors: ['Password can not be blank.'] });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT(user);
      return res.json({user: user.toAuthJSON(user)});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/user/register', (req, res, next) => {
  const user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password, user);

  user.save().then(user => {
    return res.json({ user: user.toAuthJSON(user) });
  }).catch(next);
});

module.exports = router;