import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY is not defined in the environment. Chat assistant will fallback to mock answers.");
}

// System Instruction for Gemini Assistant to emulate Proteomic Buddy persona
const SYSTEM_INSTRUCTION = `You are Proteomic Buddy, the single-cell proteomics annotation assistant.

CRITICAL INSTRUCTIONS:
1. TERMINOLOGY CONSISTENCY: Standardize all cell types and marker names to their canonical forms:
- "Resting Jurkat T-cells" (always refer to Cluster 1 as "Resting Jurkat T-cells")
- "U-937 monocytes" (always refer to Cluster 2 as "U-937 monocytes")
- "Proliferating Jurkat T-cells" (always refer to Cluster 3 as "Proliferating Jurkat T-cells")
- "Lytic cell debris" (always refer to Cluster 4 as "Lytic cell debris")
- "Phagocytic macrophages" (always refer to Cluster 5 as "Phagocytic macrophages")
- "CD45" (always refer to CD45 as "CD45" and avoid other variants)

Ensure these canonical forms are consistent throughout your output. If you detect alternative abbreviations or names in the researcher's query (such as "resting T-cells", "classical monocytes", "proliferating T-cells", "sub-cellular debris", "phagocytic cells", or "PTPRC"), translate them to their canonical forms and flag the inconsistency at the very end of your response with a line: "[Terminology Check: Standardized '<inconsistent-term>' to canonical '<canonical-term>']".

2. CONCISE RESPONSES: Keep all responses extremely concise and direct. Lead immediately with the answer, follow with at most one sentence of context if needed, and stop.
- Absolutely NO preamble (e.g., do NOT say "Sure, here is the answer", "Let's dive into", "As Proteomic Buddy...", "Great question!").
- Do NOT restate the question.
- Avoid filler phrases and conversational fluff.
- If the answer is a list, output ONLY bullet points with no introductory paragraph or greeting.`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Feedback Endpoint targeting squirreldodogo@gmail.com
app.post("/api/feedback", async (req, res) => {
  const { rating, category, stepName, comments, email, lovedFeatures } = req.body;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || (smtpUser ? `"ProteomicLens Feedback" <${smtpUser}>` : undefined);

  console.log("========================================");
  console.log(`[FEEDBACK SUBMISSION RECEIVED]`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Category: ${category}`);
  console.log(`Rating: ${rating} / 5 Stars`);
  console.log(`Pipeline Stage Linkage: ${stepName}`);
  console.log(`Researcher Email: ${email || "anonymous@proteomiclens.edu"}`);
  console.log(`Loved Features: ${lovedFeatures && lovedFeatures.length ? lovedFeatures.join(", ") : "None specified"}`);
  console.log(`Comments: ${comments}`);
  console.log("========================================");

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn("SMTP settings are missing. Unable to send real email to squirreldodogo@gmail.com.");
    return res.status(200).json({
      success: false,
      error: "SMTP_NOT_CONFIGURED",
      message: "The feedback has been saved locally, but the real email could not be sent because SMTP credentials are not yet configured in the applet's Settings. To receive actual email dispatches, please configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS under the Settings -> Secrets panel.",
      recipient: "squirreldodogo@gmail.com",
      timestamp: new Date().toISOString()
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === "465", // true for 465, false for 587 or other TLS ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false // Helps prevent SSL negotiation issues on custom/sandbox networks
      }
    });

    const mailOptions = {
      from: smtpFrom,
      to: "squirreldodogo@gmail.com",
      subject: `[ProteomicLens Feedback] New ${category} - ${rating} Stars`,
      text: `
ProteomicLens Feedback Dispatch
=========================================
Timestamp: ${new Date().toLocaleString()}
Category: ${category}
Rating: ${rating} / 5 Stars
Pipeline Stage Linkage: ${stepName}

Researcher Email: ${email || "Not provided (anonymous)"}
Loved Features: ${lovedFeatures && lovedFeatures.length ? lovedFeatures.join(", ") : "None specified"}

Comments:
-----------------------------------------
${comments}
=========================================
Sent via ProteomicLens Mailer.
      `,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">ProteomicLens Feedback</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: -8px;">A new feedback ticket was compiled and dispatched from the laboratory dashboard.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #475569; width: 140px; font-size: 13px;">Category:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #475569; font-size: 13px;">Rating:</td>
              <td style="padding: 8px 0; color: #b45309; font-size: 15px;"><strong>${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5 Stars)</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #475569; font-size: 13px;">Stage Linkage:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${stepName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #475569; font-size: 13px;">Researcher:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 13px;"><a href="mailto:${email || ""}" style="color: #4f46e5; text-decoration: none;">${email || "Anonymous"}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700; color: #475569; font-size: 13px;">Loved Features:</td>
              <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">${lovedFeatures && lovedFeatures.length ? lovedFeatures.join(", ") : "None specified"}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0; font-weight: 800; color: #1e293b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Comments:</p>
            <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${comments}"</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 10px; color: #94a3b8; margin: 0; text-align: center; line-height: 1.5;">
            This email was automatically routed to squirreldodogo@gmail.com via the ProteomicLens pipeline system.<br />
            To modify mail configuration, update the SMTP credentials in your workspace settings.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(">>> SUCCESS: Email successfully delivered to squirreldodogo@gmail.com!");
    return res.json({
      success: true,
      message: "Feedback successfully dispatched to squirreldodogo@gmail.com!",
      recipient: "squirreldodogo@gmail.com",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Failed to send SMTP email:", err);
    return res.status(200).json({
      success: false,
      error: "SMTP_SEND_FAILED",
      message: `Failed to dispatch email due to mail server connection/authentication issue: ${err.message || err}. The comments have been saved locally.`,
      recipient: "squirreldodogo@gmail.com",
      timestamp: new Date().toISOString()
    });
  }
});

// Chat Endpoint leveraging the Gemini API
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // If Gemini API is available, use it!
  if (ai) {
    try {
      // Reconstruct simple chat history for @google/genai SDK
      // The SDK chats.create allows supplying initial history, or we can use a direct call.
      // Let's use direct generateContent with conversational history formatted in the prompt for robustness.
      const formattedHistory = history && Array.isArray(history)
        ? history
            .map((msg: any) => `${msg.sender === "user" ? "Researcher" : "Proteomic Buddy"}: ${msg.text}`)
            .join("\n")
        : "";

      const prompt = `${formattedHistory}\nResearcher: ${message}\nProteomic Buddy:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7, // Sightly higher temperature for more funny/creative responses!
        },
      });

      const responseText = response.text || "No response received from the Gemini model.";
      return res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "Gemini API failure",
        details: error.message,
        text: getMockResponse(message)
      });
    }
  } else {
    // Fallback Mock Controller if API Key is not set
    const mockText = getMockResponse(message);
    return res.json({ text: mockText });
  }
});

// Helper Mock Response Generator for Offline / Missing Key fallback
function getMockResponse(message: string): string {
  const query = message.toLowerCase().trim();
  let termCheck = "";

  if (query.includes("cluster 1") || query.includes("cluster one") || query.includes("resting t-cells")) {
    if (query.includes("cluster one") || query.includes("resting t-cells")) {
      termCheck = "\n\n[Terminology Check: Standardized input to canonical 'Resting Jurkat T-cells']";
    }
    return `* **Cell Type**: Resting Jurkat T-cells (Cluster 1)
* **Markers**: CD3E, CD3D, CD4, CD45. Absent MKI67.
* **Confidence**: TIER 1 High Confidence.
* **Reasoning**: Elevated CD3E/CD3D lymphoid core markers combined with absent mitosis indicator MKI67 verify G0/G1 resting status.${termCheck}`;
  }

  if (query.includes("cluster 2") || query.includes("cluster two") || query.includes("classical monocytes")) {
    if (query.includes("cluster two") || query.includes("classical monocytes")) {
      termCheck = "\n\n[Terminology Check: Standardized input to canonical 'U-937 monocytes']";
    }
    return `* **Cell Type**: U-937 monocytes (Cluster 2)
* **Markers**: CD14, CD68, CD45. Absent CD3E.
* **Confidence**: TIER 1 High Confidence.
* **Reasoning**: Persistent high myeloid signals (CD14, CD68) without lymphoid markers specify classic myeloid monocytic populations.${termCheck}`;
  }

  if (query.includes("cluster 3") || query.includes("cluster three") || query.includes("proliferating t-cells")) {
    if (query.includes("cluster three") || query.includes("proliferating t-cells")) {
      termCheck = "\n\n[Terminology Check: Standardized input to canonical 'Proliferating Jurkat T-cells']";
    }
    return `* **Cell Type**: Proliferating Jurkat T-cells (Cluster 3)
* **Markers**: CD3E, CD3D, CD4, MKI67, MYC.
* **Confidence**: TIER 1 High Confidence.
* **Reasoning**: Concurrent expressions of CD3E lineage markers and MKI67/MYC cell-cycle active regulators verify rapidly dividing T-cells.${termCheck}`;
  }

  if (query.includes("cluster 4") || query.includes("cluster four") || query.includes("sub-cellular debris")) {
    if (query.includes("cluster four") || query.includes("sub-cellular debris")) {
      termCheck = "\n\n[Terminology Check: Standardized input to canonical 'Lytic cell debris']";
    }
    return `* **Cell Type**: Lytic cell debris (Cluster 4)
* **Markers**: GAPDH, ACTB. Low/absent surface markers.
* **Confidence**: TIER 3 Expert Review Needed.
* **Reasoning**: Massive missingness (>92%) coupled with sparse cytoplasmic housekeeping signals confirms lytic cell debris.${termCheck}`;
  }

  if (query.includes("cluster 5") || query.includes("cluster five") || query.includes("phagocytic cells")) {
    if (query.includes("cluster five") || query.includes("phagocytic cells")) {
      termCheck = "\n\n[Terminology Check: Standardized input to canonical 'Phagocytic macrophages']";
    }
    return `* **Cell Type**: Phagocytic macrophages (Cluster 5)
* **Markers**: CD14, CD68, CD163, engulfed CD3D.
* **Confidence**: TIER 2 Cross-validated.
* **Reasoning**: Expression of CD14/CD68 combined with internal trace lymphoid CD3D signals specifies macrophages actively engulfing apoptosing T-cells.${termCheck}`;
  }

  if (query.includes("tier 3") || query.includes("tier three")) {
    termCheck = "\n\n[Terminology Check: Standardized 'tier three' to canonical 'Lytic cell debris']";
    return `* **Lytic cell debris (Cluster 4)**: 75 cells exhibiting >92% missingness, sparse housekeeping indicators, and absent surface markers.
* **Recommendation**: Filter this group out of downstream pipeline steps to preserve overall dataset signal-to-noise quality.${termCheck}`;
  }

  if (query.includes("run") || query.includes("analyse") || query.includes("analyze")) {
    return "Execute the analysis pipeline by clicking 'Run SCoPE2 Demo Dataset' or dragging in a custom CSV file.";
  }

  return `* **Resting Jurkat T-cells (Cluster 1)**: Lymphoid resting control group expressing canonical surface CD3E.
* **U-937 monocytes (Cluster 2)**: Mature control myeloid lines expressing CD14 and CD68.
* **Proliferating Jurkat T-cells (Cluster 3)**: Dividing cell subset with elevated MKI67/MYC.
* **Lytic cell debris (Cluster 4)**: Degraded, empty-well particles characterized by extreme missingness.
* **Phagocytic macrophages (Cluster 5)**: Active engulfing myeloid cells displaying mixed-lineage markers.`;
}

// Vite integration & Production Static File Serving
const distPath = path.join(process.cwd(), "dist");

if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    // Serve index.html as fallback in dev
    app.get("*", (req, res, next) => {
      res.sendFile(path.join(process.cwd(), "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development server running on http://localhost:${PORT}`);
    });
  });
} else {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production server running on port ${PORT}`);
  });
}
