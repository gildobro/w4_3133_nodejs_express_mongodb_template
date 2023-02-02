const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Provide First Name"]
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  city:{
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    validate(value){
      if(value < 0.0){
        throw new Error("Negative Salary is not allowed")
      }
    }
  },
  created: { 
    type: Date,
    default: Date.now
  },
  updatedat: { 
    type: Date
  },
});

//Declare Virtual Fields
EmployeeSchema.virtual('fullname')
              .get(function(){
                  return `${this.firstname} ${this.lastname}`
              })
              // .set(function(fullname){
              //   fullname = fullname.split(' ');
              //   this.name = fullname[0];
              //   this.lastname = fullname[1];
              // })

//Custom Schema Methods
//1. Instance Method Declaration
EmployeeSchema.methods.getFullName = function(){
  console.log(`Full Name : ${this.firstname} ${this.lastname}`)
  return `${this.firstname} ${this.lastname}`
}

EmployeeSchema.methods.getFormattedSalary = function(){
  return `$${this.salary}`
}

//2. Static method declararion
EmployeeSchema.statics.getEmployeeById = function(eid){
  return this.find({_id: eid }).select("firstname lastname salary designation");
}

EmployeeSchema.statics.getEmployeeByFirstName = function(name){
  return this.find({name: name }).select("firstname lastname salary designation");
}

//Writing Query Helpers
EmployeeSchema.query.sortByFirstName = function(flag) { //flag -1 OR 1
  return this.sort({ 'lastname': flag, })
}



EmployeeSchema.pre('save', (next) => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }
  
  // Call the next function in the pre-save chain
  next()
});

EmployeeSchema.pre('findOneAndUpdate', (next) => {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedat = now
  console.log(this.updatedat)
  next()
});


EmployeeSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

EmployeeSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

EmployeeSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

EmployeeSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;