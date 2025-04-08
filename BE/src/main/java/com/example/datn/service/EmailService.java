package com.example.datn.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hiennbph45717@fpt.edu.vn");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
    public void sendOrderConfirmationEmail(String to, String orderCode, String customerName,
                                           double totalAmount, String paymentMethod) {
        String subject = "Xác nhận đơn hàng #" + orderCode;

        // Định dạng số tiền
        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
        String formattedAmount = formatter.format(totalAmount);

        // Tạo nội dung HTML trực tiếp
        String htmlContent = buildOrderConfirmationEmailHtml(
                orderCode, customerName, formattedAmount, paymentMethod);

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("hiennbph45717@fpt.edu.vn");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildOrderConfirmationEmailHtml(String orderCode, String customerName,
                                                   String totalAmount, String paymentMethod) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "    <meta charset=\"UTF-8\">" +
               "    <title>Xác nhận đơn hàng</title>" +
               "    <style>" +
               "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
               "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
               "        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }" +
               "        .content { padding: 20px; }" +
               "        .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #666; }" +
               "        .order-details { margin: 20px 0; }" +
               "        .thank-you { font-size: 18px; margin-bottom: 20px; }" +
               "        .amount { font-weight: bold; color: #1890ff; }" +
               "    </style>" +
               "</head>" +
               "<body>" +
               "    <div class=\"container\">" +
               "        <div class=\"header\">" +
               "            <h2>Xác nhận đơn hàng thành công</h2>" +
               "        </div>" +
               "        " +
               "        <div class=\"content\">" +
               "            <p class=\"thank-you\">Xin chào " + customerName + ",</p>" +
               "            <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>" +
               "            " +
               "            <div class=\"order-details\">" +
               "                <p><strong>Mã đơn hàng:</strong> " + orderCode + "</p>" +
               "                <p><strong>Tổng tiền:</strong> <span class=\"amount\">" + totalAmount + "₫</span></p>" +
               "                <p><strong>Phương thức thanh toán:</strong> " + paymentMethod + "</p>" +
               "            </div>" +
               "            " +
               "            <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất. Bạn sẽ nhận được thông báo khi đơn hàng được giao.</p>" +
               "            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>" +
               "        </div>" +
               "        " +
               "        <div class=\"footer\">" +
               "            <p>© 2023 Cửa hàng của chúng tôi. Tất cả các quyền được bảo lưu.</p>" +
               "        </div>" +
               "    </div>" +
               "</body>" +
               "</html>";
    }
}
