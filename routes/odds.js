let express = require('express');
let router = express.Router();

let controller = require('../controllers/odds');

router.get('/', controller.list);
router.post('/', controller.add);
router.delete('/:id', controller.delete);

module.exports = router;