const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProjectSchema=new Schema(
    {
        name:{type: String, required: true},
        description:{type: String},
        price: {type: Number},
        jobDone:{type: String},
        startDate:{type: Date,},
        endDate:{type: Date, },
        teamMembers:{type:String},
    }
)

const Project=mongoose.model('Project',ProjectSchema);

module.exports=Project;