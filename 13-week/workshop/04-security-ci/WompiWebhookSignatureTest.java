package co.edu.corhuila.futbolix.payment;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

// Negative test for story "Verify Wompi webhook signature":
// a webhook with a wrong X-Event-Checksum must be rejected and must not change the payment.
@WebMvcTest(WompiWebhookController.class)
class WompiWebhookSignatureTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    WompiSignatureVerifier wompiSignatureVerifier;

    @MockBean
    WebhookHandler webhookHandler;

    @Test
    void webhookWithInvalidSignatureIsRejected() throws Exception {
        String rawBody = "{\"event\":\"transaction.updated\"}";
        when(wompiSignatureVerifier.isValid(rawBody, "wrong-checksum")).thenReturn(false);

        mockMvc.perform(post("/api/v1/payments/wompi/webhook")
                        .header("X-Event-Checksum", "wrong-checksum")
                        .content(rawBody))
                .andExpect(status().isUnauthorized());

        verify(webhookHandler, never()).handle(rawBody);
    }
}
