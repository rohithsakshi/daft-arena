import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUPISettings extends Document {
  upiId: string;
  accountName: string;
  qrImageUrl: string;
  qrImagePublicId: string;
  isEnabled: boolean;
  paymentInstructions: string;
  supportContact: string;
  updatedBy: string;
  updatedAt: Date;
}

const UPISettingsSchema = new Schema<IUPISettings>(
  {
    upiId: { type: String, required: true },
    accountName: { type: String, required: true },
    qrImageUrl: { type: String, required: true },
    qrImagePublicId: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
    paymentInstructions: { type: String, default: 'Scan the QR code to make payment.' },
    supportContact: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const UPISettings: Model<IUPISettings> = mongoose.models.UPISettings || mongoose.model<IUPISettings>('UPISettings', UPISettingsSchema);
