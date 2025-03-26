
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Coffee,
  BarChart,
  Calendar 
} from 'lucide-react';

interface PomodoroStatsProps {
  completedPomodoros: number;
  completedBreaks: number;
  totalFocusTime: number;
  todayPomodoros: number;
  longestStreak: number;
}

const PomodoroStats: React.FC<PomodoroStatsProps> = ({
  completedPomodoros,
  completedBreaks,
  totalFocusTime,
  todayPomodoros,
  longestStreak
}) => {
  // Format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      label: "Total Focus Sessions",
      value: completedPomodoros,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      label: "Total Break Sessions",
      value: completedBreaks,
      icon: Coffee,
      color: "text-blue-500"
    },
    {
      label: "Total Focus Time",
      value: formatTime(totalFocusTime),
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      label: "Today's Sessions",
      value: todayPomodoros,
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      icon: BarChart,
      color: "text-red-500"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-white mb-4">Your Productivity Stats</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-lg p-4 flex flex-col items-center justify-center"
          >
            <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
            <span className="text-xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-gray-400 text-center mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PomodoroStats;
