import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, className, error, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200",
                    error && "border-red-300 focus:ring-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
