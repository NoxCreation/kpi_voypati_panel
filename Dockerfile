# ========= ETAPA DE CONSTRUCCIÓN =========
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS builder

WORKDIR /app

# 1. Configuración de entorno
ENV NEXT_TELEMETRY_DISABLED=1
ENV YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn
ENV NODE_ENV=production

# 2. Instalación de dependencias
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --network-timeout 1000000

# 3. Copia de TODOS los archivos necesarios
COPY . .

# 4. Build de la aplicación
RUN yarn build

# ========= ETAPA DE EJECUCIÓN =========
FROM mcr.microsoft.com/playwright:v1.52.0-jammy AS runner

WORKDIR /app

# 1. Configuración de usuario seguro
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 2. Copia de TODOS los archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app ./
#COPY --from=builder --chown=nextjs:nodejs /app/public ./public
#COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
#COPY --from=builder --chown=nextjs:nodejs /app/database.sqlite ./
#COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
#COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
#COPY --from=builder --chown=nextjs:nodejs /app/server.js ./
#COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
#COPY --from=builder --chown=nextjs:nodejs /app/next-i18next.config.js ./
#COPY --from=builder --chown=nextjs:nodejs /app/.env ./.env
#COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# 3. Permisos y configuración final
RUN mkdir -p /app && \
    chown -R nextjs:nodejs /app && \
    chmod -R 766 /app
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV=production

# 4. Comando de inicio
CMD ["sh", "-c", "yarn start"]