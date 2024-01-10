# saas-template

1. Clone the repository: `git clone <url> my-project`
2. Install dependencies: `yarn`
3. Create a `.env` file (see `.env.template` for variables)
4. Apply the initial db migration: `npx prisma migrate dev`
5. Seed the db: `npx prisma db seed`
6. Run the dev server: `yarn dev`

Or just run this single command that does everything above
```bash
git clone https://github.com/bryantbrock/saas-template.git my-project && cd my-project && yarn && cp .env.example .env && npx prisma migrate dev && npx prisma db seed && yarn dev
```
