import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  joiningDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Customer', customerSchema);
