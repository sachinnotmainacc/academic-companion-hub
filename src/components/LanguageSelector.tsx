
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, ChevronDown } from 'lucide-react';

interface CodeSnippet {
  code: string;
  language: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (snippet: CodeSnippet) => void;
  disabled?: boolean;
}

const codeSnippets: Record<string, CodeSnippet> = {
  javascript: {
    language: 'javascript',
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
  },
  python: {
    language: 'python',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)`
  },
  java: {
    language: 'java',
    code: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`
  },
  cpp: {
    language: 'cpp',
    code: `#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22};
    bubbleSort(arr);
    return 0;
}`
  },
  typescript: {
    language: 'typescript',
    code: `interface SortableArray<T> {
  data: T[];
  compare: (a: T, b: T) => number;
}

function bubbleSort<T>(sortable: SortableArray<T>): T[] {
  const arr = [...sortable.data];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (sortable.compare(arr[j], arr[j + 1]) > 0) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
  }
};

const LanguageSelector = ({ currentLanguage, onLanguageChange, disabled }: LanguageSelectorProps) => {
  const handleLanguageSelect = (language: string) => {
    if (codeSnippets[language]) {
      onLanguageChange(codeSnippets[language]);
    }
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageSelect} disabled={disabled}>
      <SelectTrigger className="w-40 bg-dark-800 border-dark-600 text-white">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-dark-800 border-dark-600">
        <SelectItem value="javascript" className="text-white hover:bg-dark-700">
          JavaScript
        </SelectItem>
        <SelectItem value="python" className="text-white hover:bg-dark-700">
          Python
        </SelectItem>
        <SelectItem value="java" className="text-white hover:bg-dark-700">
          Java
        </SelectItem>
        <SelectItem value="cpp" className="text-white hover:bg-dark-700">
          C++
        </SelectItem>
        <SelectItem value="typescript" className="text-white hover:bg-dark-700">
          TypeScript
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
export { codeSnippets };
export type { CodeSnippet };
