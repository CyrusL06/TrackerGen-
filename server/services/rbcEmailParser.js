const MAX_EMAIL_TEXT_LENGTH = 100_000;
const MAX_SUBJECT_LENGTH = 500;
const MONEY_PATTERN = "(?:CAD|C\\$|\\$)\\s*([0-9]{1,9}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)";

export class RbcEmailParseError extends Error {
  /** Creates a stable parser failure without retaining untrusted email contents. */
  constructor(code, message) {
    super(message);
    this.name = "RbcEmailParseError";
    this.code = code;
  }
}

// Normalizes and bounds untrusted email text before pattern matching.
function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r\n?/g, "\n")
    .slice(0, maxLength)
    .trim();
}

// Extracts a bounded positive purchase amount from normalized RBC alert text.
function parseAmount(text) {
  const patterns = [
    new RegExp(`(?:purchase|transaction)\\s+amount\\s*[:\\-]?\\s*${MONEY_PATTERN}`, "i"),
    new RegExp(`(?:purchase|transaction)(?:\\s+(?:of|for))?\\s+${MONEY_PATTERN}`, "i"),
    new RegExp(`amount\\s*[:\\-]?\\s*${MONEY_PATTERN}`, "i"),
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const amount = Number(match[1].replaceAll(",", ""));
    if (Number.isFinite(amount) && amount > 0 && amount <= 1_000_000_000) {
      return amount;
    }
  }

  return null;
}

// Normalizes and bounds merchant text before it becomes transaction-owned data.
function cleanMerchant(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:\s]+$/g, "")
    .trim()
    .slice(0, 200);
}

// Extracts a merchant only from recognized purchase phrasing.
function parseMerchant(text) {
  const labelled = text.match(/(?:merchant|transaction description)\s*[:\-]\s*([^\n]{2,200})/i);
  if (labelled) return cleanMerchant(labelled[1]);

  const sentence = text.match(
    /(?:purchase|transaction)(?:\s+(?:of|for))?\s+(?:(?:CAD|C\$|\$)\s*[0-9,]+(?:\.[0-9]{2})?)\s+at\s+([^\n]{2,200}?)(?=\s+(?:on|using|with|was|for card|card ending)\b|[.]\s|\n|$)/i,
  );
  return sentence ? cleanMerchant(sentence[1]) : null;
}

// Extracts only the non-secret last four card digits from alert text.
function parseCardSuffix(text) {
  const match = text.match(
    /(?:ending(?:\s+in)?|last\s+four\s+digits|card\s+number)\s*[:#-]?\s*(?:x+|\*+)?\s*(\d{4})\b/i,
  );
  return match?.[1] ?? null;
}

// Formats a parsed date in the configured transaction timezone.
function formatDateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(
    // Converts formatter-owned date parts into a lookup entry.
    (part) => [part.type, part.value],
  ));
  return `${values.year}-${values.month}-${values.day}`;
}

// Uses an alert date when present and otherwise falls back to trusted delivery time.
function parseDate(text, receivedAt, timeZone) {
  const isoMatch = text.match(/(?:date|transaction date)\s*[:\-]?\s*(\d{4}-\d{2}-\d{2})/i);
  if (isoMatch) return isoMatch[1];

  const namedMatch = text.match(
    /(?:date|transaction date)\s*[:\-]?\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4})/i,
  );
  if (namedMatch) {
    const parsed = new Date(namedMatch[1]);
    if (!Number.isNaN(parsed.getTime())) return formatDateInTimeZone(parsed, timeZone);
  }

  const fallback = new Date(receivedAt);
  if (Number.isNaN(fallback.getTime())) {
    throw new RbcEmailParseError("invalid_received_at", "The email received time is invalid");
  }
  return formatDateInTimeZone(fallback, timeZone);
}

// Maps normalized merchant names to the application's fixed category set.
function categorizeMerchant(merchant) {
  const value = merchant.toLowerCase();
  if (/tim hortons|starbucks|restaurant|cafe|coffee|doordash|uber eats/.test(value)) return "Food & Drink";
  if (/translink|uber|lyft|taxi|shell|esso|petro|chevron/.test(value)) return "Transport";
  if (/netflix|spotify|disney|crave|subscription/.test(value)) return "Subscriptions";
  if (/walmart|costco|safeway|save-on|superstore|loblaws|grocery/.test(value)) return "Shopping";
  return "Other";
}

/** Parses bounded RBC alert content into a pending transaction candidate without establishing sender trust. */
export function parseRbcPurchaseEmail({
  subject,
  text,
  receivedAt = new Date().toISOString(),
  timeZone = "America/Vancouver",
}) {
  const safeSubject = cleanText(subject, MAX_SUBJECT_LENGTH);
  const safeText = cleanText(text, MAX_EMAIL_TEXT_LENGTH);
  const combined = `${safeSubject}\n${safeText}`;

  if (!safeText) {
    throw new RbcEmailParseError("missing_text", "The email has no plain-text content");
  }
  if (!/\brbc\b/i.test(combined) || !/\b(?:purchase|transaction|credit card)\b/i.test(combined)) {
    throw new RbcEmailParseError("not_rbc_purchase", "The email is not a recognized RBC purchase alert");
  }

  const amount = parseAmount(combined);
  const merchant = parseMerchant(combined);
  if (amount === null) {
    throw new RbcEmailParseError("missing_amount", "The RBC purchase amount could not be found");
  }
  if (!merchant) {
    throw new RbcEmailParseError("missing_merchant", "The RBC merchant could not be found");
  }

  const accountLastFour = parseCardSuffix(combined);
  return {
    institution: "rbc",
    type: "expense",
    merchant,
    amount,
    currency: /\bUSD\b/i.test(combined) ? "USD" : "CAD",
    date: parseDate(combined, receivedAt, timeZone),
    accountLastFour,
    category: categorizeMerchant(merchant),
    status: "pending",
    confidence: accountLastFour ? 0.98 : 0.92,
  };
}
