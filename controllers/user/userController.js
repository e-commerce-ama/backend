import User from "../../models/user/user.js"

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (e) {
        res.status(404).json({message: e.message})
    }
}

export default getUser;
