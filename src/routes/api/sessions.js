const mongoose = require('mongoose');
const router = require('express').Router();
const Session = mongoose.model('Session');

router.get('/', (req, res) => {
  Session.find({}).then(sessions => {
    return res.json({ data: sessions });
  }).catch(err => {
    res.status(err?.code || 500);
    return res.json({ error: err })
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Session.findById(id).then(session => {
    if (session) {
      return res.json({ data: session });
    } else {
      res.status(404);
      return res.json({ error: `Session not found with id '${id}'` })
    }
  }).catch(err => {
    res.status(err?.code || 500);
    return res.json({ error: err })
  });
});

router.post('/', (req, res) => {
  const session = req.body;

  if (!session?.name || !session?.date) {
    return res.status(400).json({ error: `Required property is missing in the body` })
  }

  const newSession = new Session({
    name: session.name,
    date: session.date,
    active: session.active || false,
    created_by: session.created_by || null
  });

  newSession.save().then(savedSession => {
    res.json({ data: savedSession });
  });
});

module.exports = router;
