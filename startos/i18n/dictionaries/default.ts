export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Reticulum MeshChat!': 0,
  'Web UI': 1,
  'MeshChat is serving its web interface': 2,
  'MeshChat is not yet listening. Check the service logs.': 3,
  'The MeshChat web interface — messages, network interfaces, and settings': 4,
  'Reset Network Interfaces': 5,
  'Remove all custom RNS interfaces, keeping only the default. Use this if a misconfigured interface prevents MeshChat from starting.': 6,
  'Custom interface definitions will be deleted. Your identity and messages are untouched.': 7,
  'Interfaces Reset': 8,
  'No RNS config found — nothing to reset.': 9,
  'All custom interfaces removed. Restart the service to apply.': 10,
  'Set Web UI Password': 11,
  'Reset Web UI Password': 12,
  'Generate the password for the MeshChat web interface. The username is always "admin". Running this again replaces the existing password.': 13,
  'The current password stops working as soon as this runs.': 14,
  'Web UI Password Set': 15,
  'Your browser asks for these the next time you open the Web UI. Save the password now — it is not shown again.': 16,
  Username: 17,
  Password: 18,
  'MeshChat has no login of its own — set a password before starting it': 19,
  'Enabling automatic announces': 20,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
