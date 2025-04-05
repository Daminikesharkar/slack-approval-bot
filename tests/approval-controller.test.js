const approvalController = require('../controllers/approval-controller');
const slackClient = require('../util/slack-config');

jest.mock('../util/slack-config');

describe('Approval Controller', () => {

    let req, res;

    beforeEach(() => {
        req = { body: {}, };
        res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
        jest.clearAllMocks();
    });

    // openApprovalModal
    describe('openApprovalModal', () => {
        it('should open a modal using slackClient.views.open()', async () => {
            req.body = { trigger_id: 'sample-trigger-id' };

            slackClient.views = {
                open: jest.fn().mockResolvedValue({}),
            };

            await approvalController.openApprovalModal(req, res);

            expect(slackClient.views.open).toHaveBeenCalledWith(expect.objectContaining({
                trigger_id: 'sample-trigger-id',
                view: expect.any(Object),
            }));

            expect(res.send).toHaveBeenCalledWith('');
        });

        it('should return 500 on error', async () => {
            slackClient.views = {
                open: jest.fn().mockRejectedValue(new Error('Slack error')),
            };

            await approvalController.openApprovalModal(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    // handleModalSubmission
    describe('handleModalSubmission', () => {
        it('should send approval request to approver with buttons', async () => {
            req.body = {
                payload: JSON.stringify({
                type: 'view_submission',
                user: { id: 'U123' },
                view: {
                    state: {
                    values: {
                        approver_block: {
                        approver_select: { selected_user: 'U456' },
                        },
                        approval_text: {
                        approval_input: { value: 'Please approve this request' },
                        }
                    }
                    }
                }
                })
            };

            slackClient.chat = {
                postMessage: jest.fn().mockResolvedValue({}),
            };

            await approvalController.handleModalSubmission(req, res);

            expect(slackClient.chat.postMessage).toHaveBeenCalledWith(expect.objectContaining({
                channel: 'U456',
                text: expect.stringContaining('New Approval Request'),
                attachments: expect.any(Array),
            }));

            expect(res.send).toHaveBeenCalledWith('');
        });

        it('should return 500 on error', async () => {
            req.body = {
                payload: JSON.stringify({
                type: 'view_submission',
                user: { id: 'U123' },
                view: {
                    state: {
                    values: {
                        approver_block: {
                        approver_select: { selected_user: 'U456' },
                        },
                        approval_text: {
                        approval_input: { value: 'Please approve this request' },
                        }
                    }
                    }
                }
                })
            };

            slackClient.chat = {
                postMessage: jest.fn().mockRejectedValue(new Error('fail')),
            };

            await approvalController.handleModalSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

    // handleApprovalActions
    describe('handleApprovalActions', () => {
        it('should send "Approved" message back to requester', async () => {
            req.body = {
                payload: JSON.stringify({
                actions: [{ name: 'approve', value: 'U111' }],
                user: { id: 'U456' }
                })
            };

            slackClient.chat = {
                postMessage: jest.fn().mockResolvedValue({}),
            };

            await approvalController.handleApprovalActions(req, res);

            expect(slackClient.chat.postMessage).toHaveBeenCalledWith(expect.objectContaining({
                channel: 'U111',
                text: expect.stringContaining('Approved!'),
            }));

            expect(res.send).toHaveBeenCalledWith('');
        });

        it('should send "Rejected" message back to requester', async () => {
            req.body = {
                payload: JSON.stringify({
                actions: [{ name: 'reject', value: 'U222' }],
                user: { id: 'U789' }
                })
            };

            slackClient.chat = {
                postMessage: jest.fn().mockResolvedValue({}),
            };

            await approvalController.handleApprovalActions(req, res);

            expect(slackClient.chat.postMessage).toHaveBeenCalledWith(expect.objectContaining({
                channel: 'U222',
                text: expect.stringContaining('Rejected!'),
            }));

            expect(res.send).toHaveBeenCalledWith('');
        });

        it('should return 500 on error', async () => {
            req.body = {
                payload: JSON.stringify({
                actions: [{ name: 'approve', value: 'U999' }],
                user: { id: 'U000' }
                })
            };
            slackClient.chat = {
                postMessage: jest.fn().mockRejectedValue(new Error('fail')),
            };

            await approvalController.handleApprovalActions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        });
    });

});