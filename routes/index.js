var express = require('express');
var router = express.Router();

// Require controller modules
const board_controller = require('../controllers/board_controller');

// GET index page.
router.get('/', board_controller.index)

// GET signup
router.get('/signup', board_controller.signup_get)

// POST signup
router.post('/signup', board_controller.signup_post)

// GET secret
router.get('/secret', board_controller.secret_get)

//POST secret
router.post('/secret', board_controller.secret_post)

// POST new message
router.post('/message', board_controller.message_post)

module.exports = router;

