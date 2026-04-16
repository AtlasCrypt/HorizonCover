# Contributing to HorizonCover

Welcome! We are incredibly excited you are interested in contributing to HorizonCover. This repository is participating in the **Stellar Drips Wave Program**, meaning your contributions may be eligible for retroactive funding and rewards based on the Drips point system.

## The Drips Point System

We manage all our work through the GitHub Issues board. Issues are pre-scoped and tagged with difficulty and area labels. 

To ensure fair attribution for the Wave program:
1. **Find an Issue:** Browse the open issues. If it is unassigned, comment "I would like to work on this."
2. **Wait for Assignment:** A maintainer will formally assign the issue to you. **Do not start work until you are assigned.**
3. **Submit a PR:** Once assigned, link your PR to the issue.
4. **Merge & Points:** Once reviewed and merged, your contribution will be logged for the Drips Wave program!

## Development Setup

HorizonCover is a monorepo built with `pnpm`.

### Prerequisites
- [Rust](https://rustup.rs/) (latest stable) and the `wasm32-unknown-unknown` target.
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup)
- Node.js (v20+) and [pnpm](https://pnpm.io/)

### Local Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the smart contracts:
   ```bash
   pnpm build:contracts
   ```
4. Run the frontend:
   ```bash
   cd frontend
   pnpm dev
   ```

## Git Workflow & Branching

Please branch off `main` using the following convention:
- `feat/issue-number-short-desc` (e.g., `feat/12-payout-formula`)
- `fix/issue-number-short-desc` (e.g., `fix/14-vault-balance-bug`)
- `docs/issue-number-short-desc`

### Commit Messages
We follow [Conventional Commits](https://www.conventionalcommits.org/). Your commit messages should look like:
- `feat(core): implement solvency check`
- `fix(frontend): resolve wallet disconnect error`
- `test(monitor): add mock protocol exploit simulation`

## Pull Request Guidelines

1. Use the provided PR template.
2. Reference the issue you are solving (`Closes #12`).
3. Ensure all local tests pass (`cargo test`).
4. Keep your PRs highly focused. If you are doing a large refactor, please open an issue to discuss it first.

Thank you for helping us build the future of parametric DeFi insurance on Stellar!
