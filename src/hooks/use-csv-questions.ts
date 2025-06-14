
import { useState, useEffect } from 'react';

export type QuestionData = {
  id: string;
  title: string;
  acceptance: string;
  difficulty: string;
  frequency: number;
  link: string;
  company?: string;
  timeRange?: string;
  topics?: string[];
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
  // This is a simplified list based on the CSV files available
  return [
    'google', 'amazon', 'microsoft', 'facebook', 'apple', 'netflix', 'uber', 
    'airbnb', 'linkedin', 'twitter', 'adobe', 'salesforce', 'dropbox', 
    'spotify', 'snapchat', 'pinterest', 'robinhood', 'palantir-technologies',
    'nvidia', 'samsung', 'sap', 'nutanix', 'opendoor', 'pocket-gems',
    'rubrik', 'splunk', 'riot-games'
  ];
};

const getAvailableTimeRanges = (): string[] => {
  return ['6months', '1year', '2year', 'alltime'];
};

export const useCSVQuestions = (companySlug?: string | null, timeFrame?: TimeFrame) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies] = useState<string[]>(getAvailableCompanies());
  const [timeRanges] = useState<string[]>(getAvailableTimeRanges());

  useEffect(() => {
    const fetchCSVData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!companySlug) {
          // Load questions from all companies
          const allQuestions: QuestionData[] = [];
          const companiesToLoad = companies.slice(0, 10); // Limit to first 10 companies for performance
          
          for (const company of companiesToLoad) {
            try {
              const response = await fetch(`/csv/${company}_alltime.csv`);
              if (response.ok) {
                const csvText = await response.text();
                const parsedQuestions = parseCSVData(csvText, company, 'alltime');
                allQuestions.push(...parsedQuestions);
              }
            } catch (err) {
              console.warn(`Failed to load data for ${company}`);
            }
          }
          
          if (allQuestions.length === 0) {
            throw new Error('No questions found');
          }
          
          setQuestions(allQuestions);
        } else {
          // Load questions for specific company
          const fileName = timeFrameToFileName(companySlug, timeFrame || 'All Time');
          const response = await fetch(`/csv/${fileName}`);
          
          if (!response.ok) {
            if (timeFrame !== 'All Time') {
              const alltimeResponse = await fetch(`/csv/${companySlug}_alltime.csv`);
              if (!alltimeResponse.ok) {
                throw new Error('No data available for this company');
              }
              const csvText = await alltimeResponse.text();
              const parsedQuestions = parseCSVData(csvText, companySlug, 'alltime');
              if (parsedQuestions.length === 0) {
                throw new Error('Failed to parse company data');
              }
              setQuestions(parsedQuestions);
            } else {
              throw new Error('No data available for this company');
            }
          } else {
            const csvText = await response.text();
            const parsedQuestions = parseCSVData(csvText, companySlug, timeFrame?.toLowerCase().replace(' ', '') || 'alltime');
            if (parsedQuestions.length === 0) {
              throw new Error('Failed to parse company data');
            }
            setQuestions(parsedQuestions);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCSVData();
  }, [companySlug, timeFrame, companies]);

  return { questions, loading, error, companies, timeRanges };
};
