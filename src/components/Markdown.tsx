/** Renderiza Markdown a HTML con la tipografía de marca (.prose-vz). */
import { marked } from 'marked'

export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const html = marked.parse(source, { async: false }) as string
  return <div className={`prose-vz ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
