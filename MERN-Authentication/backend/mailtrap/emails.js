import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapcClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapcClient.send({
      from: sender,
      to: recipent,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification email: ", error);
    throw new Error("Error sending verification email: ", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapcClient.send({
      from: sender,
      to: recipent,
      template_uuid: "50fb97b0-8996-4aa9-ac9f-9f944e5e23d3",

      template_variables: {
        name: name,
        company_info_name: "MERN Auth",
      },
    });
    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome Email: ${error}`);
    throw new Error(`Error sending welcome Email: ${error}`);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapcClient.send({
      from: sender,
      to: recipent,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Reset Password",
    });
  } catch (error) {
    console.log("Error sending reset password email: ", error);
    throw new Error("Error sending reset password email: ", error);
  }
};

export const sendPasswordResetConfirmationEmail = async (email) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapcClient.send({
      from: sender,
      to: recipent,
      subject: "Password Reset Confirmation",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Confirmation",
    });
  } catch (error) {
    console.log("Error sending password reset confirmation email: ", error);
    throw new Error("Error sending password reset confirmation email: ", error);
  }
};
