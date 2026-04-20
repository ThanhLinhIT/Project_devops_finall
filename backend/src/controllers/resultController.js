import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/results — lich su tat ca ket qua (moi nhat truoc)
router.get('/results', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('id, player_name, score, total, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('[resultController] GET /results error:', err.message);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET /api/results/:id — chi tiet 1 ket qua
router.get('/results/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('[resultController] GET /results/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

export default router;
