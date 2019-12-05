import Student from '../models/Student';
import * as Yup from 'yup';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weigth: Yup.number().required(),
      heigth: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({error: 'Validations fails'});
    }

    const existStudent = await Student.findOne(
        {where: {email: req.body.email}}
    );

    if (existStudent) {
      return res.status(401).json({error: 'Student alredy exists'});
    }

    const {name, email, age, weight, height} = await Student.create(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weigth: Yup.number().required(),
      heigth: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({error: 'Validations fails'});
    }

    const student = await Student.findOne(
        {where: {email: req.body.email}}
    );

    if (!(student)) {
      return res.status(401).json({error: 'Student not found'});
    }

    const {name, email, age, weight, height} = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
