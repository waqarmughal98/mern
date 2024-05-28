const Group = require('../Models/GroupModel');
const uuid = require('uuid');
const createGroup = async (req, res) => {
  const { groupName, groupDescription } = req.body;
  Group.create({
    groupName,
    groupDescription,
    userDetail: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
    groupMembers: [
      {
        id: req.user.id,
        access: 'approved',
        status: 'admin',
      },
    ],
  })
    .then((group) =>
      res.status(200).json({
        message: 'Group Created Successfully!',
        status: 'success',
        data: group,
      })
    )
    .catch((error) => res.json(error));
};

const getAllGroup = async (req, res) => {
  Group.find({})
    .then((group) =>
      res.status(200).json({
        message: 'Groups retreive Successfully!',
        status: 'success',
        data: group,
      })
    )
    .catch((error) => res.json(error));
};

const filterGroupById = async (req, res) => {
  console.log();
  if (!req.body.id) {
    return res.status(400).json({
      message: 'You are not sending the id of group!',
      status: 'fail',
    });
  }

  try {
    const group = await Group.findById(req.body.id).select(
      '-groupRequests'
    );

    if (!group) {
      return res.status(404).json({
        message: 'Group not found!',
        status: 'fail',
      });
    }

    res.status(200).json({
      message: 'Group retrieved successfully!',
      status: 'success',
      data: group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getGroupRequestsById = async (req, res) => {
  const groupId = req.body.groupId;
  if (!groupId) {
    return res.status(400).json({
      message: 'You are not sending the id of group!',
      status: 'fail',
    });
  }

  try {
    // Find the group by ID
    let group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res
      .status(200)
      .json({
        message: 'Request to join group sent successfully',
        data: group.groupRequests,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const SendRequestToJoinGroup = async (req, res) => {
  const groupId = req.body.groupId;
  try {
    // Find the group by ID
    let group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is already in the group
    const isMember = group.groupMembers.some(
      (member) => member.id.toString() === req.user.id.toString()
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: 'User is already a member of the group' });
    }

    // Add user to group members
    group.groupMembers.push({
      id: req.user.id,
      access: 'pending',
      status: 'member',
    });

    group.groupRequests.push({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      access: 'pending',
      status: 'member',
    });

    //add the request to the group request section

    // Save the group
    await group.save();

    // Send success response
    res
      .status(200)
      .json({ message: 'Request to join group sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const handleRequest = async (req, res) => {
  const { groupId, requestId, request } = req.body;
  try {
    // Find the group by ID
    let group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    let memberIndex = group.groupMembers.findIndex(
      (member) => member.id.toString() === requestId
    );

    console.log(memberIndex,"memberIndex")

    let requestIndex = group.groupRequests.findIndex(req => req.id.toString() === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (memberIndex !== -1) {
       // Update the access key for the found member
       group.groupMembers[memberIndex].access = request;

      }
      
      console.log("After update:", group.groupMembers[memberIndex]);
    group.groupRequests.splice(requestIndex, 1);
    group.markModified(`groupMembers.${memberIndex}.access`);
    await group.save();

    res.status(200).json({ message: `Request ${request} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const AddTopic = async (req, res) => {
  const { groupId, topicName, topicDescription } = req.body;

  try {
    let group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const topicId = uuid.v4();
    const newTopic = { 
       topicName, topicDescription,topicId,
       createdAt: new Date(),
    };

    group.topics.push(newTopic);

    await group.save();

    res.status(200).json({ message: 'Topic added successfully', topic: newTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTopicsOfGroup=async(req,res)=>{
  const { groupId } = req.body

  Group.find({_id:groupId}).select('topics').then((topics)=>{
    res.status(200).json({ message: 'Topics retreive successfully!', data: topics });
  }).catch((error)=>{
    res.status(500).json({ message: 'Server error', error: error.message });
  })

}
const AddComments = async (req, res) => {
  const { groupId, topicId, comment } = req.body;

  try {
    let group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    let selectedTopic = group.topics.find(topic => topic.topicId === topicId);

    if (!selectedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (!selectedTopic.comments) {
      selectedTopic.comments = [];
    }

    const Id = uuid.v4();
    selectedTopic.comments.push({
      commentId: Id,
      comment,
      name:req.user.name,
      createdAt: new Date(),
    });

    // Mark the 'topics' field as modified
    group.markModified('topics');

    await group.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getComments = async (req, res) => {
  const { groupId, topicId } = req.body;

  try {
    // Find the group by its ID
    const group = await Group.findOne({ _id: groupId }, 'topics') .lean() .exec();

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const selectedTopic = group.topics.find(topic => topic.topicId == topicId);
    if (!selectedTopic) {
      return res.status(404).json({ message: 'Topic not found in the specified group' });
    }


    const comments = selectedTopic.comments || [];

    res.status(200).json({ message: 'Comments retrieved successfully!', data: comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getTopicById = async (req, res) => {
  const { groupId, topicId } = req.body;

  try {
    const group = await Group.findOne({ _id: groupId })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const topic = group.topics.find(topic => topic.topicId === topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found in the specified group' });
    }

    res.status(200).json({ message: 'Topic retrieved successfully!', data: topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




module.exports = {
  createGroup,
  getAllGroup,
  filterGroupById,
  SendRequestToJoinGroup,
  getGroupRequestsById,
  handleRequest,
  AddTopic,
  getTopicsOfGroup,
  AddComments,
   getComments,
   getTopicById
};
