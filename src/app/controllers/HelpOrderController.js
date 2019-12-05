import Student from '../models/Student';
import Registration from '../models/Registration';
import HelpOrder from '../models/HelpOrder';
import * as Yup from 'yup';

class HelpOrderController {
  async index(req, res) {
    const {id} = req.params;

    const hasStudent = await Student.findByPk(id);
    if (!hasStudent) {
      return res.status(404).json({error: 'Student not found'});
    }

    const helpOrder = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validations Fails'});
    }

    const {id} = req.params;

    const hasStudent = await Student.findByPk(id);
    if (!hasStudent) {
      return res.status(404).json({error: 'Student not found'});
    }

    const hasRegistration = await Registration.findOne({
      where: {
        student_id: id,
      },
    });
    if (!hasRegistration) {
      return res.status(404).json({error: 'Student not\'s registered'});
    }

    const payload = req.body;
    payload.student_id = id;

    const helpOrder = await HelpOrder.create(payload);
    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
