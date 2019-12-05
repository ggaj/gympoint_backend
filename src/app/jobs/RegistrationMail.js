import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({data}) {
    const {registrated} = data;

    await Mail.sendMail({
      to: `${registrated.Student.name} <${registrated.Student.email}>`,
      subject: 'Mitricula Academia - GymPoint',
      template: 'registration',
      context: {
        student: registrated.Student.name,
        plan: registrated.Plan.title,
        start_date: format(
            parseISO(registrated.start_date), 'dd \'de\' MMMM \'de\' yyyy',
            {locale: pt}
        ),
        end_date: format(
            parseISO(registrated.end_date), 'dd \'de\' MMMM \'de\' yyyy',
            {locale: pt}
        ),
        price: new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(registrated.price),
      },
    });
  }
}
export default new RegistrationMail();
