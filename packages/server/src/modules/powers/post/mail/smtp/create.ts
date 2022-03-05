import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const createSMTPEmitter = (loginInfo: SMTPTransport, options: Mail.Options) => {
  createTransport(loginInfo).sendMail(options, error => {
    if (error) throw error
    return {
      status: 'ok',
    }
  })
}

const createMultiSMTPEmitter = async (loginInfo: SMTPTransport, options: Mail.Options[]) => {
  const transporter = createTransport(loginInfo)
  return Promise.all(options.map(transporter.sendMail))
}
export { createSMTPEmitter, createMultiSMTPEmitter }
