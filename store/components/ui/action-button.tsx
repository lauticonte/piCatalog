import { cn } from '@/utils/utils'
import { forwardRef } from 'react'

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButton = forwardRef<HTMLButtonElement, IButton>(({ className, children, disabled, type = 'button', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        `rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:border-primary transition`,
        className
      )}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

ActionButton.displayName = 'ActionButton'

export default ActionButton
