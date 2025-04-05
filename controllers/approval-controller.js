const slackClient = require('../util/slack-config');

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

exports.handleModalSubmission = async (req, res) => {
    try {
        //Parse the payload from the Slack modal submission
        const payload = JSON.parse(req.body.payload);

        //Check if the interaction is a modal submission
        if (payload.type === 'view_submission') {

            //Extract the selected approver(user ID), approval text entered by the requester, and ID of the user who submitted the form
            const approver = payload.view.state.values.approver_block.approver_select.selected_user;
            const approvalText = payload.view.state.values.approval_text.approval_input.value;
            const requester = payload.user.id;

            //Send an approval request message(chat) to the approver
            await slackClient.chat.postMessage({
                channel: approver,
                text: `*New Approval Request from <@${requester}>*:\n${approvalText}`,
                attachments: [
                    {
                        text: "Approve or Reject?",
                        fallback: "You can't respond here",
                        callback_id: "approval_action",
                        actions: [
                            { name: "approve", text: "Approve", type: "button", value: requester },
                            { name: "reject", text: "Reject", type: "button", value: requester }
                        ]
                    }
                ]
            });

            res.send('');
        }
    } catch (error) {
        console.error("Error handling modal submission:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.handleApprovalActions = async (req, res) => {
    try {
        //Parse the payload sent by Slack from the interaction
        const payload = JSON.parse(req.body.payload);

        //Extract the action (approve or reject) and the requester ID from the button value
        const action = payload.actions[0].name;
        const requester = payload.actions[0].value;

        //Set the message based on whether it was approved or rejected
        let message = (action === "approve") ? "Approved!" : "Rejected!";
        
        //Send a direct message back to the requester informing them of the decision
        await slackClient.chat.postMessage({
            channel: requester,
            text: `Your approval request has been *${message}* by <@${payload.user.id}>`
        });

        res.send('');
    } catch (error) {
        console.error("Error handling approval actions:", error);
        res.status(500).send("Internal Server Error");
    }
};