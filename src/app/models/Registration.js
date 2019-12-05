import Sequelize, {Model} from 'sequelize';
import Plan from '../models/Plan';
import {addMonths} from 'date-fns';

class Registration extends Model {
  static init(sequelize) {
    super.init(
        {
          start_date: Sequelize.DATE,
          end_date: Sequelize.DATE,
          price: Sequelize.DECIMAL,
        },
        {
          sequelize,
        }
    );

    this.addHook('beforeSave', async (plan) => {
      const chosen_plan = await Plan.findByPk(plan.plan_id);
      plan.end_date = addMonths(
          plan.start_date, chosen_plan.duration
      );
      plan.price = chosen_plan.duration * chosen_plan.price;
    });

    return this;
  }


  static associate(models) {
    this.belongsTo(models.Student, {foreignKey: 'student_id'});
    this.belongsTo(models.Plan, {foreignKey: 'plan_id'});
  }
}

export default Registration;
