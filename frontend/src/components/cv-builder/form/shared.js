// CSS class dùng chung cho mọi input/select/textarea
export const inputCls =
  'w-full border border-gray-200 rounded-md px-3 py-2 text-sm ' +
  'focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 ' +
  'transition-colors bg-white'

// Component label + input wrapper
export function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}