import type { NangoSync, GithubPR } from '../../models'

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

    // For each repository, fetch pull requests
    for (const repo of repos.data) {
      const prs = await nango.get({
        endpoint: `/repos/${repo.owner.login}/${repo.name}/pulls`,
        params: {
          state: 'all',
          per_page: '100',
        },
      })

      const mappedPRs: GithubPR[] = prs.data.map((pr: any) => ({
        id: pr.id.toString(),
        title: pr.title,
        body: pr.body || '',
        state: pr.state,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        head: {
          ref: pr.head.ref,
        },
        base: {
          ref: pr.base.ref,
        },
      }))

      await nango.batchSave(mappedPRs, 'GithubPR')
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch GitHub pull requests: ${error.message}`)
  }
}

