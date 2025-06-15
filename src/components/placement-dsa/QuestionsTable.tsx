
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionData } from '@/hooks/use-csv-questions';

interface QuestionsTableProps {
  filteredQuestions: QuestionData[];
  copiedQuestionId: number | null;
  handleCopyQuestion: (questionId: number, questionTitle: string) => void;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  filteredQuestions,
  copiedQuestionId,
  handleCopyQuestion
}) => {
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleCheckboxChange = (questionId: string, checked: boolean) => {
    const newSolvedQuestions = new Set(solvedQuestions);
    if (checked) {
      newSolvedQuestions.add(questionId);
    } else {
      newSolvedQuestions.delete(questionId);
    }
    setSolvedQuestions(newSolvedQuestions);
  };

  const progressPercentage = filteredQuestions.length > 0 
    ? (solvedQuestions.size / filteredQuestions.length) * 100 
    : 0;

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-t-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Progress</span>
          <span className="text-zinc-400">{solvedQuestions.size}/{filteredQuestions.length} solved</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <ScrollArea>
        <Table className="bg-zinc-900 border border-zinc-700 border-t-0 rounded-b-2xl">
          <TableCaption className="text-zinc-400">A list of DSA questions to prepare for placements.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Solved</TableHead>
              <TableHead className="text-left">Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="text-right">Acceptance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <TableRow 
                  key={question.id || index}
                  className="transition-colors duration-200 hover:bg-zinc-800/50"
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={solvedQuestions.has(question.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(question.id, checked as boolean)}
                      className="border-zinc-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </TableCell>
                  <TableCell className="flex items-center justify-between">
                    {question.title}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-zinc-700/50 rounded-full"
                      onClick={() => handleCopyQuestion(Number(question.id), question.title)}
                      disabled={copiedQuestionId === Number(question.id)}
                    >
                      {copiedQuestionId === Number(question.id) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        question.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                            'bg-red-500 text-white'
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.topics.join(', ')}</TableCell>
                  <TableCell className="text-right">{question.acceptance}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                      onClick={() => window.open(question.link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Solve
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-400 italic">
                  No questions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </motion.div>
  );
};

export default QuestionsTable;
