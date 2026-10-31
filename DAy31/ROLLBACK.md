# Rollback Plan and Evidence Record

This is a procedure template, not proof that a rollback has already happened. Complete the evidence section only after a real deployment and rollback.

## Recommended approach for a shared branch
1. Record a known-good commit hash and optionally tag it: `git tag v1.0.0`.
2. Push the tag: `git push origin v1.0.0`.
3. Inspect history: `git log --oneline`.
4. Reverse a faulty commit without rewriting shared history:
   `git revert <bad-commit-hash>`
5. Push the revert commit: `git push origin main`.
6. Wait for the hosting provider to redeploy and test the live URL.

## Restore a known-good version locally
`git switch -c recovery-v1 v1.0.0`

Coordinate before changing a shared branch. Avoid `git reset --hard` on a shared branch unless the team approves rewriting history.

## Evidence record — fill after execution
- Live site URL:
- Hosting provider:
- Known-good commit:
- Faulty commit:
- Rollback commit:
- Date/time:
- Verification performed:
- Screenshot filenames:

Do not invent commit hashes, deployment results or screenshots.
