const slackClient = require('../config/slackConfig');

exports.openApprovalModal = async (req, res) => {
    try {
        //Extract the trigger_id from the Slack request body
        const { trigger_id } = req.body;

        //Define the modal structure to be displayed in Slack
        const modal = {
            type: "modal",
            callback_id: "approval_request",
            title: { type: "plain_text", text: "Approval Request" },
            blocks: [
                {
                    //Block for selecting an approver (Slack users)
                    type: "input",
                    block_id: "approver_block",
                    element: { type: "users_select", action_id: "approver_select" },
                    label: { type: "plain_text", text: "Select Approver" }
                },
                {
                    //Block for entering approval details
                    type: "input",
                    block_id: "approval_text",
                    element: { type: "plain_text_input", action_id: "approval_input", multiline: true },
                    label: { type: "plain_text", text: "Approval Details" }
                }
            ],
            submit: { type: "plain_text", text: "Submit" }
        };

        //Call Slack API to open the modal using the trigger_id
        await slackClient.views.open({
            trigger_id,
            view: modal
        });

        res.send('');
    } catch (error) {
        console.error("Error opening modal:", error);
        res.status(500).send("Internal Server Error");
    }
};