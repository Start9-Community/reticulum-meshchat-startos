import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Written and owned by MeshChat's own Interfaces page. Handled as raw text: RNS
// accepts several config dialects and a structured round-trip would rewrite
// sections this package has no business touching.
export const rnsConfig = FileHelper.string({
  base: sdk.volumes.main,
  subpath: './.reticulum/config',
})

// The [[Default Interface]] block RNS generates in a fresh config.
const DEFAULT_INTERFACES_SECTION = `[interfaces]

  [[Default Interface]]
    type = AutoInterface
    enabled = Yes
`

// Top-level sections are single-bracket ([interfaces]); interface definitions
// nest below as double-bracket ([[Name]]).
const isTopLevelHeader = (line: string) => {
  const t = line.trim()
  return t.startsWith('[') && !t.startsWith('[[') && t.endsWith(']')
}

export function stripCustomInterfaces(config: string): string {
  const lines = config.split('\n')
  const start = lines.findIndex((l) => l.trim() === '[interfaces]')
  if (start === -1) {
    return config.trimEnd() + '\n\n' + DEFAULT_INTERFACES_SECTION
  }
  let end = lines.length
  for (let ii = start + 1; ii < lines.length; ii++) {
    if (isTopLevelHeader(lines[ii])) {
      end = ii
      break
    }
  }
  return [
    ...lines.slice(0, start),
    DEFAULT_INTERFACES_SECTION,
    ...lines.slice(end),
  ].join('\n')
}
