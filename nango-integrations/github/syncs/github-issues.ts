import type { NangoSync, GithubIssue } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    // Fetch all repositories
    const repos = await nango.get({
      endpoint: '/user/repos',
      params: {
        per_page: '100',
        sort: 'updated',
      },
    })

    // For each repository, fetch issues
    for (const repo of repos.data) {
      const issues = await nango.get({
        endpoint: `/repos/${repo.owner.login}/${repo.name}/issues`,
        params: {
          state: 'all',
          per_page: '100',
        },
      })

      const mappedIssues: GithubIssue[] = issues.data.map((issue: any) => ({
        id: issue.id.toString(),
        title: issue.title,
        body: issue.body || '',
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        user: {
          login: issue.user.login,
          avatar_url: issue.user.avatar_url,
        },
      }))

      await nango.batchSave(mappedIssues, 'GithubIssue')
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch GitHub issues: ${error.message}`)
  }
}

