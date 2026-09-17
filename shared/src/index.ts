export const isUtfprStudentEmail = (email: string): boolean => {
  if (!email) return false;
  return (
    email.endsWith("@utfpr.edu.br") || email.endsWith("@alunos.utfpr.edu.br")
  );
};
