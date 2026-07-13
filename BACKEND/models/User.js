import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    
    {

    name:{
        type:String,
        required: [true,'Name is required'],
        trim:true
    },

    email:{

        type:String,
        required:[true,'email is required'],
        trim:true,
        unique:true,
        lowercase:true,
    },

password:{

    type:String,
    required:[true,'password is required'],
    minlength:[6,'Password must be atleast 6 characters'],

},
role:{

    type:String,
    enum:['user','admin'],
    default:'user'
},

isActive:{

    type:Boolean,
    default:true,
},

    },

{

    timestamps:true,
}

);

userSchema.methods.matchPassword= async function( enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre('save', async function(next){


    if(!this.isModified(`password`)) return next();
    const salt =await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});


const User=mongoose.model('User', userSchema);

export default User;