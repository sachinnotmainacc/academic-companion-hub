
import { useState, useEffect } from 'react';

export type QuestionData = {
  id: string;
  title: string;
  acceptance: string;
  difficulty: string;
  frequency: number;
  link: string;
  company: string;
  timeRange: string;
  topics: string[];
};

type TimeFrame = '6 Months' | '1 Year' | '2 Years' | 'All Time';

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

const parseCSVData = (csvText: string, company?: string, timeRange?: string): QuestionData[] => {
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
      
      // Generate topics from title (simple approach)
      const topics = title?.toLowerCase().includes('array') ? ['Array'] :
                    title?.toLowerCase().includes('tree') ? ['Tree'] :
                    title?.toLowerCase().includes('graph') ? ['Graph'] :
                    title?.toLowerCase().includes('string') ? ['String'] :
                    title?.toLowerCase().includes('dynamic') ? ['Dynamic Programming'] :
                    ['General'];
      
      return {
        id: id?.trim() || '',
        title: title?.trim() || '',
        acceptance: acceptance?.trim() || '',
        difficulty: (difficulty?.trim() || 'Medium'),
        frequency: parseFloat(frequency) || 0,
        link: link?.trim() || '',
        company: company || 'Unknown',
        timeRange: timeRange || 'alltime',
        topics: topics,
      };
    } catch (error) {
      console.error('Error parsing CSV line:', line);
      return {
        id: '',
        title: '',
        acceptance: '',
        difficulty: 'Medium',
        frequency: 0,
        link: '',
        company: company || 'Unknown',
        timeRange: timeRange || 'alltime',
        topics: ['General'],
      };
    }
  }).filter(q => q.id && q.title);
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

// Get list of available companies from CSV files
const getAvailableCompanies = (): string[] => {
  return [
    'google', 'amazon', 'microsoft', 'facebook', 'apple', 'netflix', 'uber', 
    'airbnb', 'linkedin', 'twitter', 'adobe', 'salesforce', 'dropbox', 
    'spotify', 'snapchat', 'pinterest', 'robinhood', 'palantir-technologies',
    'nvidia', 'samsung', 'sap', 'nutanix', 'opendoor', 'pocket-gems',
    'rubrik', 'splunk', 'riot-games', 'alibaba', 'coursera', 'akuna-capital',
    'cruise-automation', 'didi', 'databricks', 'doordash', 'docusign',
    'netease', 'netflix', 'morgan-stanley', 'deutsche-bank', 'dataminr',
    'dell', 'drawbridge'
  ];
};

const getAvailableTimeRanges = (): string[] => {
  return ['6months', '1year', '2year', 'alltime'];
};

export const useCSVQuestions = (selectedCompany?: string, timeFrame?: TimeFrame) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [companies] = useState<string[]>(getAvailableCompanies());
  const [timeRanges] = useState<string[]>(getAvailableTimeRanges());

  useEffect(() => {
    const fetchCSVData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        if (!selectedCompany) {
          // No company selected, don't load any questions
          setQuestions([]);
          setIsLoading(false);
          return;
        }

        const allQuestions: QuestionData[] = [];
        const fileName = timeFrame ? timeFrameToFileName(selectedCompany, timeFrame) : `_alltime.csv`;
        
        console.log(`Loading questions from company: ${selectedCompany}`);
        
        try {
          const response = await fetch(`/csv/${selectedCompany}${fileName}`);
          if (response.ok) {
            const csvText = await response.text();
            const parsedQuestions = parseCSVData(csvText, selectedCompany, timeFrame || 'alltime');
            allQuestions.push(...parsedQuestions);
            console.log(`Loaded ${parsedQuestions.length} questions from ${selectedCompany}`);
          } else {
            console.warn(`Failed to load data for ${selectedCompany}: ${response.status}`);
            throw new Error(`No data available for ${selectedCompany}`);
          }
        } catch (err) {
          console.warn(`Error loading data for ${selectedCompany}:`, err);
          throw new Error(`Failed to load questions for ${selectedCompany}`);
        }
        
        console.log('Total questions loaded:', allQuestions.length);
        
        if (allQuestions.length === 0) {
          throw new Error('No questions found for this company');
        }
        
        setQuestions(allQuestions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
        console.error('Error in fetchCSVData:', errorMessage);
        setError(errorMessage);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCSVData();
  }, [selectedCompany, timeFrame]);

  return { 
    questions, 
    isLoading, 
    error, 
    companies, 
    timeRanges 
  };
};
