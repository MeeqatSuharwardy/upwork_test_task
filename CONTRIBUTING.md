# Contributing to Nango Next.js Integration Demo

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

This project follows a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Descriptive and specific
- **Steps to reproduce** - Detailed steps to recreate the issue
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Environment details** - OS, Node version, browser, etc.
- **Screenshots** - If applicable

Example:
```markdown
## Bug: OAuth redirect fails on Safari

**Steps to reproduce:**
1. Open app in Safari 17.0
2. Click "Connect GitHub"
3. Authorize on GitHub
4. Observe redirect behavior

**Expected:** Should redirect back to app with connection
**Actual:** Gets stuck on GitHub with "redirect_uri_mismatch" error

**Environment:**
- macOS Sonoma 14.0
- Safari 17.0
- Node.js 18.17.0
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear use case** - Why is this enhancement needed?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches you thought about
- **Additional context** - Screenshots, mockups, examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add: Description of your changes"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Include screenshots if UI changes

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Nango account

### Setup
```bash
# Clone your fork
git clone https://github.com/your-username/nango-nextjs-demo.git
cd nango-nextjs-demo

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Nango keys

# Run development server
npm run dev
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Add proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

```typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// Avoid
function getUser(id: any): any {
  // ...
}
```

### React Components
- Use functional components
- Use hooks appropriately
- Extract reusable logic to custom hooks
- Keep components focused and small

```typescript
// Good
export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  // ...
}

// Component should be < 200 lines
```

### API Routes
- Validate all inputs
- Handle errors gracefully
- Return consistent response format
- Use proper HTTP status codes

```typescript
// Good
export async function GET(request: NextRequest) {
  try {
    // Validate input
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      )
    }

    // Process request
    const data = await fetchData(id)

    // Return success
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    // Handle error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use theme colors

```tsx
// Good
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
  Connect
</button>
```

## Testing

### Unit Tests
```typescript
// __tests__/lib/nango-client.test.ts
import { describe, it, expect } from 'vitest'
import { createConnection } from '@/lib/nango-client'

describe('createConnection', () => {
  it('should create a connection', async () => {
    // Test implementation
  })
})
```

### Integration Tests
- Test API routes
- Test component interactions
- Test OAuth flows (with mocks)

### Running Tests
```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- coverage # Coverage report
```

## Documentation

### Code Comments
- Comment complex logic
- Explain "why" not "what"
- Keep comments up to date

```typescript
// Good
// Retry with exponential backoff to handle rate limits
await retryWithBackoff(() => fetchData())

// Not needed
// Increment counter
counter++
```

### Documentation Files
- Update README.md for feature changes
- Update SETUP_GUIDE.md for setup changes
- Update ADVANCED_USAGE.md for new patterns
- Add JSDoc comments for public APIs

```typescript
/**
 * Creates a new integration connection
 * @param config - Connection configuration
 * @returns Promise that resolves when connection is created
 * @throws {Error} If authentication fails
 */
export async function createConnection(
  config: ConnectionConfig
): Promise<boolean> {
  // ...
}
```

## Adding New Integrations

When adding a new integration provider:

1. **Update `nango.yaml`**
   ```yaml
   integrations:
     new-provider:
       provider: new-provider
       syncs:
         new-provider-data:
           runs: every 1h
           output: NewProviderData
   ```

2. **Create sync script**
   ```typescript
   // nango-integrations/new-provider/syncs/new-provider-data.ts
   import type { NangoSync, NewProviderData } from '../../models'
   
   export default async function fetchData(nango: NangoSync) {
     // Implementation
   }
   ```

3. **Add data model**
   ```typescript
   // nango-integrations/models.ts
   export interface NewProviderData {
     id: string
     // ...
   }
   ```

4. **Update UI**
   ```typescript
   // components/IntegrationsList.tsx
   const integrations = [
     // ...
     {
       id: 'new-provider',
       name: 'New Provider',
       description: 'Connect to New Provider',
       icon: '🔌',
       type: 'custom'
     }
   ]
   ```

5. **Add documentation**
   - Update README.md with setup instructions
   - Add example usage
   - Document any special requirements

6. **Test thoroughly**
   - Test OAuth flow
   - Test data sync
   - Test error cases

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Deploy to production

```bash
npm version patch  # or minor, major
git push origin main --tags
```

## Questions?

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Join Nango Slack community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

