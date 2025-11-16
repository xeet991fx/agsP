import React from 'react';

const CharacterCounter = ({ count, limit = 280 }) => {
  const percentage = (count / limit) * 100;
  const isOverLimit = count > limit;
  const isNearLimit = percentage > 90 && !isOverLimit;

  const getColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - Math.min(percentage, 100) / 100)}`}
            className={`transition-all duration-300 ${
              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-x-blue'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold ${getColor()}`}>
            {count > limit ? `+${count - limit}` : limit - count}
          </span>
        </div>
      </div>
      <div className="text-sm">
        <div className={`font-semibold ${getColor()}`}>
          {count} / {limit}
        </div>
        {isOverLimit && (
          <div className="text-xs text-red-400">Over limit</div>
        )}
        {isNearLimit && (
          <div className="text-xs text-yellow-400">Near limit</div>
        )}
      </div>
    </div>
  );
};

export default CharacterCounter;
