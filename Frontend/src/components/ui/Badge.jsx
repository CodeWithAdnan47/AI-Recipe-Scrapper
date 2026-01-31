
const variants = {
    default: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
};

const Badge = ({
    children,
    variant = 'default',
    className = '',
    rounded = true
}) => {
    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 text-xs font-semibold
      ${rounded ? 'rounded-full' : 'rounded'}
      ${variants[variant] || variants.default}
      ${className}
    `}>
            {children}
        </span>
    );
};

export default Badge;
