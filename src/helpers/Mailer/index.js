import mailer from '@sendgrid/mail';
import templates from './templates';
import env from '../../configs/environments';

mailer.setApiKey(env.mailerToken);

export default (messageTitle, emailSubject, reciever, operation, userData) => {
  try {
    const messageBody = templates[operation](userData);
    const message = {
      to: reciever,
      from: env.mailerEmail,
      subject: emailSubject,
      text: 'Authors Haven',
      html: `<div style="width:100%; font-family: 'lato';">
             <div style="margin:0 auto;background:#ffffff; max-width: 70%;">
             <div style="background:#2F3640;padding:1%;color:#ffffff;font-size:25px;">
             <div style="width: 8%;float:left;margin:0; font-size: 50%; padding-left:1%;">Authors Haven</div>
             <div style="width: 91%;float:left;margin:0; font-size: 60%; text-align: center; color: white !important;">${messageTitle}</div>
             <div style="clear:both"></div>
             </div>
             <div style="padding:20px;text-align:left; font-size: 95%;">
             ${messageBody}
             </div>
             <br>
             </div>
             <div style="padding:35px 10px;text-align:center; font-size: 95%;">
             Copyright, 2019<br>
             Andela, Savage Rangers
             <a target="_blank" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='blue'" href="${
  env.baseUrl
}/api/notifications/configuration/unsubscribe/email">Unsubscribe</a>
             </div>
             </div>`
    };
    return mailer.send(message);
  } catch (error) {
    return error;
  }
};
