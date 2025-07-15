'use client';

import { fileService } from '@/services/fileService';
import {
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import {
  Button,
  Paper,
  Typography
} from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';

interface FileUploadProps {
  /** Type d'entité (report ou observation) */
  entityType: 'report' | 'observation';
  /** ID de l'entité */
  entityId: number;
  /** Callback appelé quand l'upload est terminé */
  onUploadComplete?: () => void;
  /** Callback appelé en cas d'erreur */
  onError?: (message: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  entityType,
  entityId,
  onUploadComplete,
  onError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (filesToUpload: FileList) => {
    setUploading(true);

    try {
      for (const file of Array.from(filesToUpload)) {
        if (entityType === 'report') {
          // Upload direct vers le rapport
          await fileService.uploadReportFile(entityId, file);
        } else {
          // Upload direct vers l'observation
          await fileService.uploadObservationFile(entityId, file);
        }
      }

      onUploadComplete?.();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      onError?.('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    await uploadFiles(selectedFiles);
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType]);

  return (
    <Paper
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p: 4,
        mb: 3,
        textAlign: 'center',
        border: dragOver ? '2px dashed var(--color-axignis-primary)' : '2px dashed #ccc',
        backgroundColor: dragOver ? 'rgba(var(--color-background), 0.05)' : '',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.02)',
          borderColor: 'var(--color-axignis-primary)',
        }
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleUpload}
        style={{ display: 'none' }}
        accept="*/*"
      />

      <CloudUploadIcon
        sx={{
          fontSize: 48,
          color: dragOver ? 'var(--color-axignis-primary)' : 'grey.400',
          mb: 2
        }}
      />

      <Typography variant="h6" gutterBottom>
        {dragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        ou cliquez pour sélectionner des fichiers
      </Typography>

      <Button
        variant="outlined"
        disabled={uploading}
        startIcon={<CloudUploadIcon />}
        sx={{
          borderColor: 'var(--color-axignis-primary)',
          color: 'var(--color-axignis-primary)',
          '&:hover': {
            borderColor: 'var(--color-axignis-secondary)',
            backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.05)',
          },
        }}
      >
        {uploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
      </Button>
    </Paper>
  );
};

export default FileUpload; 