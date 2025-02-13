export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
}) {
  return (
    <div className="w-full max-w-80">
      <div className="flex items-center justify-between mb-1 text-sm font-medium">
        <label className="text-gray-700 font-medium">{label}</label>
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}