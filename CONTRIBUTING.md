# Contributing to AURUM

Thank you for your interest in contributing to AURUM! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project follows the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported by searching existing issues
2. Create a new issue with a clear description, including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Use our feature request issue template
2. Describe the feature and its benefits
3. Include any implementation ideas

### Submitting Code

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```sh
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AURUM.git
cd AURUM

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running Tests

```sh
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Update the CHANGELOG.md with your changes
3. The PR will be merged once it receives approval from a maintainer
4. Follow conventional commit messages

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed
- Keep pull requests focused on a single change

## Questions?

Feel free to open an issue with your question, and a maintainer will get back to you.
