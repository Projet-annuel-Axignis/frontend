'use client';

import { fileService } from '@/services/fileService';
import {
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  TextField,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const openModalForFile = (file: File) => {
    setSelectedFile(file);
    setTitle('');
    setDescription('');
    setModalOpen(true);
    setUploadError('');
    setProgress(0);
  };

  const uploadFileWithMeta = async () => {
    if (!selectedFile || !title) return;
    setUploading(true);
    setUploadError('');
    setProgress(0);
    try {
      if (entityType === 'report') {
        await fileService.uploadReportFile(entityId, selectedFile, title, description, setProgress);
      } else {
        await fileService.uploadObservationFile(entityId, selectedFile, title, description, setProgress);
      }
      setUploading(false);
      setModalOpen(false);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setProgress(0);
      onUploadComplete?.();
    } catch {
      setUploading(false);
      setUploadError("Erreur lors de l'upload du fichier");
      onError?.("Erreur lors de l'upload du fichier");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    openModalForFile(selectedFiles[0]);
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
      openModalForFile(droppedFiles[0]);
    }
  }, []);

  return (
    <>
      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 3,
          mb: 2,
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
          onChange={handleUpload}
          style={{ display: 'none' }}
          accept="*/*"
        />

        <CloudUploadIcon
          sx={{
            fontSize: 32,
            color: dragOver ? 'var(--color-axignis-primary)' : 'grey.400',
            mb: 1
          }}
        />

        <Typography variant="body2" gutterBottom>
          {dragOver ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier'}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          ou cliquez pour sélectionner un fichier
        </Typography>

        <Button
          variant="outlined"
          disabled={uploading}
          startIcon={<CloudUploadIcon />}
          size="small"
          sx={{
            borderColor: 'var(--color-axignis-primary)',
            color: 'var(--color-axignis-primary)',
            '&:hover': {
              borderColor: 'var(--color-axignis-secondary)',
              backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.05)',
            },
          }}
        >
          {uploading ? 'Upload en cours...' : 'Sélectionner un fichier'}
        </Button>
      </Paper>

      {/* Modal pour titre/description + progression */}
      <Dialog open={modalOpen} onClose={() => !uploading && setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Ajouter un fichier</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Fichier :</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} Ko)
              </Typography>
              <TextField
                label="Titre *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
                required
                disabled={uploading}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                disabled={uploading}
                sx={{ mb: 2 }}
              />
              {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
              {uploading && (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography variant="caption" color="text.secondary">
                    Téléchargement : {progress}%
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={uploading}>Annuler</Button>
          <Button
            onClick={uploadFileWithMeta}
            variant="contained"
            disabled={!selectedFile || !title || uploading}
            startIcon={<CloudUploadIcon />}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            {uploading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileUpload; 