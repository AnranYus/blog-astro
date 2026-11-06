import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import dayjs from 'dayjs'

createPost()

/**
 * Create a new post.
 * Prompts the user for a file name and extension, and creates a new post file with frontmatter.
 * If successful, opens the new post file in the default editor.
 */
async function createPost(): Promise<void> {
  consola.start('Ready to create a new post!')

  const filename = ask('Enter file name:')
  if (!filename) {
    consola.error('File name is required!')
    return
  }

  const extension = ask('File extension (md/mdx):', 'md').toLowerCase().replace(/^\./, '')
  if (extension !== 'md' && extension !== 'mdx') {
    consola.error(`Unsupported file extension: ${extension}`)
    return
  }

  const isDraft = askYesNo('Is this a draft? (y/n):', true)

  const targetDir = './src/content/posts/'
  const fullPath: string = path.join(targetDir, `${filename}.${extension}`)

  const frontmatter = getFrontmatter({
    title: filename,
    pubDate: dayjs().format('YYYY-MM-DD'),
    categories: '[]',
    description: '\'\'',
    slug: filename.toLowerCase().replace(/\s+/g, '-'),
    draft: isDraft ? 'true' : 'false',
  })

  try {
    fs.writeFileSync(fullPath, frontmatter)
    consola.success('New post created successfully!')

    if (askYesNo('Open the new post? (y/n):', true)) {
      consola.info(`Opening ${fullPath}...`)
      execSync(`code "${fullPath}"`)
    }
  }
  catch (error) {
    consola.error((error as Error).message || 'Failed to create new post!')
  }
}

/**
 * Ask a question in the terminal using Bun's built-in prompt().
 * consola.prompt() does not work under Bun: it never receives the typed text.
 * @param message The question to show.
 * @param fallback The value used when the user just presses Enter.
 * @returns The trimmed answer.
 */
function ask(message: string, fallback = ''): string {
  // eslint-disable-next-line no-alert -- This is Bun's terminal prompt, not a browser dialog.
  const answer = fallback ? prompt(message, fallback) : prompt(message)
  return (answer ?? fallback).trim()
}

/**
 * Ask a yes/no question in the terminal.
 * @param message The question to show.
 * @param fallback The value used when the user just presses Enter.
 * @returns Whether the user answered yes.
 */
function askYesNo(message: string, fallback: boolean): boolean {
  return ask(message, fallback ? 'y' : 'n').toLowerCase().startsWith('y')
}

/**
 * Create frontmatter from a data object.
 * @param data The data object to convert to frontmatter.
 * @returns The frontmatter as a string.
 */
function getFrontmatter(data: { [key: string]: string }): string {
  const frontmatter = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  return `---\n${frontmatter}\n---`
}
