import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Skill } from '../../types/resume';
import { Plus, Trash2, Edit3 } from 'lucide-react';

const skillCategories = [
  'Programming Languages',
  'Web Technologies',
  'Databases',
  'Tools & Frameworks',
  'Soft Skills',
  'Languages',
  'Other'
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export const SkillsStep: React.FC = () => {
  const { resumeData, updateSkills } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState<Skill>({
    id: '',
    name: '',
    category: 'Programming Languages',
    level: 'Intermediate'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof Skill, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setErrors({ name: 'Skill name is required' });
      return;
    }

    const updatedSkills = [...resumeData.skills];
    
    if (editingIndex >= 0) {
      updatedSkills[editingIndex] = formData;
    } else {
      updatedSkills.push({ ...formData, id: Date.now().toString() });
    }

    updateSkills(updatedSkills);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(resumeData.skills[index]);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleDelete = (index: number) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    updateSkills(updatedSkills);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Programming Languages',
      level: 'Intermediate'
    });
    setIsEditing(false);
    setEditingIndex(-1);
    setErrors({});
  };

  const groupedSkills = resumeData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Add your technical and soft skills</p>
      </div>

      {resumeData.skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Added Skills</h3>
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
              <div className="space-y-2">
                {skills.map((skill, index) => {
                  const globalIndex = resumeData.skills.findIndex(s => s.id === skill.id);
                  return (
                    <div key={skill.id} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className="ml-2 text-sm text-gray-500">• {skill.level}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(globalIndex)}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(globalIndex)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Skill</span>
        </Button>
      )}

      {isEditing && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingIndex >= 0 ? 'Edit' : 'Add'} Skill
          </h3>
          
          <Input
            label="Skill Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., React, JavaScript, Project Management"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {skillCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Level <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
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