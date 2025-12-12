import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, glass = false, hover = false, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5 } : {}}
            className={twMerge(
                "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden",
                glass && "glass bg-white/60",
                hover && "hover:shadow-xl transition-shadow duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
