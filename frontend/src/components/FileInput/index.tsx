import React, { useRef, useState } from 'react';
import { FaUpload, FaImage, FaTimes } from 'react-icons/fa';
import {
  FileInputContainer,
  FileInputButton,
  FileInputHidden,
  FilePreview,
  FileName,
  RemoveButton,
} from './styled';

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
    <FileInputContainer className={className}>
      {label && <label htmlFor={id}>{label}</label>}
      <FileInputButton
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        $dragActive={dragActive}
        $disabled={disabled}
        $hasFile={!!value}
        $error={!!error}
      >
        <div>
          {value ? (
            <>
              <FaImage size={20} />
              <FileName>{value.name}</FileName>
              <span>({formatFileSize(value.size)})</span>
              <RemoveButton onClick={handleRemove} type='button'>
                <FaTimes size={12} />
              </RemoveButton>
            </>
          ) : (
            <>
              <FaUpload size={20} />
              <span>{placeholder}</span>
            </>
          )}
        </div>
      </FileInputButton>

      <FileInputHidden
        ref={fileInputRef}
        type='file'
        id={id}
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {value && (
        <FilePreview>
          {value.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(value)}
              alt='Preview'
              onLoad={e =>
                URL.revokeObjectURL((e.target as HTMLImageElement).src)
              }
            />
          )}
        </FilePreview>
      )}

      {error && <span className='error'>{error}</span>}
    </FileInputContainer>
  );
};

export default FileInput;
