import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';
import {Op} from 'sequelize';
import {addDays, startOfDay, endOfDay} from 'date-fns';

class CheckinController {
  async index(req, res) {
    const {id} = req.params;

    const hasStudent = await Student.findByPk(id);
    if (!hasStudent) {
      return res.status(400).json({error: 'Student not found'});
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
    });
    return res.json(checkins);
  }
  async store(req, res) {
    const {id} = req.params;

    const hasStudent = await Student.findByPk(id);
    if (!hasStudent) {
      return res.status(400).json({error: 'Student not found'});
    }

    const hasRegistration = await Registration.findOne({
      where: {
        student_id: id,
      },
    });
    if (!hasRegistration) {
      return res.status(400).json({error: 'Student not\'s registrated'});
    }

    const dateFive = addDays(new Date(), 5);

    const hasMoreFiveChekin = await Checkin.count({
      where: {
        created_at: {
          [Op.between]: [startOfDay(new Date()), endOfDay(dateFive)],
        },
      },
    });
    if (hasMoreFiveChekin >= 5) {
      return res.status(400).json({error: 'Permitted only 5 checkin'});
    }
    const payload = {student_id: id};
    const checkin = await Checkin.create(payload);
    return res.json(checkin);
  }
}

export default new CheckinController();
