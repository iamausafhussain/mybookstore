const User = require('./user.model')

const createUser = async (req, res) => {
    try {
        const newUser = await User({ ...req.body });
        await newUser.save();
        res.status(201).send({ message: "User created successfully", user: newUser })
    } catch (error) {
        console.error("Error creating user", error);
        res.status(418).send({ message: "Failed to create a user. You might be missing some fields that are actually required!" })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).send(users)
    } catch (error) {
        console.error("Error fetching users", error);
        res.status(418).send({ message: "Failed to fetch users." })
    }
}

const getUser = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({email: email})

        if (!user) {
            res.status(404).send(`User with email ${email} not found!`)
        }

        res.status(200).send(user)


    } catch (error) {
        console.error("Error fetching user", error);
        res.status(418).send({ message: `Failed to fetch user.` })
    }
}

module.exports = { createUser, getAllUsers, getUser }