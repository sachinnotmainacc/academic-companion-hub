
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
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      label: "Total Break Sessions",
      value: completedBreaks,
      icon: Coffee,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      label: "Total Focus Time",
      value: formatTime(totalFocusTime),
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20"
    },
    {
      label: "Today's Sessions",
      value: todayPomodoros,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      icon: BarChart,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-white to-zinc-400 rounded-full"></div>
          Your Productivity Stats
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br from-zinc-800/50 via-zinc-900/50 to-zinc-800/50 backdrop-blur-sm border ${stat.borderColor} rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:border-opacity-40 hover:shadow-lg hover:shadow-black/20 hover:scale-105`}
          >
            <div className={`p-2 rounded-full mb-2 ${stat.bgColor} border ${stat.borderColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
            <span className="text-xs text-zinc-400 text-center leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PomodoroStats;
