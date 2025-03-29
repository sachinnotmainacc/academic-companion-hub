
import { useState, useEffect } from 'react';

export type QuestionData = {
  id: string;
  title: string;
  acceptance: string;
  difficulty: string;
  frequency: number;
  link: string;
};

export type TimeFrame = '6 Months' | '1 Year' | '2 Years' | 'All Time';

const timeFrameToFileName = (companySlug: string, timeFrame: TimeFrame): string => {
  switch (timeFrame) {
    case '6 Months':
      return `${companySlug}_6months.csv`;
    case '1 Year':
      return `${companySlug}_1year.csv`;
    case '2 Years':
      return `${companySlug}_2year.csv`;
    case 'All Time':
    default:
      return `${companySlug}_alltime.csv`;
  }
};

const parseCSVData = (csvText: string): QuestionData[] => {
  if (!csvText || csvText.trim() === '') return [];
  
  const lines = csvText.split('\n');
  if (lines.length <= 1) return [];
  
  // Skip header line
  const dataLines = lines.slice(1).filter(line => line.trim() !== '');
  
  return dataLines.map(line => {
    // Handle CSV parsing properly by considering quoted values
    const processedLine = processCSVLine(line);
    
    try {
      const [id, title, acceptance, difficulty, frequency, link] = processedLine;
      
      return {
        id: id?.trim() || '',
        title: title?.trim() || '',
        acceptance: acceptance?.trim() || '',
        difficulty: (difficulty?.trim() || 'Medium'), // Default to Medium if missing
        frequency: parseFloat(frequency) || 0,
        link: link?.trim() || '',
      };
    } catch (error) {
      console.error('Error parsing CSV line:', line);
      // Return a default object if parsing fails
      return {
        id: '',
        title: '',
        acceptance: '',
        difficulty: 'Medium',
        frequency: 0,
        link: '',
      };
    }
  }).filter(q => q.id && q.title); // Filter out invalid entries
};

// Function to properly process CSV line with quoted fields
const processCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Don't forget the last field
  result.push(current);
  
  return result;
};

export const useCSVQuestions = (companySlug: string | null, timeFrame: TimeFrame) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companySlug) {
      setQuestions([]);
      return;
    }

    const fetchCSVData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fileName = timeFrameToFileName(companySlug, timeFrame);
        const response = await fetch(`/csv/${fileName}`);
        
        if (!response.ok) {
          // If specific timeframe file doesn't exist, try with alltime
          if (timeFrame !== 'All Time') {
            const alltimeResponse = await fetch(`/csv/${companySlug}_alltime.csv`);
            if (!alltimeResponse.ok) {
              throw new Error('No data available for this company');
            }
            const csvText = await alltimeResponse.text();
            const parsedQuestions = parseCSVData(csvText);
            if (parsedQuestions.length === 0) {
              throw new Error('Failed to parse company data');
            }
            setQuestions(parsedQuestions);
          } else {
            throw new Error('No data available for this company');
          }
        } else {
          const csvText = await response.text();
          const parsedQuestions = parseCSVData(csvText);
          if (parsedQuestions.length === 0) {
            throw new Error('Failed to parse company data');
          }
          setQuestions(parsedQuestions);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCSVData();
  }, [companySlug, timeFrame]);

  return { questions, isLoading, error };
}; 
