#
# 🧑‍💻 Development
#
FROM node:21-alpine as dev
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

# Create non-root user for Docker
RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

# Copy source code into app folder
COPY --chown=node:node . .

# Install dependencies
RUN yarn --frozen-lockfile

# Set Docker as a non-root user
USER node

#
# 🏡 Production Build
#
FROM node:21-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production
ARG DATABASE_NAME
ARG DATABASE_HOST
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG REDIS_HOST
ARG REDIS_PORT
ARG SESSION_SECRET
ENV DATABASE_NAME $DATABASE_NAME
ENV DATABASE_HOST $DATABASE_HOST
ENV DATABASE_USER $DATABASE_USER
ENV DATABASE_PASSWORD $DATABASE_PASSWORD
ENV REDIS_HOST $REDIS_HOST
ENV REDIS_PORT $REDIS_PORT
ENV SESSION_SECRET $SESSION_SECRET
ENV GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET $GOOGLE_CLIENT_SECRET

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 node  || true
RUN adduser --system --uid 1001 node  || true

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN yarn --frozen-lockfile --production && yarn cache clean

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:21-alpine as prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production
ARG DATABASE_NAME
ARG DATABASE_HOST
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG REDIS_HOST
ARG REDIS_PORT
ARG SESSION_SECRET
ENV DATABASE_NAME $DATABASE_NAME
ENV DATABASE_HOST $DATABASE_HOST
ENV DATABASE_USER $DATABASE_USER
ENV DATABASE_PASSWORD $DATABASE_PASSWORD
ENV REDIS_HOST $REDIS_HOST
ENV REDIS_PORT $REDIS_PORT
ENV SESSION_SECRET $SESSION_SECRET
ENV GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET $GOOGLE_CLIENT_SECRET

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 node  || true
RUN adduser --system --uid 1001 node  || true

# Copy only the necessary files
COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

# Set Docker as non-root user
USER node

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
