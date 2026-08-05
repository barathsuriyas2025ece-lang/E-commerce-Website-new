const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'CREATE_ADMIN',
        'DELETE_USER',
        'UPDATE_USER',
        'CREATE_PRODUCT',
        'UPDATE_PRODUCT',
        'DELETE_PRODUCT',
        'CREATE_CATEGORY',
        'DELETE_CATEGORY',
        'UPDATE_ORDER_STATUS',
      ],
    },
    performedBy: {
      id: { type: String, required: true },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    target: {
      id: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '180d', // 180 days automatic cleanup retention
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
