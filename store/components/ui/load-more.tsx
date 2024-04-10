import { cn } from '@/utils/utils';
import { forwardRef } from 'react';

export interface ILoadMoreButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

const LoadMoreButton = forwardRef<HTMLButtonElement, ILoadMoreButton>(
  ({ className, children, onClick, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          `
          w-auto rounded-full bg-black border-transparent px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold hover:opacity-75 transition`,
          className
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

LoadMoreButton.displayName = 'LoadMoreButton';

export default LoadMoreButton;
