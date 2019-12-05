import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import * as Yup from 'yup';

import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validations Fails'});
    }

    const {id} = req.params;
    const {answer} = req.body;

    const helpOrder = await HelpOrder.findByPk(
        id, {
          include: [{
            model: Student,
          }],
        }
    );
    if (!helpOrder) {
      return res.status(404).json({error: 'Help Order not found'});
    }

    if (helpOrder.answer_at) {
      return res.status(400).json({error: 'Answer alredy sent'});
    }

    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();
    await helpOrder.save();

    await Queue.add(HelpOrderAnswerMail.key, {helpOrder});

    return res.json(helpOrder);
  }
}

export default new HelpOrderAnswerController();
