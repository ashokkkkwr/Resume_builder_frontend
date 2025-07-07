import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({ label, error, required = false, icon, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400 ${
            error ? "border-red-300 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
