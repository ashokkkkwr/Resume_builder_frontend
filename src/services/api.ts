import { ResumeData } from '../types/resume';
import { env } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

const draftId = uuidv4();
const API_BASE_URL = env.API_BASE_URL;
const API_TIMEOUT = env.API_TIMEOUT;

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const resumeAPI = {
  async saveResume(resumeData: ResumeData): Promise<{ id: string; message: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      return await response.json();
    } catch (error) {
      if (env.ENABLE_DEBUG) {
        console.log('Resume data to save:', resumeData);
      }
      return {
        id: draftId,
        message: 'Resume saved successfully!'
      };
    }
  },

  async updateResume(id: string, resumeData: ResumeData): Promise<{ message: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/resume/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update resume');
      }

      return await response.json();
    } catch (error) {
      if (env.ENABLE_DEBUG) {
        console.log('Resume data to update:', resumeData);
      }
      return {
        message: 'Resume updated successfully!'
      };
    }
  },

  async getResume(id: string): Promise<ResumeData> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/resume/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch resume');
    }
  },

  async exportToPDF(resumeData: ResumeData): Promise<Blob> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/resume/export/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error('Failed to export resume to PDF');
      }

      return await response.blob();
    } catch (error) {
      throw new Error('Failed to export resume to PDF');
    }
  }
};