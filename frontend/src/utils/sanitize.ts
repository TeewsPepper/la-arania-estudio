// src/utils/sanitize.ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Elimina etiquetas HTML
export const stripTags = (s: string) => s.replace(/<\/?[^>]+(>|$)/g, "");

// Borra caracteres de control (pero conserva Unicode, tabs y saltos de línea)
export const removeControlChars = (s: string) =>
  s.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "");

// Normaliza espacios. Si allowNewlines=true, preserva saltos de línea.
export function normalizeWhitespace(s: string, allowNewlines = false): string {
  if (allowNewlines) {
    return s
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return s.replace(/\s+/g, " ").trim();
}

// Sanitiza texto plano para inputs (no passwords)
export function sanitizePlainText(
  input: string,
  opts?: { maxLength?: number; allowNewlines?: boolean }
): string {
  let s = String(input ?? "");
  s = removeControlChars(s);
  s = stripTags(s);
  s = s.replace(/[<>]/g, ""); // quita ángulos por si acaso
  s = normalizeWhitespace(s, !!opts?.allowNewlines);
  if (opts?.maxLength && s.length > opts.maxLength) s = s.slice(0, opts.maxLength);
  return s;
}

// Valida/sanitiza email
export function sanitizeEmail(email: string): string {
  const e = sanitizePlainText(email, { maxLength: 120 }).toLowerCase();
  // Regex simple y práctica para emails comunes
  const emailRegex =
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(e)) throw new ValidationError("Email inválido.");
  return e;
}

// (Opcional) “limpia” nombres permitiendo letras, espacios, ' y guiones
export function sanitizeHumanName(nombre: string, max = 60): string {
  let s = sanitizePlainText(nombre, { maxLength: max });
  // Conserva letras (incluye acentos), espacios, apóstrofes y guiones
  s = s.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s'’-]/g, "");
  if (s.length < 2) throw new ValidationError("Nombre demasiado corto.");
  return s;
}

/* ---- Sanitizadores por formulario (opcional) ---- */

export function sanitizeContactForm(values: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const name = sanitizeHumanName(values.name);
  const email = sanitizeEmail(values.email);
  const subject = sanitizePlainText(values.subject, { maxLength: 80 });
  const message = sanitizePlainText(values.message, {
    maxLength: 1000,
    allowNewlines: true,
  });
  if (!subject) throw new ValidationError("Asunto requerido.");
  if (!message) throw new ValidationError("Mensaje requerido.");
  return { name, email, subject, message };
}

export function sanitizeLoginForm(values: { email: string; password: string }) {
  const email = sanitizeEmail(values.email);
  const password = String(values.password ?? "");
  if (password.length < 8) throw new ValidationError("Contraseña demasiado corta.");
  
  return { email, password };
}

export function sanitizeRegisterForm(values: {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const name = sanitizeHumanName(values.nombre);
  const email = sanitizeEmail(values.email);
  const password = String(values.password ?? "");
  const confirm = String(values.confirmPassword ?? "");
  if (password.length < 8) throw new ValidationError("La contraseña debe tener al menos 8 caracteres.");
  if (password !== confirm) throw new ValidationError("Las contraseñas no coinciden.");
  return { name, email, password, confirm };
}
