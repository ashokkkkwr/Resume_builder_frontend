import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { WorkExperience } from '../../types/resume';
import { validateWorkExperience } from '../../utils/validation';
import { Plus, Trash2, Edit3, Building, MapPin, Calendar, Briefcase } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const draftId = uuidv4();

export const WorkExperienceStep: React.FC = () => {
  const { resumeData, updateWorkExperience } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState<WorkExperience>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof WorkExperience, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    const validationErrors = validateWorkExperience(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedExperience = [...resumeData.workExperience];
    
    if (editingIndex >= 0) {
      updatedExperience[editingIndex] = formData;
    } else {
      updatedExperience.push({ ...formData, id: draftId });
    }

    updateWorkExperience(updatedExperience);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(resumeData.workExperience[index]);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index: number) => {
    const updatedExperience = resumeData.workExperience.filter((_, i) => i !== index);
    updateWorkExperience(updatedExperience);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setIsEditing(false);
    setEditingIndex(-1);
    setErrors({});
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 text-lg">Add your professional experience to showcase your career journey</p>
      </div>

      {resumeData.workExperience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Briefcase size={20} className="text-blue-500" />
            <span>Your Experience ({resumeData.workExperience.length})</span>
          </h3>
          {resumeData.workExperience.map((exp, index) => (
            <div key={exp.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building size={16} className="text-blue-500" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} className="text-blue-500" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar size={16} className="text-blue-500" />
                    <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
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
                    variant="danger"
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
        <div className="text-center">
          <Button onClick={() => setIsEditing(true)} className="px-8 py-3">
            <Plus size={18} />
            <span>Add Work Experience</span>
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {editingIndex >= 0 ? 'Edit' : 'Add'} Work Experience
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              error={errors.company}
              icon={<Building size={18} />}
              placeholder="Company name"
              required
            />
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              error={errors.position}
              icon={<Briefcase size={18} />}
              placeholder="Job title"
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            error={errors.location}
            icon={<MapPin size={18} />}
            placeholder="City, State"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="month"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              error={errors.startDate}
              icon={<Calendar size={18} />}
              required
            />
            <Input
              label="End Date"
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              error={errors.endDate}
              icon={<Calendar size={18} />}
              disabled={formData.current}
              required={!formData.current}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => handleInputChange('current', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="current" className="text-sm font-medium text-gray-700">
              I currently work here
            </label>
          </div>

          <TextArea
            label="Job Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="Describe your responsibilities, achievements, and key contributions..."
            rows={5}
            required
          />

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button onClick={handleSave} className="flex-1">
              {editingIndex >= 0 ? 'Update Experience' : 'Save Experience'}
            </Button>
            <Button variant="outline" onClick={resetForm} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};