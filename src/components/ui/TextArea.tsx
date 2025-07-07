import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  required = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm hover:border-gray-300 ${
          error ? 'border-red-300 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};