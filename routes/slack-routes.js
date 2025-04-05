const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

//Define route for handling Slack slash command to open the modal
router.post('/command', approvalController.openApprovalModal);

module.exports = router;