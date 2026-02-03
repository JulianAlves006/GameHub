import React, { useRef, useState } from 'react';
import { FaUpload, FaImage, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface FileInputProps {
  id?: string;
  name?: string;
  accept?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  id,
  name,
  accept = 'image/*',
  value,
  onChange,
  label,
  placeholder = 'Selecionar arquivo',
  disabled = false,
  error,
  maxSize = 5, // 5MB default
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    // Check file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      alert('Tipo de arquivo não suportado');
      return;
    }

    onChange(file);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('flex flex-col w-[60%] my-2.5 self-center', className)}>
      {label && (
        <label
          htmlFor={id}
          className='text-sm font-semibold text-foreground mb-2'
        >
          {label}
        </label>
      )}

      <button
        type='button'
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        disabled={disabled}
        className={cn(
          'text-foreground bg-transparent p-2.5 rounded-lg',
          'border border-border w-full my-2.5',
          'text-sm font-medium min-h-[40px]',
          'flex items-center justify-center',
          'transition-all cursor-pointer',
          'hover:brightness-125',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          dragActive && 'border-primary bg-primary/10',
          value && 'border-secondary',
          error && 'border-destructive'
        )}
      >
        <div className='flex items-center gap-2 min-w-0 w-full'>
          {value ? (
            <>
              <FaImage size={20} className='shrink-0' />
              <span className='font-semibold text-primary text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1'>
                {value.name.length > 20
                  ? `${value.name.substring(0, 20)}...`
                  : value.name}
              </span>
              <span className='text-xs shrink-0 hidden sm:inline'>
                ({formatFileSize(value.size)})
              </span>
              <button
                onClick={handleRemove}
                type='button'
                className={cn(
                  'flex items-center justify-center shrink-0',
                  'w-5 h-5 rounded-full',
                  'bg-destructive text-white border-none',
                  'cursor-pointer transition-all',
                  'hover:bg-red-700 hover:scale-110',
                  'active:scale-95'
                )}
              >
                <FaTimes size={12} />
              </button>
            </>
          ) : (
            <>
              <FaUpload size={20} className='shrink-0' />
              <span className='truncate'>{placeholder}</span>
            </>
          )}
        </div>
      </button>

      <input
        ref={fileInputRef}
        type='file'
        id={id}
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className='hidden'
      />

      {/* {value && (
        <div className='mt-2 flex justify-center'>
          {value.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(value)}
              alt='Preview'
              onLoad={e =>
                URL.revokeObjectURL((e.target as HTMLImageElement).src)
              }
              className='max-w-[80px] max-h-[80px] object-cover rounded-md border border-secondary shadow-md'
            />
          )}
        </div>
      )} */}

      {error && <span className='text-destructive text-xs mt-1'>{error}</span>}
    </div>
  );
};

export default FileInput;
