
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = async (req, res) => {
    const { currUserId, userId } = req.body;

    if (!userId) {
        return res.status(404).send({ message: "can not get userId" })
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: currUserId } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]

    }).populate("users", "-password").populate("latestMessage");


    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    })
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [currUserId, userId],
        };
        try {
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400).send({ messsage: "error in access Chat" })
        }
    }
}

const fetchChats = async (req, res) => {
    const { currUserId } =req.query;
    console.log(currUserId)
    try {
        Chat.find({
            users: { $elemMatch: { $eq: currUserId } }
        }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 }).then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(404).send({ message: "error while fetching chats" })
    }
}

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" })
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat")
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400).send("failed ")
    }
}

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!added) {
        res.status(404).send("Chat Not Found");
    } else {
        res.json(added);
    }

}
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404).send("Chat Not Found");
    } else {
        res.json(removed);
    }

}

module.exports = { accessChat, fetchChats, createGroupChat, addToGroup, removeFromGroup };