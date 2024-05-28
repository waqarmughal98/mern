const express = require("express") ;
const { createGroup , getAllGroup , filterGroupById , SendRequestToJoinGroup , getGroupRequestsById , handleRequest , AddTopic , getTopicsOfGroup, AddComments , getComments , getTopicById } = require("../Controllers/GroupController");
const GroupRouter = express.Router();
const Protect = require("../Middleware/AuthMiddleware")

GroupRouter.route("/create-group").post(Protect , createGroup);
GroupRouter.route("/all-groups").get(Protect , getAllGroup);
GroupRouter.route("/filter-group-by-id").post(Protect , filterGroupById);
GroupRouter.route("/send-request-to-join-group").post(Protect , SendRequestToJoinGroup);
GroupRouter.route("/get-group-requests").post(Protect , getGroupRequestsById);
GroupRouter.route("/handle-request").post(Protect , handleRequest);
GroupRouter.route("/add-topic").post(Protect , AddTopic);
GroupRouter.route("/get-topics-of-group").post(Protect , getTopicsOfGroup);
GroupRouter.route("/add-comment").post(Protect , AddComments);
GroupRouter.route("/get-comments-of-group").post(Protect , getComments);
GroupRouter.route("/get-topic-by-id").post(Protect , getTopicById);


module.exports =  GroupRouter;