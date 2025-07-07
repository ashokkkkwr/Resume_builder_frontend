import { PersonalInfo, WorkExperience, Education, FormErrors } from '../types/resume';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validatePersonalInfo = (info: PersonalInfo): FormErrors => {
  const errors: FormErrors = {};

  if (!info.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!info.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!info.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(info.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!info.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(info.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  if (!info.location.trim()) {
    errors.location = 'Location is required';
  }

  return errors;
};

export const validateWorkExperience = (experience: WorkExperience): FormErrors => {
  const errors: FormErrors = {};

  if (!experience.company.trim()) {
    errors.company = 'Company name is required';
  }
  if (!experience.position.trim()) {
    errors.position = 'Position is required';
  }
  if (!experience.location.trim()) {
    errors.location = 'Location is required';
  }
  if (!experience.startDate) {
    errors.startDate = 'Start date is required';
  }
  if (!experience.current && !experience.endDate) {
    errors.endDate = 'End date is required';
  }
  if (!experience.description.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
};

export const validateEducation = (education: Education): FormErrors => {
  const errors: FormErrors = {};

  if (!education.institution.trim()) {
    errors.institution = 'Institution name is required';
  }
  if (!education.degree.trim()) {
    errors.degree = 'Degree is required';
  }
  if (!education.field.trim()) {
    errors.field = 'Field of study is required';
  }
  if (!education.location.trim()) {
    errors.location = 'Location is required';
  }
  if (!education.startDate) {
    errors.startDate = 'Start date is required';
  }
  if (!education.current && !education.endDate) {
    errors.endDate = 'End date is required';
  }

  return errors;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};