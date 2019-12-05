import HelpOrder from '../models/HelpOrder';

class HelpOrderPendingController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });
    res.json(helpOrder);
  }
}

export default new HelpOrderPendingController();
