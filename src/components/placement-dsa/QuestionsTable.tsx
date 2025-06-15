
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from 'lucide-react';
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

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <ScrollArea>
        <Table className="bg-zinc-900 border border-zinc-700 rounded-2xl">
          <TableCaption className="text-zinc-400">A list of DSA questions to prepare for placements.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">ID</TableHead>
              <TableHead className="text-left">Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="text-right">Frequency</TableHead>
              <TableHead className="text-right">Acceptance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <TableRow 
                  key={question.id || index}
                  className="transition-colors duration-200 hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium text-center">{question.id}</TableCell>
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
                  <TableCell className="text-right">{question.frequency}</TableCell>
                  <TableCell className="text-right">{question.acceptance}</TableCell>
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
