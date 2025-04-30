
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
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      label: "Total Break Sessions",
      value: completedBreaks,
      icon: Coffee,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Total Focus Time",
      value: formatTime(totalFocusTime),
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      label: "Today's Sessions",
      value: todayPomodoros,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      icon: BarChart,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2 w-1.5 h-6 bg-yellow-500 rounded-full"></span>
          Your Productivity Stats
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-dark-700 hover:shadow-lg"
          >
            <div className={`p-2 rounded-full mb-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
            <span className="text-xs text-gray-400 text-center">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PomodoroStats;
