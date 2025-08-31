import { Router } from 'express';
import { notesController } from '@/controllers/notesController';
import { validateRequest } from '@/middleware/validation';
import { notesValidation } from '@/validations/notesValidation';
import { upload } from '@/middleware/upload';

const router = Router();

// Notes management
router.get('/', notesController.getNotes);
router.post('/', validateRequest(notesValidation.createNote), notesController.createNote);
router.get('/:id', notesController.getNote);
router.patch('/:id', validateRequest(notesValidation.updateNote), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// Note actions
router.post('/:id/favorite', notesController.toggleFavorite);
router.post('/:id/share', validateRequest(notesValidation.shareNote), notesController.shareNote);
router.post('/:id/attachments', upload.array('files', 5), notesController.addAttachments);
router.delete('/:id/attachments/:attachmentId', notesController.removeAttachment);

// Search and filtering
router.get('/search/:query', notesController.searchNotes);
router.get('/tags/all', notesController.getAllTags);
router.get('/category/:category', notesController.getNotesByCategory);

// Journal specific
router.get('/journal/entries', notesController.getJournalEntries);
router.post('/journal/entry', validateRequest(notesValidation.createJournalEntry), notesController.createJournalEntry);

export default router;
