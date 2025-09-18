import { GoodsIssue } from '../types/goodsIssue'

const STORAGE_KEY = 'tri.inventory.goodsIssues'

const isBrowser = typeof window !== 'undefined'

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
  if (!isBrowser) {
    return []
  }

  return parseIssues(window.localStorage.getItem(STORAGE_KEY))
}

export const saveStoredGoodsIssues = (issues: GoodsIssue[]) => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(issues))
}

export const appendStoredGoodsIssue = (issue: GoodsIssue) => {
  if (!isBrowser) {
    return
  }

  const current = loadStoredGoodsIssues()
  if (current.some(existing => existing.issue_no === issue.issue_no)) {
    return
  }

  current.unshift(issue)
  saveStoredGoodsIssues(current)
}

export const GOODS_ISSUE_STORAGE_KEY = STORAGE_KEY
