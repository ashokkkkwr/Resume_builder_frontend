import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { validatePersonalInfo } from '../../utils/validation';
import { FormErrors } from '../../types/resume';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const PersonalInfoStep: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const [formData, setFormData] = useState(resumeData.personalInfo);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setFormData(resumeData.personalInfo);
  }, [resumeData.personalInfo]);

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updatePersonalInfo(updatedData);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    const validationErrors = validatePersonalInfo(formData);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 text-lg">Let's start with your basic information to create your professional profile</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={errors.firstName}
            icon={<User size={18} />}
            placeholder="Enter your first name"
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={errors.lastName}
            icon={<User size={18} />}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            icon={<Mail size={18} />}
            placeholder="your.email@example.com"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            icon={<Phone size={18} />}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          error={errors.location}
          icon={<MapPin size={18} />}
          placeholder="City, State, Country"
          required
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Presence (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Website"
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              icon={<Globe size={18} />}
              placeholder="https://yourwebsite.com"
            />
            <Input
              label="LinkedIn"
              type="url"
              value={formData.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              icon={<Linkedin size={18} />}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <Input
              label="GitHub"
              type="url"
              value={formData.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              icon={<Github size={18} />}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>
      </div>
    </div>
  );
};