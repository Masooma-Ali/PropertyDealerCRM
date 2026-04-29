import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'created',
        'status_updated',
        'assigned',
        'reassigned',
        'notes_updated',
        'follow_up_set',
        'priority_changed',
        'contacted',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);