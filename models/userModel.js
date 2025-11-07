const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:['admin','doctor','nurse','patient']}
}, { timestamps: true });


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }   
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
}   );

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);

