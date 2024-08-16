import bcrypt from "bcryptjs";
export const hashPassword = async function (plainPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    }
    catch (error) {
        console.error('Error hashing password:', error);
    }
};
export const verifyPassword = async function (plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        if (match) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error('Error verifying password:', error);
    }
};
