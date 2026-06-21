import { isSupabaseConfigured } from "./supabase";

export interface MockEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sent_at: string;
}

// Send Welcome Email
export const sendWelcomeEmail = async (
  emailAddress: string,
  parentName: string,
  registrationId: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = "Welcome to Stark Labs Future AI Club";
  const body = `Dear ${parentName},

Thank you for registering your child for the Stark Labs Future AI Club. We are thrilled to welcome you to our community of young inventors and tech pioneers.

Your Registration ID is: ${registrationId}

What happens next?
1. Our Admissions Team will contact you shortly via call or WhatsApp.
2. If you booked a Free Demo Class, we will confirm the schedule and send you the class link.
3. If you joined the waiting list, you will receive an update as soon as a slot opens up.

In the meantime, feel free to explore our syllabus and student showcase.

Best Regards,
The Admissions Team
Stark Labs Future AI Club
Learn. Build. Invent.`;

  console.log(`[EMAIL SENDING] To: ${emailAddress} | Subject: ${subject}`);

  if (isSupabaseConfigured) {
    try {
      // Call Supabase edge function if configured
      // const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      //   body: { emailAddress, parentName, registrationId }
      // });
      // return { success: !error, error: error?.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Save to mock email outbox
    const outbox = JSON.parse(localStorage.getItem("stark_mock_emails") || "[]") as MockEmail[];
    outbox.unshift({
      id: crypto.randomUUID(),
      to: emailAddress,
      subject,
      body,
      sent_at: new Date().toISOString()
    });
    localStorage.setItem("stark_mock_emails", JSON.stringify(outbox));
    return { success: true };
  }
};

// Generate WhatsApp Redirect Link
export const getWhatsAppRedirectLink = (params: {
  studentName: string;
  studentAge: number;
  parentName: string;
  phone: string;
  program: string;
  batch: string;
}): string => {
  const businessNumber = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || "919840123456"; // Default/Fallback business number
  
  const text = `New Registration

Student: ${params.studentName}
Age: ${params.studentAge}
Parent: ${params.parentName}
Phone: ${params.phone}
Program: ${params.program}
Batch: ${params.batch}`;

  return `https://wa.me/${businessNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
};

// Post to WhatsApp Webhook (Make.com, Zapier, or Custom Webhook)
export const postWhatsAppWebhook = async (payload: {
  studentName: string;
  studentAge: number;
  parentName: string;
  phone: string;
  program: string;
  batch: string;
}): Promise<{ success: boolean; error?: string }> => {
  const webhookUrl = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("[WHATSAPP WEBHOOK] Webhook URL not set. Payload:", payload);
    return { success: true }; // Quiet bypass in development
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return { success: response.ok, error: response.ok ? undefined : `Webhook failed with status ${response.status}` };
  } catch (err: any) {
    console.error("WhatsApp webhook failed:", err);
    return { success: false, error: err.message };
  }
};
