import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // Override the default config here
  site: {
    title: 'Nothing blog',
    subtitle: 'in here',
    author: 'Nothing',
    website: 'https://blog.uni.moe/',
    socialLinks: [],
    categoryMap: [],
  },
  seo: {
    twitter: '',
  },
}
