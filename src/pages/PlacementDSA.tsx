import { useState, useMemo, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, X, Check, BookOpen, AlertCircle, Star, ArrowLeft, ChevronLeft, ChevronRight, BarChart, BarChart2, PieChart, ChevronDown, ChevronUp, BarChart4, PieChartIcon, Activity } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { useCSVQuestions, QuestionData } from "@/hooks/use-csv-questions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample companies list (can be expanded)
const companies = [
  { name: 'Accolite', slug: 'accolite', category: 'Tech' },
  { name: 'Adobe', slug: 'adobe', category: 'Tech' },
  { name: 'Airbnb', slug: 'airbnb', category: 'Startup' },
  { name: 'Akamai', slug: 'akamai', category: 'Tech' },
  { name: 'Alibaba', slug: 'alibaba', category: 'E-Commerce' },
  { name: 'Amazon', slug: 'amazon', category: 'E-Commerce' },
  { name: 'American Express', slug: 'american-express', category: 'Finance' },
  { name: 'Apple', slug: 'apple', category: 'Tech' },
  { name: 'Atlassian', slug: 'atlassian', category: 'Tech' },
  { name: 'Baidu', slug: 'baidu', category: 'Tech' },
  { name: 'Bloomberg', slug: 'bloomberg', category: 'Finance' },
  { name: 'Booking.com', slug: 'booking-com', category: 'E-Commerce' },
  { name: 'ByteDance', slug: 'bytedance', category: 'Social Media' },
  { name: 'Capital One', slug: 'capital-one', category: 'Finance' },
  { name: 'Cisco', slug: 'cisco', category: 'Tech' },
  { name: 'Citadel', slug: 'citadel', category: 'Finance' },
  { name: 'Databricks', slug: 'databricks', category: 'Tech' },
  { name: 'Dell', slug: 'dell', category: 'Tech' },
  { name: 'Doordash', slug: 'doordash', category: 'Startup' },
  { name: 'Dropbox', slug: 'dropbox', category: 'Tech' },
  { name: 'eBay', slug: 'ebay', category: 'E-Commerce' },
  { name: 'Electronic Arts', slug: 'electronic-arts', category: 'Tech' },
  { name: 'Expedia', slug: 'expedia', category: 'E-Commerce' },
  { name: 'Facebook', slug: 'facebook', category: 'Social Media' },
  { name: 'Flipkart', slug: 'flipkart', category: 'E-Commerce' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', category: 'Finance' },
  { name: 'Google', slug: 'google', category: 'Tech' },
  { name: 'Grab', slug: 'grab', category: 'Startup' },
  { name: 'Hewlett Packard', slug: 'hewlett-packard', category: 'Tech' },
  { name: 'Hotstar', slug: 'hotstar', category: 'Tech' },
  { name: 'Huawei', slug: 'huawei', category: 'Tech' },
  { name: 'IBM', slug: 'ibm', category: 'Tech' },
  { name: 'Indeed', slug: 'indeed', category: 'Tech' },
  { name: 'Infosys', slug: 'infosys', category: 'Tech' },
  { name: 'Intel', slug: 'intel', category: 'Tech' },
  { name: 'Intuit', slug: 'intuit', category: 'Tech' },
  { name: 'JP Morgan', slug: 'jp-morgan', category: 'Finance' },
  { name: 'LinkedIn', slug: 'linkedin', category: 'Social Media' },
  { name: 'Lyft', slug: 'lyft', category: 'Startup' },
  { name: 'Microsoft', slug: 'microsoft', category: 'Tech' },
  { name: 'Morgan Stanley', slug: 'morgan-stanley', category: 'Finance' },
  { name: 'Netflix', slug: 'netflix', category: 'Tech' },
  { name: 'NVIDIA', slug: 'nvidia', category: 'Tech' },
  { name: 'Oracle', slug: 'oracle', category: 'Tech' },
  { name: 'Palantir', slug: 'palantir', category: 'Tech' },
  { name: 'PayPal', slug: 'paypal', category: 'Finance' },
  { name: 'Paytm', slug: 'paytm', category: 'Finance' },
  { name: 'Pinterest', slug: 'pinterest', category: 'Social Media' },
  { name: 'Qualcomm', slug: 'qualcomm', category: 'Tech' },
  { name: 'Quora', slug: 'quora', category: 'Social Media' },
  { name: 'Reddit', slug: 'reddit', category: 'Social Media' },
  { name: 'Robinhood', slug: 'robinhood', category: 'Finance' },
  { name: 'Salesforce', slug: 'salesforce', category: 'Tech' },
  { name: 'Samsung', slug: 'samsung', category: 'Tech' },
  { name: 'SAP', slug: 'sap', category: 'Tech' },
  { name: 'Snapchat', slug: 'snapchat', category: 'Social Media' },
  { name: 'Spotify', slug: 'spotify', category: 'Tech' },
  { name: 'Square', slug: 'square', category: 'Finance' },
  { name: 'Swiggy', slug: 'swiggy', category: 'Startup' },
  { name: 'Tencent', slug: 'tencent', category: 'Tech' },
  { name: 'Tesla', slug: 'tesla', category: 'Tech' },
  { name: 'TikTok', slug: 'tiktok', category: 'Social Media' },
  { name: 'Twilio', slug: 'twilio', category: 'Tech' },
  { name: 'Twitter', slug: 'twitter', category: 'Social Media' },
  { name: 'Uber', slug: 'uber', category: 'Startup' },
  { name: 'Visa', slug: 'visa', category: 'Finance' },
  { name: 'VMware', slug: 'vmware', category: 'Tech' },
  { name: 'Walmart', slug: 'walmart', category: 'E-Commerce' },
  { name: 'Yahoo', slug: 'yahoo', category: 'Tech' },
  { name: 'Yelp', slug: 'yelp', category: 'Tech' },
  { name: 'Zomato', slug: 'zomato', category: 'Startup' },
  { name: 'Zoom', slug: 'zoom', category: 'Tech' },
];

// Extended questionsData with more questions per company
const questionsData = {
  "amazon": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.8, link: "https://leetcode.com/problems/two-sum/" },
    { id: "2", title: "Add Two Numbers", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/add-two-numbers/" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard", frequency: 3.7, link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: "6", title: "ZigZag Conversion", difficulty: "Medium", frequency: 3.6, link: "https://leetcode.com/problems/zigzag-conversion/" },
    { id: "7", title: "Reverse Integer", difficulty: "Medium", frequency: 3.8, link: "https://leetcode.com/problems/reverse-integer/" },
    { id: "8", title: "String to Integer (atoi)", difficulty: "Medium", frequency: 3.9, link: "https://leetcode.com/problems/string-to-integer-atoi/" },
    { id: "9", title: "Palindrome Number", difficulty: "Easy", frequency: 4.4, link: "https://leetcode.com/problems/palindrome-number/" },
    { id: "10", title: "Regular Expression Matching", difficulty: "Hard", frequency: 3.2, link: "https://leetcode.com/problems/regular-expression-matching/" },
    { id: "11", title: "Container With Most Water", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/container-with-most-water/" },
    { id: "12", title: "Integer to Roman", difficulty: "Medium", frequency: 3.7, link: "https://leetcode.com/problems/integer-to-roman/" },
    { id: "13", title: "Roman to Integer", difficulty: "Easy", frequency: 4.3, link: "https://leetcode.com/problems/roman-to-integer/" },
    { id: "14", title: "Longest Common Prefix", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/longest-common-prefix/" },
    { id: "15", title: "3Sum", difficulty: "Medium", frequency: 4.6, link: "https://leetcode.com/problems/3sum/" },
    { id: "16", title: "3Sum Closest", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/3sum-closest/" },
    { id: "17", title: "Letter Combinations of a Phone Number", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: "18", title: "4Sum", difficulty: "Medium", frequency: 3.8, link: "https://leetcode.com/problems/4sum/" },
    { id: "19", title: "Remove Nth Node From End of List", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
    { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.7, link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: "21", title: "Merge Two Sorted Lists", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: "22", title: "Generate Parentheses", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/generate-parentheses/" },
    { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", frequency: 4.4, link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: "25", title: "Reverse Nodes in k-Group", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    { id: "26", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { id: "28", title: "Find the Index of the First Occurrence in a String", difficulty: "Easy", frequency: 4.1, link: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
    { id: "29", title: "Divide Two Integers", difficulty: "Medium", frequency: 3.6, link: "https://leetcode.com/problems/divide-two-integers/" },
    { id: "33", title: "Search in Rotated Sorted Array", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: "42", title: "Trapping Rain Water", difficulty: "Hard", frequency: 4.7, link: "https://leetcode.com/problems/trapping-rain-water/" },
    { id: "49", title: "Group Anagrams", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/group-anagrams/" },
  ],
  "google": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/two-sum/" },
    { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard", frequency: 4.2, link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: "10", title: "Regular Expression Matching", difficulty: "Hard", frequency: 3.9, link: "https://leetcode.com/problems/regular-expression-matching/" },
    { id: "17", title: "Letter Combinations of a Phone Number", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: "22", title: "Generate Parentheses", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/generate-parentheses/" },
    { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", frequency: 4.1, link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: "31", title: "Next Permutation", difficulty: "Medium", frequency: 3.8, link: "https://leetcode.com/problems/next-permutation/" },
    { id: "42", title: "Trapping Rain Water", difficulty: "Hard", frequency: 4.3, link: "https://leetcode.com/problems/trapping-rain-water/" },
    { id: "50", title: "Pow(x, n)", difficulty: "Medium", frequency: 3.5, link: "https://leetcode.com/problems/powx-n/" },
    { id: "54", title: "Spiral Matrix", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/spiral-matrix/" },
    { id: "56", title: "Merge Intervals", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/merge-intervals/" },
    { id: "66", title: "Plus One", difficulty: "Easy", frequency: 4.1, link: "https://leetcode.com/problems/plus-one/" },
    { id: "76", title: "Minimum Window Substring", difficulty: "Hard", frequency: 4.4, link: "https://leetcode.com/problems/minimum-window-substring/" },
    { id: "127", title: "Word Ladder", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/word-ladder/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.6, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "200", title: "Number of Islands", difficulty: "Medium", frequency: 4.7, link: "https://leetcode.com/problems/number-of-islands/" },
    { id: "208", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { id: "211", title: "Design Add and Search Words Data Structure", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
    { id: "239", title: "Sliding Window Maximum", difficulty: "Hard", frequency: 4.4, link: "https://leetcode.com/problems/sliding-window-maximum/" },
    { id: "253", title: "Meeting Rooms II", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/meeting-rooms-ii/" },
    { id: "295", title: "Find Median from Data Stream", difficulty: "Hard", frequency: 4.2, link: "https://leetcode.com/problems/find-median-from-data-stream/" },
    { id: "297", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", frequency: 4.1, link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    { id: "329", title: "Longest Increasing Path in a Matrix", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
    { id: "394", title: "Decode String", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/decode-string/" },
  ],
  "microsoft": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.7, link: "https://leetcode.com/problems/two-sum/" },
    { id: "2", title: "Add Two Numbers", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/add-two-numbers/" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium", frequency: 3.9, link: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: "8", title: "String to Integer (atoi)", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/string-to-integer-atoi/" },
    { id: "15", title: "3Sum", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/3sum/" },
    { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: "21", title: "Merge Two Sorted Lists", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: "33", title: "Search in Rotated Sorted Array", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  ],
  "facebook": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/two-sum/" },
    { id: "15", title: "3Sum", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/3sum/" },
    { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.4, link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", frequency: 4.2, link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: "56", title: "Merge Intervals", difficulty: "Medium", frequency: 4.6, link: "https://leetcode.com/problems/merge-intervals/" },
    { id: "76", title: "Minimum Window Substring", difficulty: "Hard", frequency: 4.3, link: "https://leetcode.com/problems/minimum-window-substring/" },
    { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", frequency: 4.7, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: "125", title: "Valid Palindrome", difficulty: "Easy", frequency: 4.4, link: "https://leetcode.com/problems/valid-palindrome/" },
    { id: "238", title: "Product of Array Except Self", difficulty: "Medium", frequency: 4.8, link: "https://leetcode.com/problems/product-of-array-except-self/" },
    { id: "973", title: "K Closest Points to Origin", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  ],
  "apple": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/two-sum/" },
    { id: "2", title: "Add Two Numbers", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/add-two-numbers/" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard", frequency: 3.5, link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium", frequency: 3.8, link: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: "21", title: "Merge Two Sorted Lists", difficulty: "Easy", frequency: 4.4, link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: "53", title: "Maximum Subarray", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/maximum-subarray/" },
    { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "200", title: "Number of Islands", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/number-of-islands/" },
  ],
  "netflix": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.0, link: "https://leetcode.com/problems/two-sum/" },
    { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", frequency: 4.1, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.7, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "200", title: "Number of Islands", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/number-of-islands/" },
    { id: "239", title: "Sliding Window Maximum", difficulty: "Hard", frequency: 4.3, link: "https://leetcode.com/problems/sliding-window-maximum/" },
    { id: "295", title: "Find Median from Data Stream", difficulty: "Hard", frequency: 4.4, link: "https://leetcode.com/problems/find-median-from-data-stream/" },
    { id: "460", title: "LFU Cache", difficulty: "Hard", frequency: 4.6, link: "https://leetcode.com/problems/lfu-cache/" },
    { id: "642", title: "Design Search Autocomplete System", difficulty: "Hard", frequency: 4.5, link: "https://leetcode.com/problems/design-search-autocomplete-system/" },
    { id: "1117", title: "Building H2O", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/building-h2o/" },
  ],
  "adobe": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.3, link: "https://leetcode.com/problems/two-sum/" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard", frequency: 3.6, link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: "53", title: "Maximum Subarray", difficulty: "Easy", frequency: 4.5, link: "https://leetcode.com/problems/maximum-subarray/" },
    { id: "138", title: "Copy List with Random Pointer", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
    { id: "139", title: "Word Break", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/word-break/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "287", title: "Find the Duplicate Number", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { id: "289", title: "Game of Life", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/game-of-life/" },
    { id: "347", title: "Top K Frequent Elements", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  ],
  "goldman-sachs": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/two-sum/" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: "122", title: "Best Time to Buy and Sell Stock II", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "155", title: "Min Stack", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/min-stack/" },
    { id: "189", title: "Rotate Array", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/rotate-array/" },
    { id: "200", title: "Number of Islands", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/number-of-islands/" },
    { id: "387", title: "First Unique Character in a String", difficulty: "Easy", frequency: 4.0, link: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
    { id: "706", title: "Design HashMap", difficulty: "Easy", frequency: 4.1, link: "https://leetcode.com/problems/design-hashmap/" },
  ],
  "uber": [
    { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.1, link: "https://leetcode.com/problems/two-sum/" },
    { id: "17", title: "Letter Combinations of a Phone Number", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: "36", title: "Valid Sudoku", difficulty: "Medium", frequency: 4.0, link: "https://leetcode.com/problems/valid-sudoku/" },
    { id: "79", title: "Word Search", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/word-search/" },
    { id: "133", title: "Clone Graph", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/clone-graph/" },
    { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/lru-cache/" },
    { id: "207", title: "Course Schedule", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/course-schedule/" },
    { id: "208", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { id: "297", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", frequency: 4.6, link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    { id: "1197", title: "Minimum Knight Moves", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/minimum-knight-moves/" },
  ],
};

// Extended default questions
const defaultQuestions = [
  { id: "1", title: "Two Sum", difficulty: "Easy", frequency: 4.8, link: "https://leetcode.com/problems/two-sum/" },
  { id: "20", title: "Valid Parentheses", difficulty: "Easy", frequency: 4.7, link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", frequency: 4.6, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "200", title: "Number of Islands", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/number-of-islands/" },
  { id: "146", title: "LRU Cache", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/lru-cache/" },
  { id: "53", title: "Maximum Subarray", difficulty: "Easy", frequency: 4.4, link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", frequency: 4.3, link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "238", title: "Product of Array Except Self", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "236", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { id: "42", title: "Trapping Rain Water", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/trapping-rain-water/" },
  { id: "15", title: "3Sum", difficulty: "Medium", frequency: 4.5, link: "https://leetcode.com/problems/3sum/" },
  { id: "11", title: "Container With Most Water", difficulty: "Medium", frequency: 4.4, link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", frequency: 4.3, link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: "33", title: "Search in Rotated Sorted Array", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "56", title: "Merge Intervals", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/merge-intervals/" },
  { id: "76", title: "Minimum Window Substring", difficulty: "Hard", frequency: 4.0, link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "98", title: "Validate Binary Search Tree", difficulty: "Medium", frequency: 4.2, link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "105", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", frequency: 4.1, link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "141", title: "Linked List Cycle", difficulty: "Easy", frequency: 4.3, link: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: "155", title: "Min Stack", difficulty: "Easy", frequency: 4.2, link: "https://leetcode.com/problems/min-stack/" },
];

const timeFrames = ['6 Months', '1 Year', '2 Years', 'All Time'];

// Create a custom hook to check if CSV data exists for a company
function useCSVExists(companySlug: string): boolean {
  const [exists, setExists] = useState<boolean>(false);
  
  useEffect(() => {
    const checkCSVExists = async () => {
      try {
        const response = await fetch(`/csv/${companySlug}_alltime.csv`);
        setExists(response.ok);
      } catch {
        setExists(false);
      }
    };
    
    checkCSVExists();
  }, [companySlug]);
  
  return exists;
}

// Add topic data to questions
const questionTopics = {
  "1": "Array",
  "2": "Linked List",
  "3": "String",
  "4": "Binary Search",
  "5": "String",
  "11": "Array",
  "15": "Array",
  "20": "Stack",
  "21": "Linked List",
  "23": "Heap",
  "33": "Binary Search",
  "42": "Dynamic Programming",
  "53": "Dynamic Programming",
  "56": "Array",
  "76": "String",
  "79": "Backtracking",
  "98": "Tree",
  "121": "Dynamic Programming",
  "125": "String",
  "141": "Linked List",
  "146": "Hash Table",
  "155": "Stack",
  "200": "Graph",
  "208": "Trie",
  "238": "Array",
  "287": "Array",
  "295": "Heap",
  "297": "Tree",
};

// Default topics
const defaultTopics = [
  "Array", "String", "Linked List", "Tree", "Hash Table", 
  "Dynamic Programming", "Graph", "Binary Search", "Stack", 
  "Heap", "Backtracking", "Trie"
];

const PlacementDSA = () => {
  const { toast } = useToast();
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFrame, setTimeFrame] = useState<'6 Months' | '1 Year' | '2 Years' | 'All Time'>('All Time');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [solvedQuestions, setSolvedQuestions] = useLocalStorage<string[]>('solved-questions', []);
  const [filters, setFilters] = useState({
    difficulty: 'All',
    minFrequency: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [useHardcodedData, setUseHardcodedData] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Fetch CSV questions data
  const { 
    questions: csvQuestions, 
    isLoading: csvLoading, 
    error: csvError
  } = useCSVQuestions(selectedCompany, timeFrame);
  
  // Update loading state based on CSV data
  useEffect(() => {
    if (selectedCompany && csvLoading) {
      setIsLoading(true);
    } else {
      // Simulate loading for UI smoothness
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, selectedCompany ? 500 : 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCompany, csvLoading]);
  
  // Show toast when CSV data is not available
  useEffect(() => {
    if (csvError && selectedCompany) {
      toast({
        title: "Data Not Available",
        description: "Showing default questions instead. CSV data unavailable for this company.",
        variant: "destructive",
        duration: 5000,
      });
      setUseHardcodedData(true);
    } else if (selectedCompany && csvQuestions.length > 0) {
      setUseHardcodedData(false);
    } else if (selectedCompany && csvQuestions.length === 0 && !csvLoading && !csvError) {
      // If we have a selected company but no CSV questions and no error
      setUseHardcodedData(true);
    }
  }, [csvError, selectedCompany, csvQuestions, csvLoading, toast]);
  
  // Reset to page 1 when company or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany, filters, timeFrame]);

  // Pagination
  const QUESTIONS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Companies filtering logic
  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(company => company.category === categoryFilter);
    }
    
    // Apply search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, categoryFilter]);

  // Questions filtering logic with pagination
  const allFilteredQuestions = useMemo(() => {
    if (!selectedCompany) return [];
    
    // Use CSV data if available, otherwise fall back to hardcoded data
    let questions = [];
    
    if (!useHardcodedData && csvQuestions.length > 0) {
      questions = csvQuestions;
    } else {
      // Fallback to hardcoded data
      const hardcodedQuestions = questionsData[selectedCompany as keyof typeof questionsData];
      
      // If no hardcoded questions data exists for this company, return default questions
      questions = hardcodedQuestions || defaultQuestions;
    }
    
    return questions.filter(q => {
      const difficultyMatch = filters.difficulty === 'All' || q.difficulty === filters.difficulty;
      const frequencyMatch = q.frequency >= filters.minFrequency;
      const searchMatch = !questionSearchTerm || 
        q.title.toLowerCase().includes(questionSearchTerm.toLowerCase()) || 
        q.id.toLowerCase().includes(questionSearchTerm.toLowerCase());
      
      return difficultyMatch && frequencyMatch && searchMatch;
    });
  }, [selectedCompany, filters, csvQuestions, useHardcodedData, questionSearchTerm]);

  // Paginated questions
  const filteredQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return allFilteredQuestions.slice(startIndex, endIndex);
  }, [allFilteredQuestions, currentPage]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.ceil(allFilteredQuestions.length / QUESTIONS_PER_PAGE);
  }, [allFilteredQuestions]);

  // Page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // Scroll to top of questions list
      document.getElementById('questions-list')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      // Scroll to top of questions list
      document.getElementById('questions-list')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of questions list
    document.getElementById('questions-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Notify user when selecting a company with generic questions
  useEffect(() => {
    if (selectedCompany && !questionsData[selectedCompany as keyof typeof questionsData]) {
      toast({
        title: "Generic Questions",
        description: "We're showing common DSA questions as specific data for this company is not available yet.",
        variant: "default",
        duration: 5000,
      });
    }
  }, [selectedCompany, toast]);

  // Helper functions
  const toggleSolvedQuestion = (questionId: string) => {
    setSolvedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const backToCompanies = () => {
    setSelectedCompany(null);
  };

  // Stats calculations
  const statsData = useMemo(() => {
    const easySolved = allFilteredQuestions.filter(q => q.difficulty === 'Easy' && solvedQuestions.includes(q.id)).length;
    const mediumSolved = allFilteredQuestions.filter(q => q.difficulty === 'Medium' && solvedQuestions.includes(q.id)).length;
    const hardSolved = allFilteredQuestions.filter(q => q.difficulty === 'Hard' && solvedQuestions.includes(q.id)).length;
    
    const totalSolved = easySolved + mediumSolved + hardSolved;
    const easyCount = allFilteredQuestions.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = allFilteredQuestions.filter(q => q.difficulty === 'Medium').length;
    const hardCount = allFilteredQuestions.filter(q => q.difficulty === 'Hard').length;
    
    return {
      totalSolved,
      easyCount,
      mediumCount,
      hardCount,
      easySolved,
      mediumSolved,
      hardSolved,
      totalQuestions: allFilteredQuestions.length
    };
  }, [allFilteredQuestions, solvedQuestions]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Question topic distribution for charts
  const topicDistribution = useMemo(() => {
    if (!selectedCompany) return [];
    
    const topics: Record<string, number> = {};
    const solvedTopics: Record<string, number> = {};
    
    allFilteredQuestions.forEach(question => {
      // Get topic or assign default based on id
      const topic = (questionTopics as any)[question.id] || 
        defaultTopics[Number(question.id) % defaultTopics.length];
      
      // Count topics
      topics[topic] = (topics[topic] || 0) + 1;
      
      // Count solved topics
      if (solvedQuestions.includes(question.id)) {
        solvedTopics[topic] = (solvedTopics[topic] || 0) + 1;
      }
    });
    
    return Object.entries(topics).map(([name, count]) => ({
      name,
      total: count,
      solved: solvedTopics[name] || 0,
      percentage: Math.round(((solvedTopics[name] || 0) / count) * 100)
    })).sort((a, b) => b.total - a.total);
  }, [allFilteredQuestions, solvedQuestions, selectedCompany]);
  
  // Difficulty breakdown for analytics
  const difficultyBreakdown = useMemo(() => {
    return [
      { 
        name: 'Easy', 
        count: statsData.easyCount, 
        solved: statsData.easySolved,
        color: 'bg-green-500',
        percentage: statsData.easyCount 
          ? Math.round((statsData.easySolved / statsData.easyCount) * 100) 
          : 0
      },
      { 
        name: 'Medium', 
        count: statsData.mediumCount, 
        solved: statsData.mediumSolved,
        color: 'bg-yellow-500',
        percentage: statsData.mediumCount 
          ? Math.round((statsData.mediumSolved / statsData.mediumCount) * 100) 
          : 0
      },
      { 
        name: 'Hard', 
        count: statsData.hardCount, 
        solved: statsData.hardSolved,
        color: 'bg-red-500',
        percentage: statsData.hardCount 
          ? Math.round((statsData.hardSolved / statsData.hardCount) * 100) 
          : 0
      },
    ];
  }, [statsData]);

  // Fix the click handlers for company cards (both grid and list views)
  const handleCompanyClick = (companySlug: string) => {
    // Short timeout to prevent click interference issues
    setTimeout(() => {
      setSelectedCompany(companySlug);
    }, 50);
  };

  // UI rendering
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-950 to-dark-900 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            >
              {!selectedCompany ? (
                <>DSA Practice</>
              ) : null}
            </motion.h1>
            {!selectedCompany && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 max-w-2xl mx-auto"
              >
                Practice DSA interview questions from top companies across different industries
              </motion.p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!selectedCompany ? (
                // Companies view
                <motion.div
                  key="companies"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative w-full sm:w-[400px]">
                      <Input
                        type="text"
                        placeholder="Search companies..."
                        className="bg-dark-800/80 border-dark-700 pl-12 pr-12 h-14 rounded-lg text-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={22} />
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors z-20"
                        >
                          <X size={22} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[160px] bg-dark-800/80 border-dark-700 h-10 focus:ring-2 focus:ring-blue-500/50 transition-all z-20">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700 z-30">
                          <SelectItem value="All">All Categories</SelectItem>
                          <SelectItem value="Tech">Tech</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Startup">Startup</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700 transition-colors' : 'border-dark-700 hover:bg-dark-800/70 transition-colors'}
                      >
                        <Grid size={18} />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700 transition-colors' : 'border-dark-700 hover:bg-dark-800/70 transition-colors'}
                      >
                        <List size={18} />
                      </Button>
                    </div>
                  </motion.div>

                  {/* Show active filters */}
                  {(categoryFilter !== 'All' || searchTerm) && (
                    <motion.div
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-6 flex flex-wrap gap-2 items-center"
                    >
                      <span className="text-sm text-gray-400">Active filters:</span>
                      {categoryFilter !== 'All' && (
                        <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 transition-colors">
                          {categoryFilter}
                        </Badge>
                      )}
                      {searchTerm && (
                        <Badge className="bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
                          <Search size={10} />
                          {searchTerm}
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {setCategoryFilter('All'); setSearchTerm('');}}
                        className="text-xs text-gray-400 hover:text-gray-300 ml-2"
                      >
                        Clear all
                      </Button>
                    </motion.div>
                  )}

                  {filteredCompanies.length === 0 ? (
                    <motion.div
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-center py-16 bg-dark-900/50 rounded-lg border border-dark-800"
                    >
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No companies found matching your criteria.</p>
                      <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                    </motion.div>
                  ) : viewMode === 'grid' ? (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-10"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredCompanies.map((company, index) => (
                        <motion.div
                          key={company.slug}
                          variants={cardVariants}
                          className="cursor-pointer relative z-10"
                          onClick={() => handleCompanyClick(company.slug)}
                          whileHover={{ 
                            scale: 1.03,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="h-full bg-gradient-to-br from-dark-900 to-dark-800 border-dark-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <CardHeader className="pb-2 relative">
                              <CardTitle className="text-lg flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  {company.name}
                                  {company.slug === 'amazon' || company.slug === 'google' || company.slug === 'microsoft' ? (
                                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                                  ) : null}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full
                                  ${company.category === 'Tech' ? 'bg-blue-500/10 text-blue-300' : 
                                    company.category === 'Finance' ? 'bg-green-500/10 text-green-300' : 
                                    company.category === 'Startup' ? 'bg-purple-500/10 text-purple-300' : 
                                    company.category === 'Social Media' ? 'bg-pink-500/10 text-pink-300' : 
                                    'bg-amber-500/10 text-amber-300'}
                                `}>
                                  {company.category}
                                </span>
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                DSA questions available
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="mt-3 flex justify-end">
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-4 group transition-all duration-300 z-20"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent the parent click handler from firing
                                    handleCompanyClick(company.slug);
                                  }}
                                >
                                  <span className="mr-2">View Questions</span>
                                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-3 relative z-10"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredCompanies.map((company) => (
                        <motion.div
                          key={company.slug}
                          variants={cardVariants}
                          whileHover={{ 
                            scale: 1.01,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                          }}
                          whileTap={{ scale: 0.99 }}
                          className="cursor-pointer relative z-10"
                          onClick={() => handleCompanyClick(company.slug)}
                        >
                          <Card className="bg-gradient-to-r from-dark-900 to-dark-900/95 border-dark-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                            <div className="flex justify-between items-center p-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <h3 className="font-semibold text-white">{company.name}</h3>
                                    {company.slug === 'amazon' || company.slug === 'google' || company.slug === 'microsoft' ? (
                                      <Star className="ml-2 h-4 w-4 text-yellow-400" fill="currentColor" />
                                    ) : null}
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full
                                    ${company.category === 'Tech' ? 'bg-blue-500/10 text-blue-300' : 
                                      company.category === 'Finance' ? 'bg-green-500/10 text-green-300' : 
                                      company.category === 'Startup' ? 'bg-purple-500/10 text-purple-300' : 
                                      company.category === 'Social Media' ? 'bg-pink-500/10 text-pink-300' : 
                                      'bg-amber-500/10 text-amber-300'}
                                  `}>
                                    {company.category}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                  DSA questions available
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-4 group transition-all duration-300 z-20"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent the parent click handler from firing
                                  handleCompanyClick(company.slug);
                                }}
                              >
                                <span className="mr-2">View</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                // Company questions view
                <motion.div
                  key="company-questions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Button 
                      onClick={backToCompanies}
                      variant="outline"
                      className="border-dark-700 hover:bg-dark-800 transition-all group z-20"
                    >
                      <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                      Back to Companies
                    </Button>
                    
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl md:text-2xl font-bold capitalize flex items-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                          {selectedCompany.replace('-', ' ')}
                        </span>
                        <span className="ml-2 text-white">Questions</span>
                        {(selectedCompany === 'amazon' || selectedCompany === 'google' || selectedCompany === 'microsoft') && (
                          <Star className="ml-2 h-5 w-5 text-yellow-400" fill="currentColor" />
                        )}
                      </h2>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={timeFrame} onValueChange={(value: '6 Months' | '1 Year' | '2 Years' | 'All Time') => setTimeFrame(value)}>
                        <SelectTrigger className="w-[140px] bg-dark-800/80 border-dark-700 focus:ring-2 focus:ring-blue-500/50 transition-all z-20">
                          <SelectValue placeholder={timeFrame} />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700 z-50">
                          {timeFrames.map(frame => (
                            <SelectItem key={frame} value={frame}>
                              {frame}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="bg-dark-800/80 border-dark-700 focus:ring-2 focus:ring-blue-500/50 transition-all group z-20"
                          >
                            <BarChart2 size={16} className="mr-2 text-blue-400" />
                            <span>Analysis</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-dark-900 border-dark-700 text-white scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-dark-800 z-50">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-blue-400">
                              {selectedCompany.replace('-', ' ')} Question Analysis
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Insights and statistics about your progress
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700 flex flex-col items-center justify-center">
                              <div className="text-2xl font-bold text-white">
                                {allFilteredQuestions.length}
                              </div>
                              <div className="text-xs text-gray-400">Total Questions</div>
                            </div>
                            
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700 flex flex-col items-center justify-center">
                              <div className="text-2xl font-bold text-white">
                                {statsData.totalSolved}
                              </div>
                              <div className="text-xs text-gray-400">Questions Solved</div>
                            </div>
                            
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700 flex flex-col items-center justify-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {statsData.totalSolved === 0 ? "0%" : Math.round((statsData.totalSolved / statsData.totalQuestions) * 100) + "%"}
                              </div>
                              <div className="text-xs text-gray-400">Completion Rate</div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                              <PieChartIcon size={14} className="mr-2 text-blue-400" />
                              Difficulty Distribution
                            </h3>
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700">
                              <div className="flex items-center mb-2">
                                <div className="w-full bg-dark-700 h-5 rounded-full overflow-hidden flex">
                                  {difficultyBreakdown.map(item => (
                                    <div 
                                      key={item.name}
                                      className={`${item.color} h-full`} 
                                      style={{ 
                                        width: `${Math.max(1, (item.count / Math.max(1, statsData.totalQuestions)) * 100)}%`,
                                        opacity: item.solved > 0 ? 1 : 0.5 
                                      }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                {difficultyBreakdown.map(item => (
                                  <div key={item.name} className="flex flex-col">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${item.color} mr-1`}></div>
                                        <span className="text-xs font-medium">{item.name}</span>
                                      </div>
                                      <span className="text-xs">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-dark-700 h-1 rounded-full mt-1">
                                      <div 
                                        className={`${item.color} h-full rounded-full`} 
                                        style={{ width: `${Math.max(2, item.percentage)}%` }}
                                      ></div>
                                    </div>
                                    <div className="flex justify-between mt-0.5 text-xs text-gray-400">
                                      <span>{item.solved} solved</span>
                                      <span>{item.percentage}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                              <Activity size={14} className="mr-2 text-blue-400" />
                              Topic Distribution
                            </h3>
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700 max-h-[170px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-dark-800">
                              <div className="space-y-3">
                                {topicDistribution.map(topic => (
                                  <div key={topic.name} className="space-y-0.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-xs font-medium">{topic.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{topic.solved}/{topic.total}</span>
                                        <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
                                          {topic.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-dark-700 h-1.5 rounded-full">
                                      <div 
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" 
                                        style={{ width: `${Math.max(2, topic.percentage)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                                
                                {topicDistribution.length === 0 && (
                                  <div className="text-center text-gray-400 py-4">
                                    No data available for topic analysis.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                              <BarChart4 size={14} className="mr-2 text-blue-400" />
                              Focus Recommendations
                            </h3>
                            <div className="bg-dark-800/50 p-3 rounded-lg border border-dark-700">
                              {statsData.mediumCount > statsData.mediumSolved && (
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="mt-0.5">
                                    <ChevronRight size={14} className="text-yellow-400" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-yellow-300">Focus on Medium difficulty questions</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Medium questions appear most frequently in interviews.</p>
                                  </div>
                                </div>
                              )}
                              
                              {topicDistribution.length > 0 && (
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="mt-0.5">
                                    <ChevronRight size={14} className="text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-blue-300">Strengthen your {topicDistribution[0].name} skills</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Most common topic ({topicDistribution[0].total} questions).
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {statsData.totalSolved < statsData.totalQuestions * 0.5 && (
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">
                                    <ChevronRight size={14} className="text-green-400" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-green-300">Improve your overall completion rate</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Current rate: {statsData.totalSolved === 0 ? "0%" : Math.round((statsData.totalSolved / statsData.totalQuestions) * 100) + "%"}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative w-full md:w-[400px]">
                      <Input
                        type="text"
                        placeholder="Search questions..."
                        className="bg-dark-800/80 border-dark-700 pl-12 pr-12 h-14 rounded-lg text-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={questionSearchTerm}
                        onChange={(e) => setQuestionSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                      {questionSearchTerm && (
                        <button
                          onClick={() => setQuestionSearchTerm('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          <X size={22} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      <Select 
                        value={filters.difficulty} 
                        onValueChange={(value) => setFilters(prev => ({...prev, difficulty: value}))}
                      >
                        <SelectTrigger className="w-[140px] bg-dark-800/80 border-dark-700 h-10 focus:ring-2 focus:ring-blue-500/50 transition-all">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700">
                          <SelectItem value="All">All Difficulties</SelectItem>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        type="number"
                        placeholder="Min Frequency"
                        className="bg-dark-800/80 border-dark-700 w-[140px] h-10 focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={filters.minFrequency || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev, 
                          minFrequency: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    id="questions-list"
                    className="mt-4 space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-5 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-900/30 p-3">
                      <div className="flex flex-col gap-2">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-blue-300">Your Progress</h3>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                              {statsData.totalSolved === 0 ? "0%" : Math.round((statsData.totalSolved / (statsData.totalQuestions || 1)) * 100) + "%"} Complete
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-white flex items-baseline">
                              {statsData.totalSolved}
                              <span className="text-gray-400 text-xs ml-2">/ {statsData.totalQuestions} completed</span>
                            </div>
                          </div>
                          <div className="w-full bg-dark-800 rounded-full h-1.5 mt-1.5">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full" 
                              style={{ width: statsData.totalSolved === 0 ? '0%' : `${Math.max(2, (statsData.totalSolved / (statsData.totalQuestions || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-0.5">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <div className="text-xs">
                              <span className="text-green-300 font-medium">{statsData.easySolved}/{statsData.easyCount}</span>
                              <span className="text-gray-400 ml-1">Easy</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <div className="text-xs">
                              <span className="text-yellow-300 font-medium">{statsData.mediumSolved}/{statsData.mediumCount}</span>
                              <span className="text-gray-400 ml-1">Medium</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <div className="text-xs">
                              <span className="text-red-300 font-medium">{statsData.hardSolved}/{statsData.hardCount}</span>
                              <span className="text-gray-400 ml-1">Hard</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center border-t border-blue-900/30 pt-1.5 mt-1">
                          <div className="flex gap-1.5 items-center text-xs">
                            <div className="text-gray-400">Tip:</div>
                            <div className="text-blue-300">Focus on medium difficulty questions for interviews</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {filteredQuestions.length > 0 ? (
                      <>
                        {filteredQuestions.map((question) => (
                          <motion.div
                            key={question.id}
                            variants={cardVariants}
                            whileHover={{ 
                              scale: 1.01,
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                            }}
                            className="relative z-10"
                          >
                            <Card className={`bg-gradient-to-r from-dark-900 to-dark-900/95 border-dark-800 hover:bg-dark-800/50 transition-all duration-300 overflow-hidden ${
                              solvedQuestions.includes(question.id) ? 'border-l-4 border-l-green-500' : ''
                            }`}>
                              <div className="p-4 sm:p-5 relative">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                  {/* Question ID Badge - Absolute positioned */}
                                  <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-dark-800/80 text-gray-400 backdrop-blur-sm z-10">
                                    #{question.id}
                                  </div>
                                  
                                  {/* Question Title - 5 columns */}
                                  <div className="col-span-12 md:col-span-5">
                                    <h3 className="font-medium text-white mb-2 pr-12">
                                      {question.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm flex-wrap mt-1">
                                      <span className={`px-2 py-0.5 rounded-full ${
                                        question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                                        question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                        'bg-red-500/20 text-red-500 border border-red-500/30'
                                      }`}>
                                        {question.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Acceptance - 2 columns */}
                                  <div className="col-span-6 md:col-span-2 text-center">
                                    <div className="text-xs text-gray-400 mb-1">Acceptance</div>
                                    {'acceptance' in question && question.acceptance ? (
                                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-sm border border-purple-500/30 inline-flex justify-center items-center">
                                        {String(question.acceptance)}
                                      </span>
                                    ) : (
                                      <span className="text-gray-500 text-sm">N/A</span>
                                    )}
                                  </div>
                                  
                                  {/* Frequency - 2 columns */}
                                  <div className="col-span-6 md:col-span-2 text-center">
                                    <div className="text-xs text-gray-400 mb-1">Frequency</div>
                                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full flex items-center justify-center text-sm border border-blue-500/30">
                                      <Star className="h-3 w-3 mr-1" fill="currentColor" />
                                      {question.frequency.toFixed(1)}
                                    </span>
                                  </div>
                                  
                                  {/* Actions - 3 columns */}
                                  <div className="col-span-12 md:col-span-3 flex justify-end gap-2 mt-2 md:mt-0">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className={solvedQuestions.includes(question.id) 
                                              ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 transition-colors z-20" 
                                              : "border-dark-700 hover:border-green-500 hover:text-green-500 transition-colors z-20"
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleSolvedQuestion(question.id);
                                            }}
                                          >
                                            <Check size={18} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="z-50">
                                          {solvedQuestions.includes(question.id) ? "Mark as unsolved" : "Mark as solved"}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 group transition-all duration-300 z-20"
                                      onClick={() => window.open(question.link, '_blank')}
                                    >
                                      <BookOpen size={16} className="mr-2" />
                                      <span className="mr-1">Solve</span>
                                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                        
                        {/* Add filter summary badge and pagination info */}
                        <div className="flex items-center justify-between mt-4 mb-2">
                          <div className="flex flex-wrap gap-2">
                            {filters.difficulty !== 'All' && (
                              <Badge variant="outline" className="bg-dark-800 border-dark-700 hover:bg-dark-700/70 transition-colors">
                                {filters.difficulty === 'Easy' ? (
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                    {filters.difficulty}
                                  </span>
                                ) : filters.difficulty === 'Medium' ? (
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                                    {filters.difficulty}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                    {filters.difficulty}
                                  </span>
                                )}
                              </Badge>
                            )}
                            {filters.minFrequency > 0 && (
                              <Badge variant="outline" className="bg-dark-800 border-dark-700 hover:bg-dark-700/70 transition-colors flex items-center gap-1">
                                <Star className="h-3 w-3 mr-1" />
                                Min Frequency: {filters.minFrequency}
                              </Badge>
                            )}
                            {questionSearchTerm && (
                              <Badge variant="outline" className="bg-dark-800 border-dark-700 hover:bg-dark-700/70 transition-colors flex items-center gap-1">
                                <Search size={10} />
                                "{questionSearchTerm}"
                              </Badge>
                            )}
                            {(filters.difficulty !== 'All' || filters.minFrequency > 0 || questionSearchTerm) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setFilters({difficulty: 'All', minFrequency: 0});
                                  setQuestionSearchTerm('');
                                }}
                                className="text-xs text-gray-400 hover:text-gray-300 ml-2"
                              >
                                Clear all
                              </Button>
                            )}
                          </div>
                          
                          <span className="text-sm text-gray-400">
                            {filteredQuestions.length > 0 ? (
                              <>
                                Showing {(currentPage - 1) * QUESTIONS_PER_PAGE + 1}-
                                {Math.min(currentPage * QUESTIONS_PER_PAGE, allFilteredQuestions.length)} of {allFilteredQuestions.length} questions
                              </>
                            ) : null}
                          </span>
                        </div>
                        
                        {/* Improve pagination controls */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center mt-8 space-x-2 mb-4 relative z-20">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={goToPrevPage}
                              disabled={currentPage === 1}
                              className="border-dark-700 hover:bg-dark-800 disabled:opacity-50 transition-colors z-30"
                            >
                              <ChevronLeft size={16} />
                            </Button>
                            
                            <div className="flex space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                  // Show first page, last page, current page, and pages around current
                                  return page === 1 || 
                                        page === totalPages || 
                                        Math.abs(page - currentPage) <= 1;
                                })
                                .map((page, index, array) => {
                                  // If there's a gap, show ellipsis
                                  const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                  
                                  return (
                                    <React.Fragment key={page}>
                                      {showEllipsisBefore && (
                                        <div className="flex items-center justify-center w-8 h-8 text-gray-400">...</div>
                                      )}
                                      <Button
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => goToPage(page)}
                                        className={currentPage === page ? 
                                          "bg-blue-600 hover:bg-blue-700 min-w-8 h-8 px-3 transition-colors z-30" : 
                                          "border-dark-700 hover:bg-dark-800 min-w-8 h-8 px-3 transition-colors z-30"
                                        }
                                      >
                                        {page}
                                      </Button>
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={goToNextPage}
                              disabled={currentPage === totalPages}
                              className="border-dark-700 hover:bg-dark-800 disabled:opacity-50 transition-colors z-30"
                            >
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <motion.div 
                        className="text-center py-16 bg-dark-900/50 rounded-lg border border-dark-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No questions found matching your criteria.</p>
                        <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlacementDSA; 
