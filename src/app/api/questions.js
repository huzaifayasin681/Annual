// pages/api/questions.js
import questions from '../../data/questions.json';

export default function handler(req, res) {
  res.status(200).json(questions);
}
