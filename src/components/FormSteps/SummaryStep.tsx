import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { TextArea } from '../ui/TextArea';

export const SummaryStep: React.FC = () => {
  const { resumeData, updateSummary } = useResume();
  const [content, setContent] = useState(resumeData.summary.content);

  useEffect(() => {
    setContent(resumeData.summary.content);
  }, [resumeData.summary.content]);

  const handleChange = (value: string) => {
    setContent(value);
    updateSummary({ content: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-gray-600">Write a brief summary that highlights your key qualifications and career objectives</p>
      </div>

      <div className="space-y-4">
        <TextArea
          label="Summary"
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write a compelling summary of your professional background, key achievements, and career goals. This section should give employers a quick overview of what makes you a strong candidate."
          rows={8}
          className="text-base"
        />
        
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-2">Tips for writing a great summary:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep it concise (2-4 sentences)</li>
            <li>Highlight your most relevant skills and experience</li>
            <li>Include specific achievements or numbers when possible</li>
            <li>Tailor it to match the job you're applying for</li>
            <li>Use action words and professional language</li>
          </ul>
        </div>
      </div>
    </div>
  );
};