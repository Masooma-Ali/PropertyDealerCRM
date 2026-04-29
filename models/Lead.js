import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    propertyInterest: {
      type: String,
      enum: ['Residential', 'Commercial', 'Plot', 'Apartment', 'Villa', 'Other'],
      required: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
    },
    budgetUnit: {
      type: String,
      enum: ['PKR', 'USD'],
      default: 'PKR',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Facebook Ads', 'Walk-in', 'Website', 'Referral', 'Other'],
      default: 'Other',
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    score: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-assign score based on budget (in millions PKR)
LeadSchema.pre('save', function () {
  if (this.isModified('budget')) {
    const budgetInMillions = this.budget / 1_000_000;
    if (budgetInMillions > 20) {
      this.score = 'High';
    } else if (budgetInMillions >= 10) {
      this.score = 'Medium';
    } else {
      this.score = 'Low';
    }
  }
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);