
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PomodoroSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  onSave: (pomodoro: number, shortBreak: number, longBreak: number) => void;
}

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({
  open,
  onOpenChange,
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  onSave,
}) => {
  const isMobile = useIsMobile();
  const [localPomodoroTime, setLocalPomodoroTime] = React.useState(pomodoroTime / 60);
  const [localShortBreakTime, setLocalShortBreakTime] = React.useState(shortBreakTime / 60);
  const [localLongBreakTime, setLocalLongBreakTime] = React.useState(longBreakTime / 60);

  React.useEffect(() => {
    setLocalPomodoroTime(pomodoroTime / 60);
    setLocalShortBreakTime(shortBreakTime / 60);
    setLocalLongBreakTime(longBreakTime / 60);
  }, [pomodoroTime, shortBreakTime, longBreakTime]);

  const handleSave = () => {
    onSave(
      localPomodoroTime * 60,
      localShortBreakTime * 60,
      localLongBreakTime * 60
    );
    onOpenChange(false);
  };

  // Mobile drawer version
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-dark-900 text-white">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-semibold">Timer Settings</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Focus Duration (minutes)</label>
              <Input
                type="number"
                min="1"
                max="120"
                value={localPomodoroTime}
                onChange={(e) => setLocalPomodoroTime(Number(e.target.value))}
                className="bg-dark-800 border-dark-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Short Break (minutes)</label>
              <Input
                type="number"
                min="1"
                max="30"
                value={localShortBreakTime}
                onChange={(e) => setLocalShortBreakTime(Number(e.target.value))}
                className="bg-dark-800 border-dark-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Long Break (minutes)</label>
              <Input
                type="number"
                min="5"
                max="45"
                value={localLongBreakTime}
                onChange={(e) => setLocalLongBreakTime(Number(e.target.value))}
                className="bg-dark-800 border-dark-700"
              />
            </div>
          </div>
          <DrawerFooter className="border-t border-dark-800 pt-4">
            <Button onClick={handleSave} className="w-full">Save Settings</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop slide-in sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-dark-900 text-white border-dark-800 w-[350px]">
        <SheetHeader className="pb-4 border-b border-dark-800">
          <SheetTitle className="text-white">Timer Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Focus Duration (minutes)</label>
            <Input
              type="number"
              min="1"
              max="120"
              value={localPomodoroTime}
              onChange={(e) => setLocalPomodoroTime(Number(e.target.value))}
              className="bg-dark-800 border-dark-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Short Break (minutes)</label>
            <Input
              type="number"
              min="1"
              max="30"
              value={localShortBreakTime}
              onChange={(e) => setLocalShortBreakTime(Number(e.target.value))}
              className="bg-dark-800 border-dark-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Long Break (minutes)</label>
            <Input
              type="number"
              min="5"
              max="45"
              value={localLongBreakTime}
              onChange={(e) => setLocalLongBreakTime(Number(e.target.value))}
              className="bg-dark-800 border-dark-700"
            />
          </div>
        </div>
        <SheetFooter className="border-t border-dark-800 pt-4">
          <Button onClick={handleSave} className="w-full">Save Settings</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PomodoroSettings;
