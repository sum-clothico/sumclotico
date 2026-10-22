/**
 * @file app/api/journal/submit/route.js
 * @description API endpoint to receive community story submissions with social sharing permissions.
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, instagramHandle, category, message, allowSocialShare } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Name, email, and story message are required." },
        { status: 400 }
      );
    }

    const submission = {
      id: `story-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      instagramHandle: (instagramHandle || "").trim(),
      category: category || "Story",
      message: message.trim(),
      allowSocialShare: Boolean(allowSocialShare),
      submittedAt: new Date().toISOString(),
      status: "PENDING_REVIEW",
    };

    console.log(
      "%c[Community Journal Submission Received]",
      "background: #f35c27; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 4px;",
      `${submission.name} (${submission.category}) - Share Allowed: ${submission.allowSocialShare}`
    );

    try {
      const origin = request.headers.get("origin") || `http://localhost:${process.env.PORT || 3000}`;
      await fetch(`${origin}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "JOURNAL_SUBMISSION",
          data: submission,
        }),
      });
    } catch (err) {
      console.error("[journal/submit] email dispatch failed:", err.message);
    }

    return Response.json({
      success: true,
      message: "Thank you for sharing your story with Sum Clothico. Our editorial team will review it thoughtfully.",
      submissionId: submission.id,
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
