export default function SummaryCard({ title, value, icon, change, changeType }) {
  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div className={`flex items-center ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            <span className="text-sm font-medium">
              {changeType === 'increase' ? '↑' : '↓'} {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 