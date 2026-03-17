interface ActivityItemProps {
  type: 'interview' | 'hired' | 'request' | 'candidate';
  title: string;
  description: string;
  time: string;
  avatar?: string;
}

export function ActivityItem({ type, title, description, time }: ActivityItemProps) {
  const getActivityIcon = () => {
    switch (type) {
      case 'interview':
        return '📅';
      case 'hired':
        return '✅';
      case 'request':
        return '📋';
      case 'candidate':
        return '👤';
      default:
        return '•';
    }
  };

  const getActivityColor = () => {
    switch (type) {
      case 'interview':
        return 'bg-blue-50';
      case 'hired':
        return 'bg-green-50';
      case 'request':
        return 'bg-pink-50';
      case 'candidate':
        return 'bg-amber-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-6 px-6 transition-colors">
      <div className={`p-2.5 rounded-lg ${getActivityColor()} text-lg flex-shrink-0`}>
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0 mt-1">{time}</span>
    </div>
  );
}
