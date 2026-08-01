import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onFileUpload]);

  return (
    <label
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        disabled ? 'bg-slate-200 border-slate-300 opacity-50' : 
        isDragging ? 'bg-blue-100/50 border-blue-500' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
      }`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadIcon />
        {fileName ? (
            <p className="mt-2 text-sm text-blue-600 font-semibold px-2 truncate">{fileName}</p>
        ) : (
            <>
                <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">PDF (MAX. 10MB)</p>
            </>
        )}
      </div>
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        accept="application/pdf"
        onChange={(e) => handleFileChange(e.target.files)}
        disabled={disabled}
      />
    </label>
  );
};

export default FileUpload;