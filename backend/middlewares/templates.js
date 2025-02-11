// templates.js
export const scheduleSessionEmail = (task, dateTime) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 24px;">📅 Session Scheduled</h2>
    </div>
    <div style="padding: 20px; color: #333333;">
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">We're excited to inform you that a new session has been successfully scheduled. Here are the details:</p>
      
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
            <strong>Task:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">
            ${task}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
            <strong>Date & Time:</strong>
          </td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">
            ${new Date(dateTime).toLocaleString()}
          </td>
        </tr>
      </table>

      <p style="font-size: 16px; margin-top: 20px;">
        Please mark your calendar and prepare accordingly.
      </p>

      <p style="font-size: 16px; color: #666666;">
        Regards,<br>
        <strong>Scheduling Team</strong>
      </p>
    </div>

    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
      <p style="margin: 0;">You received this email because you are associated with a session scheduling service.</p>
      <p style="margin: 5px 0 0;">If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">support@example.com</a></p>
    </div>
  </div>
`;
