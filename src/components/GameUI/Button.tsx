import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  title,
  style,
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 select-none active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl hover:shadow-purple-500/30 hover:scale-105',
    secondary: 'bg-white/15 hover:bg-white/25 text-white border-2 border-white/30 backdrop-blur-md hover:border-white/40 hover:scale-105',
    ghost: 'bg-transparent hover:bg-white/10 text-white hover:scale-105',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-7 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      title={title}
      style={style}
    >
      {children}
    </motion.button>
  );
}
