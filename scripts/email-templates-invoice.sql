-- Run this in your Supabase SQL editor to add invoice email templates.
-- Uses INSERT ... ON CONFLICT DO NOTHING so it's safe to re-run.

INSERT INTO email_templates (id, name, subject, heading, body, note)
VALUES
  (
    'invoice_delivery',
    'Invoice Delivery',
    'Invoice {{invoice_number}} from Axis Living',
    'Your invoice is ready.',
    'Hi {{name}}, please find your invoice for <strong>{{project}}</strong> below. Payment is due by {{due_date}}.',
    'Questions about this invoice? Reply to this email or reach us at hello@axisliving.co.zm.'
  ),
  (
    'invoice_reminder',
    'Invoice Reminder',
    'Friendly reminder: Invoice {{invoice_number}} due {{due_date}}',
    'A friendly payment reminder.',
    'Hi {{name}}, this is a reminder that invoice {{invoice_number}} for <strong>{{project}}</strong> has a balance of <strong>{{amount}}</strong> due by {{due_date}}. Please arrange payment at your earliest convenience.',
    'Questions about this invoice? Reply to this email or reach us at hello@axisliving.co.zm.'
  )
ON CONFLICT (id) DO NOTHING;
