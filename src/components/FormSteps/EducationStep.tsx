import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Education } from '../../types/resume';
import { validateEducation } from '../../utils/validation';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const draftId = uuidv4();
export const EducationStep: React.FC = () => {
  const { resumeData, updateEducation } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState<Education>({
    id: '',
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof Education, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    const validationErrors = validateEducation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedEducation = [...resumeData.education];
    
    if (editingIndex >= 0) {
      updatedEducation[editingIndex] = formData;
    } else {
      updatedEducation.push({ ...formData, id: draftId});
    }

    updateEducation(updatedEducation);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(resumeData.education[index]);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index: number) => {
    const updatedEducation = resumeData.education.filter((_, i) => i !== index);
    updateEducation(updatedEducation);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: ''
    });
    setIsEditing(false);
    setEditingIndex(-1);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">Add your educational background</p>
      </div>

      {resumeData.education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Added Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-{isResumeComplete() && (1">
                  <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-600">{edu.institution} • {edu.location}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Education</span>
        </Button>
      )}

      {isEditing && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingIndex >= 0 ? 'Edit' : 'Add'} Education
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Institution"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              error={errors.institution}
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={errors.location}
              placeholder="City, State"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Degree"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              error={errors.degree}
              placeholder="Bachelor's, Master's, etc."
              required
            />
            <Input
              label="Field of Study"
              value={formData.field}
              onChange={(e) => handleInputChange('field', e.target.value)}
              error={errors.field}
              placeholder="Computer Science, Business, etc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="month"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              error={errors.endDate}
              disabled={formData.current}
              required={!formData.current}
            />
            <Input
              label="GPA"
              value={formData.gpa || ''}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              placeholder="3.8 (optional)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="current-education"
              checked={formData.current}
              onChange={(e) => handleInputChange('current', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="current-education" className="text-sm font-medium text-gray-700">
              I currently study here
            </label>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSave}>
              {editingIndex >= 0 ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};