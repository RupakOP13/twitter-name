import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId,res) => {
    const token=jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: '15d'}
    )
    res.cookie("jwt", token, {       // Set the token in an HTTP-only cookie
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
};
