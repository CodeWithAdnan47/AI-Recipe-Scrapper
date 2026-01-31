
const Card = ({
    children,
    className = '',
    onClick,
    hover = false,
    glass = false,
    padded = true
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-xl border border-secondary-100 overflow-hidden
        ${glass ? 'glass' : 'shadow-sm'}
        ${hover ? 'hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
        >
            <div className={`${padded ? 'p-6' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-bold text-secondary-900 ${className}`}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`mt-6 pt-4 border-t border-secondary-100 flex items-center justify-between ${className}`}>
        {children}
    </div>
);

export default Card;
