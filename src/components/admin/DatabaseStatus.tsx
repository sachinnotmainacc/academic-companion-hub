
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { DatabaseIcon, CloudOff, Cloud, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      // For demo purposes, we'll just simulate a connection check
      // In a real app, this would be an actual API request to the MongoDB server
      const timeout = Math.random() > 0.3;
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate occasional connection failures for demo purposes
      if (timeout) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
        toast.error("Database connection failed. Using local storage fallback.");
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Set up periodic checking
    const interval = setInterval(() => {
      checkConnection();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-dark-800 shadow-lg shadow-dark-900/20 bg-dark-900/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-white">Database Status</span>
          </div>
          
          {isConnected === null ? (
            <Badge variant="outline" className="bg-gray-500/10 text-gray-400">
              Checking...
            </Badge>
          ) : isConnected ? (
            <Badge variant="success" className="flex items-center gap-1">
              <Cloud className="h-3 w-3" />
              <span>Connected</span>
            </Badge>
          ) : (
            <Badge variant="warning" className="flex items-center gap-1">
              <CloudOff className="h-3 w-3" />
              <span>Using Local Storage</span>
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={checking}
            className="border-dark-700 text-gray-400 hover:text-white hover:bg-dark-800"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Check'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
