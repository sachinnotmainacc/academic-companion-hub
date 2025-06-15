
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check, ExternalLink, Trophy, Target, Zap } from 'lucide-react';
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

  // Calculate stats by difficulty
  const easyQuestions = filteredQuestions.filter(q => q.difficulty === 'Easy');
  const mediumQuestions = filteredQuestions.filter(q => q.difficulty === 'Medium');
  const hardQuestions = filteredQuestions.filter(q => q.difficulty === 'Hard');

  const easySolved = easyQuestions.filter(q => solvedQuestions.has(q.id)).length;
  const mediumSolved = mediumQuestions.filter(q => solvedQuestions.has(q.id)).length;
  const hardSolved = hardQuestions.filter(q => solvedQuestions.has(q.id)).length;

  const totalSolved = solvedQuestions.size;
  const totalQuestions = filteredQuestions.length;
  const progressPercentage = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  const easyProgress = easyQuestions.length > 0 ? (easySolved / easyQuestions.length) * 100 : 0;
  const mediumProgress = mediumQuestions.length > 0 ? (mediumSolved / mediumQuestions.length) * 100 : 0;
  const hardProgress = hardQuestions.length > 0 ? (hardSolved / hardQuestions.length) * 100 : 0;

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      {/* Premium Progress Section */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-t-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Trophy className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Progress Tracker</h3>
              <p className="text-zinc-400 text-sm">Track your coding journey</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalSolved}/{totalQuestions}</div>
            <div className="text-zinc-400 text-sm">Questions Solved</div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Overall Progress</span>
            <span className="text-zinc-300 font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-zinc-800 rounded-full overflow-hidden"
          />
        </div>

        {/* Difficulty Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Easy Progress */}
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                <Zap className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-green-400 font-medium">Easy</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Solved</span>
                <span className="text-white font-medium">{easySolved}/{easyQuestions.length}</span>
              </div>
              <Progress 
                value={easyProgress} 
                className="h-2 bg-zinc-700 rounded-full overflow-hidden"
              />
              <div className="text-right text-xs text-zinc-400">{Math.round(easyProgress)}%</div>
            </div>
          </div>

          {/* Medium Progress */}
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <Target className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-yellow-400 font-medium">Medium</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Solved</span>
                <span className="text-white font-medium">{mediumSolved}/{mediumQuestions.length}</span>
              </div>
              <Progress 
                value={mediumProgress} 
                className="h-2 bg-zinc-700 rounded-full overflow-hidden"
              />
              <div className="text-right text-xs text-zinc-400">{Math.round(mediumProgress)}%</div>
            </div>
          </div>

          {/* Hard Progress */}
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                <Trophy className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-red-400 font-medium">Hard</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Solved</span>
                <span className="text-white font-medium">{hardSolved}/{hardQuestions.length}</span>
              </div>
              <Progress 
                value={hardProgress} 
                className="h-2 bg-zinc-700 rounded-full overflow-hidden"
              />
              <div className="text-right text-xs text-zinc-400">{Math.round(hardProgress)}%</div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea>
        <Table className="bg-zinc-900 border border-zinc-700 border-t-0 rounded-b-2xl">
          <TableCaption className="text-zinc-400 pb-6">A curated list of DSA questions to ace your placement interviews.</TableCaption>
          <TableHeader>
            <TableRow className="border-zinc-700 hover:bg-zinc-800/30">
              <TableHead className="text-left text-zinc-300 font-semibold">Title</TableHead>
              <TableHead className="text-zinc-300 font-semibold">Difficulty</TableHead>
              <TableHead className="text-zinc-300 font-semibold">Topics</TableHead>
              <TableHead className="text-right text-zinc-300 font-semibold">Acceptance</TableHead>
              <TableHead className="text-right w-[200px] text-zinc-300 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <TableRow 
                  key={question.id || index}
                  className="transition-all duration-200 hover:bg-zinc-800/50 border-zinc-700/50"
                >
                  <TableCell className="flex items-center justify-between py-4">
                    <span className="text-white font-medium">{question.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-zinc-700/50 rounded-full ml-2 flex-shrink-0"
                      onClick={() => handleCopyQuestion(Number(question.id), question.title)}
                      disabled={copiedQuestionId === Number(question.id)}
                    >
                      {copiedQuestionId === Number(question.id) ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-400 hover:text-white" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/30 font-medium' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-medium' :
                            'bg-red-500/20 text-red-400 border-red-500/30 font-medium'
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">{question.topics.join(', ')}</TableCell>
                  <TableCell className="text-right text-zinc-300 font-medium">{question.acceptance}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <label 
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-600 hover:border-zinc-500 transition-colors cursor-pointer"
                        htmlFor={`checkbox-${question.id}`}
                      >
                        <Checkbox
                          id={`checkbox-${question.id}`}
                          checked={solvedQuestions.has(question.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(question.id, checked as boolean)}
                          className="w-5 h-5 border-zinc-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                        onClick={() => window.open(question.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Solve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-400 italic py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 text-zinc-500" />
                    <span>No questions found matching your criteria.</span>
                  </div>
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
