import { Linking } from 'react-native';

/** Abre WhatsApp con el valor del perfil (teléfono o URL). */
export async function openWhatsapp(value: string | null | undefined): Promise<boolean> {
  if (!value?.trim()) return false;

  const trimmed = value.trim();
  let url = trimmed;

  if (!trimmed.startsWith('http')) {
    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return false;
    url = `https://wa.me/${digits}`;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) return false;
  await Linking.openURL(url);
  return true;
}

export async function openExternalUrl(url: string | null | undefined): Promise<boolean> {
  if (!url?.trim()) return false;
  let target = url.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }
  const canOpen = await Linking.canOpenURL(target);
  if (!canOpen) return false;
  await Linking.openURL(target);
  return true;
}
