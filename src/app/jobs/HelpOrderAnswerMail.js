import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({data}) {
    const {helpOrder} = data;

    await Mail.sendMail({
      to: `${helpOrder.Student.name} <${helpOrder.Student.email}>`,
      subject: 'Pergunta Respondida - GymPoint',
      template: 'helporderanswer',
      context: {
        student: helpOrder.Student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(
            parseISO(helpOrder.answer_at), 'dd \'de\' MMMM \'de\' yyyy',
            {locale: pt}
        ),
      },
    });
  }
}
export default new HelpOrderAnswerMail();
