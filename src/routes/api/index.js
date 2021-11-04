const router = require('express').Router();

router.use('/sessions', require('./sessions'));
router.use('/', require('./users'));

router.use((err, req, res, next) => {
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        if (errors && errors.length) {
          errors.push(err.errors[key].message);
        } else {
          errors = [err.errors[key].message];
        }
        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
