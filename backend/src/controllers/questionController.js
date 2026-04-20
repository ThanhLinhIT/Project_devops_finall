import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/questions — tra ve tat ca cau hoi kem dap an
router.get('/questions', async (_req, res) => {
  try {
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true });

    if (qErr) throw qErr;

    const { data: answers, error: aErr } = await supabase
      .from('answers')
      .select('*');

    if (aErr) throw aErr;

    const result = questions.map((q) => ({
      ...q,
      answers: answers.filter((a) => a.question_id === q.id),
    }));

    res.json(result);
  } catch (err) {
    console.error('[questionController] GET /questions error:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET /api/questions/:id — tra ve 1 cau hoi kem dap an
router.get('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: question, error: qErr } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (qErr || !question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const { data: answers, error: aErr } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', id);

    if (aErr) throw aErr;

    res.json({ ...question, answers });
  } catch (err) {
    console.error('[questionController] GET /questions/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// POST /api/questions — them cau hoi moi (admin)
router.post('/questions', async (req, res) => {
  try {
    const { content, category = 'general', answers } = req.body;

    if (!content || !Array.isArray(answers) || answers.length < 2) {
      return res.status(400).json({ error: 'content and at least 2 answers required' });
    }

    const hasCorrect = answers.some((a) => a.is_correct === true);
    if (!hasCorrect) {
      return res.status(400).json({ error: 'At least one answer must be correct' });
    }

    const { data: question, error: qErr } = await supabase
      .from('questions')
      .insert({ content, category })
      .select()
      .single();

    if (qErr) throw qErr;

    const answerRows = answers.map((a) => ({
      question_id: question.id,
      content: a.content,
      is_correct: a.is_correct ?? false,
    }));

    const { data: insertedAnswers, error: aErr } = await supabase
      .from('answers')
      .insert(answerRows)
      .select();

    if (aErr) throw aErr;

    res.status(201).json({ ...question, answers: insertedAnswers });
  } catch (err) {
    console.error('[questionController] POST /questions error:', err.message);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

export default router;
