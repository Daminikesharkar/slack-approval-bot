const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approval-controller');

//Define route for handling Slack slash command to open the modal
router.post('/command', approvalController.openApprovalModal);

//Define Route for handling modal submissions
router.post('/interactions', (req, res) => {
    try {
        const payload = JSON.parse(req.body.payload);

        if (payload.type === 'view_submission') {
            console.log("Handling Modal Submission");
            approvalController.handleModalSubmission(req, res);
        }else {
            console.log("Unknown interaction type:", payload.type);
            res.status(400).send("Unknown interaction type");
        }
    } catch (error) {
        console.error("Error in /interactions route:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;