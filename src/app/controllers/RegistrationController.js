import * as Yup from 'yup';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import {isBefore} from 'date-fns';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const registration = Registration.findAll();
    return res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validations Fails'});
    }

    const studentIsRegistrated = await Registration.findOne({
      where: {
        student_id: req.body.student_id,
      },
    });
    if (studentIsRegistrated && isBefore(new Date(), studentIsRegistrated.end_date)) {
      // return res.status(400).json({error: 'Student alredy registrated'});
    }

    const registration = await Registration.create(req.body);

    const registrated = await Registration.findOne({
      where: {
        id: registration.id,
      },
      include: [{
        model: Student,
      },
      {
        model: Plan,
      }],
    });

    await Queue.add(RegistrationMail.key, {registrated});

    return res.json(registrated);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    const {id} = req.params;

    const registration = Registration.findByPk(id);
    if (!registration) {
      return res.status(400).json({error: 'Registration not found'});
    }

    await Registration.destroy({
      where: {
        id: registration.id,
      },
    });

    return res.status(204).json();
  }
}
export default new RegistrationController();
