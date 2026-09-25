export const DEFAULT_WHATSAPP_SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_PHONE || '+23566000000'

export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '')
  if (digits.length === 8 && (digits.startsWith('6') || digits.startsWith('7') || digits.startsWith('9'))) {
    return '235' + digits
  }
  return digits
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const normalizedPhone = cleanPhoneForWhatsApp(phone)
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`
}

export function getOrderWhatsAppFollowupUrl(orderReference: string, customerName?: string): string {
  const phone = DEFAULT_WHATSAPP_SUPPORT_PHONE
  const namePart = customerName ? ` au nom de ${customerName.trim()}` : ''
  const message = `Bonjour Dounia Market, je vous contacte concernant le suivi de ma commande *${orderReference}*${namePart}. Pouvez-vous m'indiquer l'état d'acheminement ?`
  return buildWhatsAppLink(phone, message)
}

export function getGeneralWhatsAppSupportUrl(subject?: string): string {
  const phone = DEFAULT_WHATSAPP_SUPPORT_PHONE
  const message = subject
    ? `Bonjour Dounia Market, j'ai une question concernant : ${subject}.`
    : `Bonjour Dounia Market, j'aimerais avoir des informations sur vos services et livraisons.`
  return buildWhatsAppLink(phone, message)
}
