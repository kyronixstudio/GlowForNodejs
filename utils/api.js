'use strict';


/**
 * KyronixStudio
 * https://github.com/KyronixStudio
 *
 * Contributors: dray.me, 6fck
 * License: See LICENSE file
 */

const fetch = require('node-fetch');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class DiscordProfileAPI {
  constructor({ token, baseUrl, logger, maxRetries, retryBaseDelayMs }) {
    this.token = token;
    this.baseUrl = baseUrl || 'https://discord.com/api/v10';
    this.logger = logger || (() => {});
    this.maxRetries = maxRetries || 3;
    this.retryBaseDelayMs = retryBaseDelayMs || 1000;
  }

  async patch(endpoint, body, options = {}) {
    return this.request('PATCH', endpoint, body, options);
  }

  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, undefined, options);
  }

  async request(method, endpoint, body, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    let attempt = 0;
    const maxAttempts = (options.maxRetries ?? this.maxRetries) + 1;

    while (attempt < maxAttempts) {
      attempt++;
      const startTime = Date.now();
      let response;
      let raw;
      let parsed;
      let parseError;

      try {
        const headers = {
          'Authorization': `Bot ${this.token}`,
          'User-Agent': 'DiscordBot (https://discord.com, 1.0)'
        };

        if (method !== 'GET') {
          headers['Content-Type'] = 'application/json';
          headers['Accept'] = 'application/json';
        }

        const fetchOptions = {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined
        };

        response = await fetch(url, fetchOptions);
        raw = await response.text();

        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          parseError = err;
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        const result = {
          ok: false,
          status: 0,
          statusText: 'NETWORK_ERROR',
          method,
          endpoint,
          url,
          attempt,
          durationMs: duration,
          headers: {},
          retryAfterSeconds: null,
          rateLimited: false,
          raw: err.message,
          parsed: null,
          parseError: null,
          requestBody: body,
          error: {
            name: err.name,
            message: err.message,
            stack: err.stack
          }
        };
        this.logger(result);

        if (attempt < maxAttempts) {
          const delay = this.retryBaseDelayMs * (2 ** (attempt - 1));
          await sleep(delay);
          continue;
        }

        return result;
      }

      const duration = Date.now() - startTime;
      const headers = this.pickHeaders(response);
      const retryAfterSeconds = this.getRetryAfterSeconds(response, parsed);
      const rateLimited = response.status === 429;

      const result = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        method,
        endpoint,
        url,
        attempt,
        durationMs: duration,
        headers,
        retryAfterSeconds,
        rateLimited,
        raw,
        parsed,
        parseError,
        requestBody: body,
        error: null
      };

      this.logger(result);

      if (rateLimited && attempt < maxAttempts) {
        const delay = retryAfterSeconds ? retryAfterSeconds * 1000 : this.retryBaseDelayMs * (2 ** (attempt - 1));
        await sleep(delay);
        continue;
      }

      const shouldRetry = [500, 502, 503, 504].includes(response.status) && attempt < maxAttempts;
      if (shouldRetry) {
        const delay = this.retryBaseDelayMs * (2 ** (attempt - 1));
        await sleep(delay);
        continue;
      }

      return result;
    }

    // Fallback in case loop ends unexpectedly
    return {
      ok: false,
      status: 0,
      statusText: 'MAX_RETRIES_EXCEEDED',
      method,
      endpoint,
      url,
      attempt: maxAttempts,
      durationMs: 0,
      headers: {},
      retryAfterSeconds: null,
      rateLimited: false,
      raw: '',
      parsed: null,
      parseError: null,
      requestBody: body,
      error: { name: 'Error', message: 'Max retries exceeded' }
    };
  }

  getRetryAfterSeconds(response, parsed) {
    if (parsed?.retry_after) {
      return Number(parsed.retry_after);
    }
    const headerValue = response.headers.get('retry-after');
    if (headerValue) {
      return Number(headerValue);
    }
    return null;
  }

  pickHeaders(response) {
    const headers = {};
    const keys = ['content-type', 'date', 'x-ratelimit-bucket', 'x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-ratelimit-reset-after', 'retry-after', 'x-discord-trace-id'];
    for (const key of keys) {
      const value = response.headers.get(key);
      if (value) headers[key] = value;
    }
    return headers;
  }
}

module.exports = DiscordProfileAPI;
