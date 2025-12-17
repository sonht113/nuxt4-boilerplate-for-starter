# Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system or external dependencies
- **ci**: CI configuration changes
- **chore**: Other changes that don't modify src or test files
- **revert**: Revert a previous commit

## Examples

### Good commit messages

```bash
feat: add user authentication
fix: resolve recipe creation bug
docs: update API documentation
refactor: simplify auth logic
```

### With scope and body

```bash
feat(auth): add JWT token refresh

Implement automatic token refresh using refresh tokens.
This prevents users from being logged out unexpectedly.

Closes #123
```

### Breaking changes

```bash
feat!: change API response format

BREAKING CHANGE: API now returns data in a different format.
All clients need to update their response handling.
```

## Testing Commit Messages

You can test your commit message before committing:

```bash
echo "feat: test message" | npx commitlint
```
