# My Website
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/Seanmcn/my-website?style=for-the-badge)
![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/Seanmcn/my-website?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Seanmcn/my-website?style=for-the-badge)
[![Cypress Test Runs](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/m1uz2r&style=for-the-badge&logo=cypress)](https://dashboard.cypress.io/projects/m1uz2r/runs)

## 📖 About

This repository houses the codebase for my personal website, [seanmcn.com](https://seanmcn.com).

Built with the power of Gatsby, the site dynamically serves blog content sourced from Markdown & [MDX](https://mdxjs.com/) files located in [content/blog](https://github.com/Seanmcn/my-website/tree/develop/content/blog). Deployment is made seamless with AWS Amplify, using a [custom image](https://gallery.ecr.aws/y1e1i7y7/gatsby-5.11_amazonlinux-latest) for optimised performance.

## 🔄 CI/CD Branching Strategy

- **Development:** [develop branch](https://github.com/Seanmcn/my-website/tree/develop) → [develop.seanmcn.com](https://develop.seanmcn.com)
- **Production:** [main branch](https://github.com/Seanmcn/my-website/tree/main) → [seanmcn.com](https://seanmcn.com)

## 🛠 Technology Stack
- **Framework:** [Gatsby](https://gatsbyjs.org/)
- **UI Library:** [ReactJS](https://reactjs.org/)
- **CSS Framework:** [Bulma](https://bulma.io/)
- **Icon Library:** [Font Awesome](https://fontawesome.com/)
- **Deployment & Hosting:** [AWS Amplify](https://aws.amazon.com/amplify/)