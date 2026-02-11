export type TabId = 'home' | 'search' | 'favorites' | 'settings'

export interface Tab {
  id: TabId
  label: string
  icon: string
}
