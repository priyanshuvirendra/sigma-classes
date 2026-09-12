package com.sigma.backend.service;

import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${email.from:onboarding@resend.dev}")
    private String emailFrom;

    @Value("${frontend.url}")
private String frontendUrl;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public EmailService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    private void sendEmail(String to, String subject, String html) {
        try {
            Map<String, Object> payload = Map.of(
                    "from", emailFrom,
                    "to", List.of(to),
                    "subject", subject,
                    "html", html
            );

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

          if (response.statusCode() < 200 || response.statusCode() >= 300) {
    System.err.println("===== RESEND EMAIL ERROR =====");
    System.err.println("HTTP STATUS: " + response.statusCode());
    System.err.println("RESPONSE BODY: " + response.body());
    System.err.println("==============================");

    throw new RuntimeException(
        "Resend email failed. HTTP " +
        response.statusCode() +
        ": " +
        response.body()
    );
}
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send email through Resend",
                    e
            );
        }
    }

    public void sendWelcomeEmail(String studentName, String studentEmail) {
        sendEmail(
                studentEmail,
                "Welcome to Sigma Classes 🎓",
               buildWelcomeEmail(
        studentName,
        frontendUrl + "/student/login"
)
        );
    }

    public void sendVerificationEmail(
            String studentName,
            String studentEmail,
            String verificationToken
    ) {
String verificationUrl =
        frontendUrl + "/student/verify-email?token="
                + verificationToken;

        sendEmail(
                studentEmail,
                "Verify Your Sigma Classes Email",
                buildVerificationEmail(studentName, verificationUrl)
        );
    }

    // =====================================================
    // SEND PASSWORD RESET EMAIL
    // =====================================================

    public void sendPasswordResetEmail(
            String studentName,
            String studentEmail,
            String resetToken
    ) {
String resetUrl =
        frontendUrl + "/student/reset-password?token="
                + resetToken;

        sendEmail(
                studentEmail,
                "Reset Your Sigma Classes Password",
                buildPasswordResetEmail(studentName, resetUrl)
        );
    }

    public void sendEnrollmentRequestEmail(
            String studentName,
            String studentEmail,
            String courseName,
            String courseCategory,
            String courseDuration,
            String courseMode
    ) {
String dashboardUrl =
        frontendUrl + "/student/dashboard";
        sendEmail(
                studentEmail,
                "Enrollment Request Received - Sigma Classes",
                buildEnrollmentRequestEmail(
                        studentName,
                        courseName,
                        courseCategory,
                        courseDuration,
                        courseMode,
                        dashboardUrl
                )
        );
    }

    // =====================================================
    // SEND ENROLLMENT APPROVED EMAIL
    // =====================================================

    public void sendEnrollmentApprovedEmail(
            String studentName,
            String studentEmail,
            String courseName,
            String courseCategory,
            String courseDuration,
            String courseMode
    ) {
String dashboardUrl =
        frontendUrl + "/student/dashboard";
        sendEmail(
                studentEmail,
                "Enrollment Approved - Sigma Classes",
                buildEnrollmentApprovedEmail(
                        studentName,
                        courseName,
                        courseCategory,
                        courseDuration,
                        courseMode,
                        dashboardUrl
                )
        );
    }

// =====================================================
// BUILD ENROLLMENT APPROVED EMAIL
// =====================================================
private String buildEnrollmentApprovedEmail(
        String studentName,
        String courseName,
        String courseCategory,
        String courseDuration,
        String courseMode,
        String dashboardUrl
) {

    return """
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>Enrollment Approved</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#f8f8f6;
            font-family:Arial,Helvetica,sans-serif;
            color:#111111;
        ">

        <div style="
            max-width:620px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #eeeeee;
        ">

            <div style="
                background:#e31b23;
                padding:28px 30px;
                text-align:center;
            ">

                <div style="
                    display:inline-block;
                    width:48px;
                    height:48px;
                    line-height:48px;
                    border-radius:50%;
                    background:#ffffff;
                    color:#e31b23;
                    font-size:24px;
                    font-weight:bold;
                ">
                    S
                </div>

                <h1 style="
                    margin:12px 0 0;
                    color:#ffffff;
                    font-size:24px;
                ">
                    Sigma Classes
                </h1>

            </div>


            <div style="padding:35px 30px;">

                <div style="
                    width:64px;
                    height:64px;
                    line-height:64px;
                    margin:0 auto 20px;
                    border-radius:50%;
                    background:#ecfdf3;
                    color:#16a34a;
                    text-align:center;
                    font-size:32px;
                    font-weight:bold;
                ">
                    ✓
                </div>

                <p style="
                    margin:0 0 16px;
                    font-size:16px;
                    text-align:center;
                ">
                    Hello <strong>${studentName}</strong>,
                </p>

                <h2 style="
                    margin:0 0 14px;
                    font-size:24px;
                    text-align:center;
                    color:#111111;
                ">
                    Your enrollment is approved!
                </h2>

                <p style="
                    margin:0 0 25px;
                    color:#667085;
                    font-size:15px;
                    line-height:1.7;
                    text-align:center;
                ">
                    Congratulations! Your enrollment at Sigma
                    Classes has been approved. You can now
                    access your course information from your
                    student dashboard.
                </p>


                <div style="
                    background:#f8f8f6;
                    border:1px solid #eeeeee;
                    border-radius:10px;
                    padding:20px;
                    margin-bottom:25px;
                ">

                    <div style="
                        color:#e31b23;
                        font-size:12px;
                        font-weight:bold;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        margin-bottom:8px;
                    ">
                        ENROLLED COURSE
                    </div>

                    <div style="
                        font-size:20px;
                        font-weight:bold;
                        margin-bottom:16px;
                    ">
                        ${courseName}
                    </div>

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                        font-size:14px;
                    ">

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Category
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseCategory}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Duration
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseDuration}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Mode
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseMode}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Status
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:bold;
                                color:#16a34a;
                            ">
                                Approved
                            </td>
                        </tr>

                    </table>

                </div>


                <p style="
                    margin:0 0 22px;
                    color:#667085;
                    font-size:14px;
                    line-height:1.7;
                    text-align:center;
                ">
                    Please check your student dashboard for
                    your enrollment details and available
                    course information.
                </p>


                <div style="text-align:center;">

                    <a href="${dashboardUrl}"
                       style="
                           display:inline-block;
                           padding:13px 24px;
                           background:#e31b23;
                           color:#ffffff;
                           text-decoration:none;
                           border-radius:7px;
                           font-size:14px;
                           font-weight:bold;
                       ">
                        Open Student Dashboard
                    </a>

                </div>

            </div>


            <div style="
                padding:20px 30px;
                background:#fafafa;
                border-top:1px solid #eeeeee;
                text-align:center;
            ">

                <p style="
                    margin:0;
                    color:#667085;
                    font-size:12px;
                    line-height:1.6;
                ">
                    Sigma Classes<br>
                    Your preparation. Your progress.
                </p>

            </div>

        </div>

        </body>
        </html>
        """
        .replace(
                "${studentName}",
                escapeHtml(studentName)
        )
        .replace(
                "${courseName}",
                escapeHtml(courseName)
        )
        .replace(
                "${courseCategory}",
                escapeHtml(courseCategory)
        )
        .replace(
                "${courseDuration}",
                escapeHtml(courseDuration)
        )
        .replace(
                "${courseMode}",
                escapeHtml(courseMode)
        )
        .replace(
                "${dashboardUrl}",
                dashboardUrl
        );
}

private String buildVerificationEmail(
        String studentName,
        String verificationUrl
) {

    return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f6f6f4;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <div style="
                    max-width: 620px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e5e5;
                ">

                    <!-- Header -->
                    <div style="
                        background: #111111;
                        padding: 28px 32px;
                        text-align: center;
                    ">

                        <div style="
                            display: inline-block;
                            width: 44px;
                            height: 44px;
                            line-height: 44px;
                            border-radius: 8px;
                            background: #E31B23;
                            color: #ffffff;
                            font-size: 24px;
                            font-weight: 800;
                        ">
                            S
                        </div>

                        <div style="
                            margin-top: 10px;
                            color: #ffffff;
                            font-size: 22px;
                            font-weight: 700;
                        ">
                            Sigma <span style="color: #FFC400;">
                                Classes
                            </span>
                        </div>

                    </div>


                    <!-- Content -->
                    <div style="
                        padding: 36px 32px;
                        color: #222222;
                    ">

                        <p style="
                            margin: 0 0 18px;
                            font-size: 16px;
                        ">
                            Hello <strong>${studentName}</strong>,
                        </p>

                        <h1 style="
                            margin: 0 0 16px;
                            font-size: 27px;
                            line-height: 1.3;
                            color: #111111;
                        ">
                            Verify your email address
                        </h1>

                        <p style="
                            margin: 0 0 24px;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #555555;
                        ">
                            Thank you for creating your
                            Sigma Classes student account.
                            Please verify your email address
                            to complete your account setup.
                        </p>

                        <div style="
                            background: #fafafa;
                            border-left: 4px solid #E31B23;
                            padding: 18px 20px;
                            margin-bottom: 26px;
                        ">

                            <p style="
                                margin: 0;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #555555;
                            ">
                                This verification link is valid
                                for <strong>24 hours</strong>.
                                Please verify your email before
                                the link expires.
                            </p>

                        </div>


                        <!-- Button -->
                        <div style="
                            text-align: center;
                            margin: 32px 0;
                        ">

                            <a href="${verificationUrl}"
                               style="
                                display: inline-block;
                                background: #E31B23;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 14px 28px;
                                border-radius: 6px;
                                font-size: 14px;
                                font-weight: 700;
                            ">
                                Verify My Email
                            </a>

                        </div>


                        <p style="
                            margin: 0 0 10px;
                            font-size: 13px;
                            color: #777777;
                        ">
                            If the button doesn't work, copy and
                            paste this link into your browser:
                        </p>

                        <p style="
                            margin: 0 0 28px;
                            word-break: break-all;
                            font-size: 12px;
                            color: #E31B23;
                        ">
                            ${verificationUrl}
                        </p>


                        <p style="
                            margin: 0;
                            font-size: 14px;
                            line-height: 1.6;
                            color: #555555;
                        ">
                            Regards,<br>
                            <strong style="color: #111111;">
                                Sigma Classes
                            </strong><br>
                            Director &amp; CEO<br>
                            Akhauri Sudhanshu Srivastava
                        </p>

                    </div>


                    <!-- Footer -->
                    <div style="
                        background: #111111;
                        padding: 18px 25px;
                        text-align: center;
                    ">

                        <p style="
                            margin: 0;
                            color: #999999;
                            font-size: 12px;
                        ">
                            © Sigma Classes. All rights reserved.
                        </p>

                    </div>

                </div>

            </body>
            </html>
            """
            .replace(
                    "${studentName}",
                    escapeHtml(studentName)
            )
            .replace(
                    "${verificationUrl}",
                    verificationUrl
            );
}

   private String buildWelcomeEmail(
        String studentName,
        String loginUrl
) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                </head>

                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #f6f6f4;
                    font-family: Arial, Helvetica, sans-serif;
                ">

                    <div style="
                        max-width: 620px;
                        margin: 30px auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #e5e5e5;
                    ">

                        <!-- Header -->
                        <div style="
                            background: #111111;
                            padding: 28px 32px;
                            text-align: center;
                        ">

                            <div style="
                                display: inline-block;
                                width: 44px;
                                height: 44px;
                                line-height: 44px;
                                border-radius: 8px;
                                background: #E31B23;
                                color: #ffffff;
                                font-size: 24px;
                                font-weight: 800;
                            ">
                                S
                            </div>

                            <div style="
                                margin-top: 10px;
                                color: #ffffff;
                                font-size: 22px;
                                font-weight: 700;
                            ">
                                Sigma <span style="color: #FFC400;">
                                    Classes
                                </span>
                            </div>

                        </div>


                        <!-- Content -->
                        <div style="
                            padding: 36px 32px;
                            color: #222222;
                        ">

                            <p style="
                                margin: 0 0 18px;
                                font-size: 16px;
                            ">
                                Hello <strong>${studentName}</strong>,
                            </p>

                            <h1 style="
                                margin: 0 0 16px;
                                font-size: 28px;
                                line-height: 1.3;
                                color: #111111;
                            ">
                                Welcome to Sigma Classes!
                            </h1>

                            <p style="
                                margin: 0 0 24px;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #555555;
                            ">
                                Your student account has been
                                successfully created.
                                We're glad to have you with us.
                            </p>


                            <div style="
                                background: #fafafa;
                                border-left: 4px solid #E31B23;
                                padding: 18px 20px;
                                margin-bottom: 26px;
                            ">

                                <p style="
                                    margin: 0 0 12px;
                                    font-weight: 700;
                                    color: #111111;
                                ">
                                    Your student portal gives you
                                    access to:
                                </p>

                                <p style="
                                    margin: 7px 0;
                                    color: #555555;
                                    font-size: 14px;
                                ">
                                    ✓ Enrolled courses
                                </p>

                                <p style="
                                    margin: 7px 0;
                                    color: #555555;
                                    font-size: 14px;
                                ">
                                    ✓ Study materials
                                </p>

                                <p style="
                                    margin: 7px 0;
                                    color: #555555;
                                    font-size: 14px;
                                ">
                                    ✓ Test results
                                </p>

                                <p style="
                                    margin: 7px 0;
                                    color: #555555;
                                    font-size: 14px;
                                ">
                                    ✓ Free learning resources
                                </p>

                            </div>


                            <p style="
                                margin: 0 0 26px;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #555555;
                            ">
                                We wish you the very best in your
                                competitive exam preparation.
                                Stay consistent, stay focused and
                                keep moving towards your goal.
                            </p>


                            <!-- Button -->
                            <div style="
                                text-align: center;
                                margin: 30px 0;
                            ">

                              <a href="${loginUrl}"
                                   style="
                                    display: inline-block;
                                    background: #E31B23;
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 13px 26px;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    font-weight: 700;
                                ">
                                    Login to Student Portal
                                </a>

                            </div>


                            <p style="
                                margin: 28px 0 0;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #555555;
                            ">
                                Regards,<br>
                                <strong style="color: #111111;">
                                    Sigma Classes
                                </strong><br>
                                Director &amp; CEO<br>
                                Akhauri Sudhanshu Srivastava
                            </p>

                        </div>


                        <!-- Footer -->
                        <div style="
                            background: #111111;
                            padding: 18px 25px;
                            text-align: center;
                        ">

                            <p style="
                                margin: 0;
                                color: #999999;
                                font-size: 12px;
                            ">
                                © Sigma Classes. All rights reserved.
                            </p>

                        </div>

                    </div>

                </body>
                </html>
""".replace(
        "${studentName}",
        escapeHtml(studentName)
)
.replace(
        "${loginUrl}",
        loginUrl
);

}
// =====================================================
// BUILD PASSWORD RESET EMAIL
// =====================================================

private String buildPasswordResetEmail(
        String studentName,
        String resetUrl
) {

    return """
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f6f6f4;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <div style="
                    max-width: 620px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e5e5;
                ">

                    <!-- HEADER -->

                    <div style="
                        background: #111111;
                        padding: 28px 32px;
                        text-align: center;
                    ">

                        <div style="
                            display: inline-block;
                            width: 44px;
                            height: 44px;
                            line-height: 44px;
                            border-radius: 8px;
                            background: #E31B23;
                            color: #ffffff;
                            font-size: 24px;
                            font-weight: 800;
                        ">
                            S
                        </div>

                        <div style="
                            margin-top: 10px;
                            color: #ffffff;
                            font-size: 22px;
                            font-weight: 700;
                        ">
                            Sigma
                            <span style="color: #FFC400;">
                                Classes
                            </span>
                        </div>

                    </div>


                    <!-- CONTENT -->

                    <div style="
                        padding: 36px 32px;
                        color: #222222;
                    ">

                        <p style="
                            margin: 0 0 18px;
                            font-size: 16px;
                        ">
                            Hello
                            <strong>${studentName}</strong>,
                        </p>


                        <h1 style="
                            margin: 0 0 16px;
                            font-size: 28px;
                            line-height: 1.3;
                            color: #111111;
                        ">
                            Reset your password
                        </h1>


                        <p style="
                            margin: 0 0 24px;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #555555;
                        ">
                            We received a request to reset the
                            password for your Sigma Classes
                            student account.
                        </p>


                        <div style="
                            background: #fafafa;
                            border-left: 4px solid #E31B23;
                            padding: 18px 20px;
                            margin-bottom: 26px;
                        ">

                            <p style="
                                margin: 0;
                                color: #555555;
                                font-size: 14px;
                                line-height: 1.6;
                            ">
                                This password reset link will
                                expire in <strong>1 hour</strong>.
                                If you did not request a password
                                reset, you can safely ignore this
                                email.
                            </p>

                        </div>


                        <!-- BUTTON -->

                        <div style="
                            text-align: center;
                            margin: 30px 0;
                        ">

                            <a href="${resetUrl}"
                               style="
                                display: inline-block;
                                background: #E31B23;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 13px 26px;
                                border-radius: 6px;
                                font-size: 14px;
                                font-weight: 700;
                            ">
                                Reset My Password
                            </a>

                        </div>


                        <p style="
                            margin: 28px 0 0;
                            font-size: 14px;
                            line-height: 1.6;
                            color: #555555;
                        ">
                            Regards,<br>

                            <strong style="color: #111111;">
                                Sigma Classes
                            </strong><br>

                            Director &amp; CEO<br>

                            Akhauri Sudhanshu Srivastava
                        </p>

                    </div>


                    <!-- FOOTER -->

                    <div style="
                        background: #111111;
                        padding: 18px 25px;
                        text-align: center;
                    ">

                        <p style="
                            margin: 0;
                            color: #999999;
                            font-size: 12px;
                        ">
                            © Sigma Classes. All rights reserved.
                        </p>

                    </div>

                </div>

            </body>

            </html>
            """
            .replace(
                    "${studentName}",
                    escapeHtml(studentName)
            )
            .replace(
                    "${resetUrl}",
                    resetUrl
            );
}

private String buildEnrollmentRequestEmail(
        String studentName,
        String courseName,
        String courseCategory,
        String courseDuration,
        String courseMode,
        String dashboardUrl
) {

    return """
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>Enrollment Request Received</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#f8f8f6;
            font-family:Arial,Helvetica,sans-serif;
            color:#111111;
        ">

        <div style="
            max-width:620px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #eeeeee;
        ">

            <!-- HEADER -->

            <div style="
                background:#e31b23;
                padding:28px 30px;
                text-align:center;
            ">

                <div style="
                    display:inline-block;
                    width:48px;
                    height:48px;
                    line-height:48px;
                    border-radius:50%;
                    background:#ffffff;
                    color:#e31b23;
                    font-size:24px;
                    font-weight:bold;
                ">
                    S
                </div>

                <h1 style="
                    margin:12px 0 0;
                    color:#ffffff;
                    font-size:24px;
                ">
                    Sigma Classes
                </h1>

            </div>


            <!-- CONTENT -->

            <div style="padding:35px 30px;">

                <div style="
                    width:64px;
                    height:64px;
                    line-height:64px;
                    margin:0 auto 20px;
                    border-radius:50%;
                    background:#fff7df;
                    color:#d97706;
                    text-align:center;
                    font-size:30px;
                    font-weight:bold;
                ">
                    !
                </div>

                <p style="
                    margin:0 0 16px;
                    font-size:16px;
                    text-align:center;
                ">
                    Hello <strong>${studentName}</strong>,
                </p>

                <h2 style="
                    margin:0 0 14px;
                    font-size:24px;
                    text-align:center;
                    color:#111111;
                ">
                    Enrollment request received.
                </h2>

                <p style="
                    margin:0 0 25px;
                    color:#667085;
                    font-size:15px;
                    line-height:1.7;
                    text-align:center;
                ">
                    Thank you for choosing Sigma Classes.
                    We have received your enrollment request
                    and our team will review it shortly.
                </p>


                <!-- COURSE CARD -->

                <div style="
                    background:#f8f8f6;
                    border:1px solid #eeeeee;
                    border-radius:10px;
                    padding:20px;
                    margin-bottom:25px;
                ">

                    <div style="
                        color:#e31b23;
                        font-size:12px;
                        font-weight:bold;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        margin-bottom:8px;
                    ">
                        COURSE
                    </div>

                    <div style="
                        font-size:20px;
                        font-weight:bold;
                        margin-bottom:16px;
                    ">
                        ${courseName}
                    </div>

                    <table style="
                        width:100%;
                        border-collapse:collapse;
                        font-size:14px;
                    ">

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Category
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseCategory}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Duration
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseDuration}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Mode
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:600;
                            ">
                                ${courseMode}
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:7px 0;
                                color:#667085;
                            ">
                                Status
                            </td>

                            <td style="
                                padding:7px 0;
                                text-align:right;
                                font-weight:bold;
                                color:#d97706;
                            ">
                                Pending Approval
                            </td>
                        </tr>

                    </table>

                </div>


                <p style="
                    margin:0 0 22px;
                    color:#667085;
                    font-size:14px;
                    line-height:1.7;
                    text-align:center;
                ">
                    Once your enrollment is approved, you will
                    receive another email with the confirmation
                    and next steps.
                </p>


                <div style="text-align:center;">

                    <a href="${dashboardUrl}"
                       style="
                           display:inline-block;
                           padding:13px 24px;
                           background:#e31b23;
                           color:#ffffff;
                           text-decoration:none;
                           border-radius:7px;
                           font-size:14px;
                           font-weight:bold;
                       ">
                        View Student Dashboard
                    </a>

                </div>

            </div>


            <!-- FOOTER -->

            <div style="
                padding:20px 30px;
                background:#fafafa;
                border-top:1px solid #eeeeee;
                text-align:center;
            ">

                <p style="
                    margin:0;
                    color:#667085;
                    font-size:12px;
                    line-height:1.6;
                ">
                    Sigma Classes<br>
                    Your preparation. Your progress.
                </p>

            </div>

        </div>

        </body>
        </html>
        """
        .replace("${studentName}", escapeHtml(studentName))
        .replace("${courseName}", escapeHtml(courseName))
        .replace("${courseCategory}", escapeHtml(courseCategory))
        .replace("${courseDuration}", escapeHtml(courseDuration))
        .replace("${courseMode}", escapeHtml(courseMode))
        .replace("${dashboardUrl}", dashboardUrl);
}

    private String escapeHtml(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}