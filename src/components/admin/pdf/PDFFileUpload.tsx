
import React, { useRef } from "react";
import { File, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PDFFileUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export const PDFFileUpload: React.FC<PDFFileUploadProps> = ({
  selectedFile,
  setSelectedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file" className="mb-2 block text-gray-300 text-sm">
        PDF File
      </Label>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <div className="relative cursor-pointer bg-dark-800 border border-dashed border-dark-600 rounded-md p-6 text-center hover:bg-dark-700/50 transition-colors">
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <File className="h-6 w-6 text-green-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white truncate max-w-[300px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-gray-400 hover:text-white hover:bg-dark-600"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-500">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PDF files only (Max 10MB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
        </label>
      </div>
    </div>
  );
};
