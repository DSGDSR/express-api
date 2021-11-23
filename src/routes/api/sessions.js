const mongoose = require('mongoose');
const auth = require('../../utils/auth');
const mongooseUtils = require('../../utils/mongoose.utils');
const router = require('express').Router();
const Session = mongoose.model('Session');

/**
 * @swagger
 * tags:
 *   - name: Sessions
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - name
 *         - date
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         date:
 *           type: string
 *         active:
 *           type: boolean
 *         createdBy:
 *           type: string
 * 
 * /api/sessions:
 *   get:
 *     summary: Retrieve a list of all sesions
 *     tags: [Sessions]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of all sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 */
router.get('/', (req, res) => {
  const paginateOpts = {
    page: req.query?.page,
    limit: req.query?.limit
  };

  Session.paginate({}, mongooseUtils.getPaginateOptions(paginateOpts))
    .then(sessions => {
      return res.json({ ...sessions });
    }).catch(err => {
      res.status(err?.code || 500);
      return res.json({ errors: [err] });
    });
});


/**
 * @swagger
 * 
 * /api/sessions/{id}:
 *   get:
 *     summary: Retrieve a session by id
 *     tags: [Sessions]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Session id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An object containing the matching id session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Session'
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Session.findById(id).then(session => {
    if (session) {
      return res.json({ data: session });
    } else {
      res.status(404);
      return res.json({ errors: ['Session not found.'] });
    }
  }).catch(err => {
    res.status(err?.code || 500);
    return res.json({ errors: [err] });
  });
});


/**
 * @swagger
 * 
 * /api/sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           in: body
 *           name: session
 *           description: The session to create
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: An object containing the created session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Session'
 */
router.post('/', auth.required, (req, res) => {
  const session = req.body;

  if (!session?.name || !session?.date) {
    return res.status(400).json({ errors: ['Required property is missing in the body.'] });
  }

  const newSession = new Session({
    name: session.name,
    date: session.date,
    active: session.active || false,
    createdBy: req.payload?.id || null
  });

  newSession.save().then(savedSession => {
    res.json({ data: savedSession });
  }).catch(err => {
    res.status(err?.code || 500);
    return res.json({ errors: [err] });
  });
});

module.exports = router;
