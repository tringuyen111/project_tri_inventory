import { GoodsIssue } from '../types/goodsIssue'

const STORAGE_KEY = 'tri.inventory.goodsIssues'

const isBrowser = typeof window !== 'undefined'

const getLocalStorage = () => {
  if (!isBrowser) {
    return null
  }

  try {
    return window.localStorage
  } catch (error) {
    console.warn('Unable to access localStorage for goods issues', error)
    return null
  }
}

const parseIssues = (raw: string | null): GoodsIssue[] => {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as GoodsIssue[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(issue => issue && typeof issue.issue_no === 'string')
  } catch (error) {
    console.warn('Failed to parse stored goods issues', error)
    return []
  }
}

export const loadStoredGoodsIssues = (): GoodsIssue[] => {
  const storage = getLocalStorage()
  if (!storage) {
    return []
  }

  try {
    return parseIssues(storage.getItem(STORAGE_KEY))
  } catch (error) {
    console.warn('Failed to read stored goods issues', error)
    return []
  }
}

export const saveStoredGoodsIssues = (issues: GoodsIssue[]): boolean => {
  const storage = getLocalStorage()
  if (!storage) {
    return false
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(issues))
    return true
  } catch (error) {
    console.warn('Failed to save goods issues', error)
    return false
  }
}

export type AppendGoodsIssueResult = 'added' | 'duplicate' | 'unavailable' | 'error'

export const appendStoredGoodsIssue = (issue: GoodsIssue): AppendGoodsIssueResult => {
  const storage = getLocalStorage()
  if (!storage) {
    return 'unavailable'
  }

  const current = loadStoredGoodsIssues()
  if (current.some(existing => existing.issue_no === issue.issue_no)) {
    return 'duplicate'
  }

  current.unshift(issue)
  return saveStoredGoodsIssues(current) ? 'added' : 'error'
}

export const GOODS_ISSUE_STORAGE_KEY = STORAGE_KEY
