import nodeMailer from "nodemailer"

export const sendMail = async (email: string, otp: string) => {


  try {
    const transport = nodeMailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    })

    const mailresponse = await transport.sendMail({
      from: "Resizly",
      to: email,
      subject: "Your Resizly OTP Code",
      html: generateEmailTemplate(otp),
    })

    return mailresponse
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message)
  }



}

function generateEmailTemplate(otp: string) {
  return `
     <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Resizly OTP Verification</title>
    </head>
    <body style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin-top: 50px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <img src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1743846560/resizely_vzzyie.png" alt="Resizly Logo" width="100" style="margin-bottom: 20px;" />
                  <h2 style="color: #1e40af;">Your OTP Code</h2>
                  <p style="color: #333333; font-size: 16px;">Use the code below to verify your identity on <strong>Resizly</strong>. This code will expire in 10 minutes.</p>
                  <div style="margin: 30px auto; display: inline-block; background-color: #1e40af; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px;">
                    ${otp}
                  </div>
                  <p style="color: #777777; font-size: 14px; margin-top: 20px;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                  <p style="font-size: 12px; color: #aaaaaa;">&copy; 2025 Resizly. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `
}