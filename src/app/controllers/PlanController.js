import Plan from '../models/Plan';
import * as Yup from 'yup';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      where: {
        canceled: false,
      },
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validations fails'});
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Validations fails'});
    }

    const {id} = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({error: 'Plan not found'});
    }

    if (plan.canceled) {
      return res.status(400).json({error: 'Plan already canceled'});
    }

    const planUpdated = await plan.update(req.body);

    res.json(planUpdated);
  }

  async delete(req, res) {
    const {id} = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({error: 'Plan not found'});
    }

    if (plan.canceled) {
      return res.status(400).json({error: 'Plan already canceled'});
    }

    plan.canceled = true;

    await plan.save();

    return res.status(204).json();
  }
}

export default new PlanController();
