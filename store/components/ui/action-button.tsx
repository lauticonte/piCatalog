import { cn } from '@/utils/utils'
import { forwardRef } from 'react'

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButton = forwardRef<HTMLButtonElement, IButton>(({ className, children, disabled, type = 'button', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        `mt-3 rounded-md bg-gray-900 border border-gray-900 px-3 py-1 text-sm text-gray-300 font-semibold hover:bg-black focus:outline-none focus:border-primary transition`,
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
