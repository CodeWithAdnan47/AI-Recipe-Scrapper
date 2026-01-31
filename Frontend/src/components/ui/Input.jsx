import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    containerClassName = '',
    id,
    ...props
}, ref) => {
    const inputId = id || props.name;

    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-secondary-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={`
            block w-full rounded-lg border-secondary-300 bg-white text-secondary-900 
            placeholder-secondary-400 focus:border-primary-500 focus:ring-primary-500 
            transition-colors duration-200
            ${Icon ? 'pl-10' : 'pl-4'} 
            ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
