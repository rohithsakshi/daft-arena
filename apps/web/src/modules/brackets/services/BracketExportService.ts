import { IDraw } from '../models/Draw';

export class BracketExportService {
  
  async exportDrawToPdf(draw: IDraw): Promise<Buffer> {
    // Placeholder for PDF generation
    throw new Error("Not implemented");
  }

  async exportDrawToImage(draw: IDraw): Promise<Buffer> {
    // Placeholder for Image (PNG/JPEG) generation
    throw new Error("Not implemented");
  }
}
