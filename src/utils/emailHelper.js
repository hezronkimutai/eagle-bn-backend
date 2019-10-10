const email = (req, helper) => {
  const subject = 'Password Reset';
  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <title>Password reset</title>
</head>
<body>
  <div >
    <div tabindex="-1"></div>
    <div>
      <div id=":ly"><u></u>
        <div style="font-size:16px;background-color:#fdfdfd;margin:0;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;line-height:1.5;height:100%!important;width:100%!important">
          <table bgcolor="#fdfdfd" style="box-sizing:border-box;border-spacing:0;width:100%;background-color:#fdfdfd;border-collapse:separate!important" width="100%">
            <tbody>
              <tr>
                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">&nbsp;</td>
                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;display:block;width:600px;max-width:600px;margin:0 auto!important" valign="top" width="600">
                  <div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"><span style="color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;width:0">AYour viewing this message becouse you requested to reset your password at Barefoot nomard.</span>
                    <div style="box-sizing:border-box;width:100%;margin-bottom:30px;margin-top:15px">
                      <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
                        <tbody>
                          <tr>
                            <td align="left" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;text-align:left" valign="top"><span>
                              <a href="${req.protocol}://${req.headers.host}${req.originalUrl}/${helper.createToken(req.user.id, req.user.email)}" style="box-sizing:border-box;color:#007bff;font-weight:400;text-decoration:none" target="_blank">
                            <h3  style="max-width:100%;border-style:none;width:137px;height:30px;color:#007bff;white-space: nowrap;">BareFoot-Nomard</h3></a></span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0">
                      <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
                          <tbody>
                            <tr>
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top">
                                <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#294661!important">Hello ${req.user.username},</h2>
                                        <p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300"><strong>Your viewing this message becouse you requested to reset your password at Barefoot nomard</strong></p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                                        <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%">
                                          <tbody>
                                            <tr>
                                                <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top">
                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" bgcolor="#007bff" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#007bff;border-radius:2px;text-align:center" valign="top">
                                                                <a href="${req.protocol}://${req.headers.host}${req.originalUrl}/${helper.createToken(req.user.id, req.user.email)}" style="box-sizing:border-box;border-color:#007bff;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#007bff;border:solid 1px #007bff;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank" data-saferedirecturl="">Reset Password</a></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                                        <p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">&nbsp;
                                        <br> If you did not initiate this request, please contact us immediately at on our support email <a href="rswaib@gmail.com" target="_blank">Barefoot</a>.</p>
                                        <p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Thank you,
                                        <br> The Barefoot Eagles Team</p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                      </table>
                    </div>
                      <div style="box-sizing:border-box;clear:both;width:100%">
                      <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%">
                        <tbody>
                            <tr style="font-size:12px">
                                  <p style="color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">Send with Confidence</p>
                                    <p style="margin:0;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Barefoot Nomard Eagles Kigali</p>
                                </td>
                            </tr>
                        </tbody>
                      </table>
                      </div>
                      </div>
                  </td>
                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return { subject, html };
};
export default email;
