-- =============================================
-- Seed data for development
-- =============================================

insert into documents (title, file_type, status) values
  ('Sample Invoice.pdf',   'application/pdf',  'uploaded'),
  ('Contract Draft.docx',  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'uploaded'),
  ('Meeting Notes.txt',    'text/plain',        'uploaded');
