import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }, 
    password:{
        type:String,
        required : true,
        minlength: 6,
    },
    role:{
        type:String,
        enum: ["student","recruiter","admin","alumni"],
        required:true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken : String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resumeUrl: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },

    batch: {
        type: Number,
        required: false
    },
    skills: {
        type: [String],
        default: []
    },
    privacySettings: {
        allowMessages: {
            type: Boolean,
            default: true
        },
        departmentOnly: {
            type: Boolean,
            default: false
        }
    }
})

const User = mongoose.model("User",userSchema);

export default User;