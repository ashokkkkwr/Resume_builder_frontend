import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';

export class PDFService {
  static async generatePDF(resumeData: ResumeData, elementId: string = 'resume-preview'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Generate filename
      const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`.replace(/\s+/g, '_');
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generatePDFBlob(resumeData: ResumeData, elementId: string = 'resume-preview'): Promise<Blob> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw new Error('Failed to generate PDF blob.');
    }
  }
}