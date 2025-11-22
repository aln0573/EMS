export const adminOnly = (req ,res , next) => {
    try {

        if(req.user.role !== "admin"){
            return res.status(403).json({message: "Access denied - Admins Only"})
        }

        next()
    } catch (error) {
        console.error('Error in adminOnly', error.message);
        res.status(500).json({message: "internal server error"})
    }
}