import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// POST /api/quiz/submit — nop bai, cham diem, luu ket qua
router.post('/quiz/submit', async (req, res) => {
  try {
    const { playerName, answers: submitted } = req.body;

    if (!playerName || !Array.isArray(submitted) || submitted.length === 0) {
      return res.status(400).json({ error: 'playerName and answers array required' });
    }

    const questionIds = submitted.map((a) => a.questionId);

    const { data: correctAnswers, error: dbErr } = await supabase
      .from('answers')
      .select('id, question_id, is_correct')
      .in('question_id', questionIds);

    if (dbErr) throw dbErr;

    let score = 0;
    const answersLog = submitted.map(({ questionId, answerId }) => {
      const chosen = correctAnswers.find((a) => a.id === answerId);
      const isCorrect = chosen?.is_correct === true;
      if (isCorrect) score++;
      return { questionId, answerId, isCorrect };
    });

    const total = submitted.length;

    const { data: result, error: rErr } = await supabase
      .from('results')
      .insert({
        player_name: playerName,
        score,
        total,
        answers_log: answersLog,
      })
      .select()
      .single();

    if (rErr) throw rErr;

    res.status(201).json({ score, total, resultId: result.id });
  } catch (err) {
    console.error('[quizController] POST /quiz/submit error:', err.message);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

export default router;
