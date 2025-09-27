import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    firstName : { type: String, required:true },
    lastName : { type: String, required:true },
    email : { type: String, required:true, unique:true },
    password : { type: String, required:true },
    phone: { type: String },
    city: { type : String },
    country: { type : String },
}, { timestamps: true});

//Hash password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;