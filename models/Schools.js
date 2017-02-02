var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a UserSchema with the Schema class
var SchoolsSchema = new Schema({
  // name: a unique String
  name: {
    type: String,
    unique: true
  },
  // notes property for the user
  notes: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Note model
    ref: "Note"
  }],
  link: {
    type: String,
    unique: true
  },
  city: {
    type: String
  },
  schoolType: {
    type: String
  }
});

// Create the User model with the UserSchema
var School = mongoose.model("School", SchoolsSchema);

// Export the user model
module.exports = School;
