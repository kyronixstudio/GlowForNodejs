'use strict';


/**
 * KyronixStudio
 * https://github.com/KyronixStudio
 *
 * Contributors: dray.me, 6fck
 * License: See LICENSE file
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const DiscordProfileAPI = require('./utils/api');

const FONTS = [
  { label: 'Bangers', id: 1 },
  { label: 'BioRhyme', id: 2 },
  { label: 'Cherry Bomb', id: 3 },
  { label: 'Chicle', id: 4 },
  { label: 'Compagnon', id: 5 },
  { label: 'Museo Moderno', id: 6 },
  { label: 'Neo-Castel', id: 7 },
  { label: 'Pixelify Sans', id: 8 },
  { label: 'Ribes', id: 9 },
  { label: 'Sinistre', id: 10 },
  { label: 'Default (GG Sans)', id: 11 },
  { label: 'Zilla Slab', id: 12 }
];

const EFFECTS = [
  { label: 'Solid', id: 1 },
  { label: 'Gradient', id: 2 },
  { label: 'Neon', id: 3 },
  { label: 'Toon', id: 4 },
  { label: 'Pop', id: 5 },
  { label: 'Glow', id: 6 }
];

const COLOR_TESTS = [
  { label: 'White', colors: [16777215] },
  { label: 'Blue', colors: [5865] },
  { label: 'Pink', colors: [16711935] },
  { label: 'Purple', colors: [8388736] },
  { label: 'White to Blue Gradient', colors: [16777215, 5865] },
  { label: 'Pink to Purple Gradient', colors: [16711935, 8388736] }
];

const TARGET_STYLE = Object.freeze({
  font_id: 10,
  effect_id: 3,
  colors: [16777215]
});

const STYLE_PRESETS = Object.freeze([
  {
    key: 'sinistre-neon-white',
    label: 'Sinistre Neon White',
    style: { font_id: 10, effect_id: 3, colors: [16777215] }
  },
  {
    key: 'ribes-neon-pink',
    label: 'Ribes Neon Pink',
    style: { font_id: 9, effect_id: 3, colors: [16711935] }
  },
  {
    key: 'neo-castel-gradient-blue-white',
    label: 'Neo-Castel Blue/White Gradient',
    style: { font_id: 7, effect_id: 2, colors: [5865, 16777215] }
  },
  {
    key: 'pixelify-pop-purple',
    label: 'Pixelify Sans Pop Purple',
    style: { font_id: 8, effect_id: 5, colors: [8388736] }
  },
  {
    key: 'bangers-glow-pink-purple',
    label: 'Bangers Pink/Purple Glow',
    style: { font_id: 1, effect_id: 6, colors: [16711935, 8388736] }
  },
  {
    key: 'cherry-toon-white',
    label: 'Cherry Bomb Toon White',
    style: { font_id: 3, effect_id: 4, colors: [16777215] }
  },
  {
    key: 'zilla-solid-blue',
    label: 'Zilla Slab Solid Blue',
    style: { font_id: 12, effect_id: 1, colors: [5865] }
  }
]);

const PAYLOAD_FORMATS = Object.freeze({
  A: (style) => ({ display_name_styles: style }),
  B: (style) => ({
    display_name_font_id: style.font_id,
    display_name_effect_id: style.effect_id,
    display_name_colors: style.colors
  })
});

const SUPPORTED_ERROR_STATUSES = new Set([400, 401, 403, 404, 405, 409, 429, 500, 502, 503, 504]);
const DEFAULT_LOG_DIR = path.join(process.cwd(), 'logs', 'display-name-styles');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class ProfileStyleService {
  constructor(client, options = {}) {
    this.client = client;
    this.options = {
      logDir: options.logDir || process.env.DISCORD_PROFILE_STYLE_LOG_DIR || DEFAULT_LOG_DIR,
      forceDiscovery: options.forceDiscovery || process.env.DISCORD_PROFILE_STYLE_FORCE_DISCOVERY === 'true',
      runCompatibilityTests: options.runCompatibilityTests || process.env.DISCORD_PROFILE_STYLE_RUN_COMPATIBILITY === 'true',
      requestDelayMs: Number(process.env.DISCORD_PROFILE_STYLE_REQUEST_DELAY_MS || options.requestDelayMs || 1_500),
      maxRetries: Number(process.env.DISCORD_PROFILE_STYLE_MAX_RETRIES || options.maxRetries || 2),
      targetStyle: options.targetStyle || null,
      stylePreset: options.stylePreset || process.env.DISCORD_PROFILE_STYLE_PRESET || null,
      styleMode: options.styleMode || process.env.DISCORD_PROFILE_STYLE_MODE || 'rotate',
      guildId: options.guildId || process.env.DISCORD_PROFILE_STYLE_GUILD_ID || null
    };

    this.report = this.createEmptyReport();
    this.runId = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFile = path.join(this.options.logDir, `${this.runId}.jsonl`);
    this.reportFile = path.join(this.options.logDir, 'latest-report.md');
    this.cacheFile = path.join(this.options.logDir, 'working-config.json');
    this.rotationFile = path.join(this.options.logDir, 'preset-rotation.json');
  }

  static async initialize(client, options = {}) {
    const service = new ProfileStyleService(client, options);
    return service.run();
  }

  async run() {
    await this.ensureLogDirectory();

    try {
      if (process.env.DISCORD_PROFILE_STYLE_ENABLED === 'false') {
        await this.writeSummary('Display Name Styles disabled by DISCORD_PROFILE_STYLE_ENABLED=false.');
        return this.report;
      }

      const token = this.client?.token || process.env.DISCORD_TOKEN || this.client?.config?.token;
      if (!token) {
        await this.writeSummary('No Discord bot token available for Display Name Styles startup task.');
        return this.report;
      }

      this.api = new DiscordProfileAPI({
        token,
        maxRetries: this.options.maxRetries,
        logger: (entry) => this.logApiResponse(entry)
      });

      await this.resolveTargetStyle();

      this.report.botTokenSupported = 'UNKNOWN';
      this.report.selectedStylePreset = this.selectedStylePreset;
      this.report.availableStylePresets = STYLE_PRESETS.map(({ key, label, style }) => ({ key, label, style }));
      this.report.finalTargetConfiguration = this.options.targetStyle;

      const cached = await this.loadWorkingConfig();
      if (cached && !this.options.forceDiscovery) {
        await this.writeSummary('Using saved Display Name Styles configuration from a previous successful run.');
        const responses = await this.applyCachedConfiguration(cached);
        const applied = responses.some((response) => this.isStyleConfirmed(response, this.options.targetStyle));
        if (applied) {
          await this.saveWorkingConfig(this.report.finalWorkingConfiguration || cached);
          await this.finalizeReport('Applied saved working configuration.');
          return this.report;
        }
        await this.writeSummary('Saved Display Name Styles configuration failed verification; running fresh discovery.');
      }

      const endpoints = await this.getCandidateEndpoints();
      await this.writeSummary(`Starting Display Name Styles discovery with ${endpoints.length} endpoint(s).`);

      const working = await this.detectWorkingConfiguration(endpoints);
      if (working) {
        await this.applyFinalStyle(working);
        await this.saveWorkingConfig(this.report.finalWorkingConfiguration || working);

        if (this.options.runCompatibilityTests) {
          await this.runCompatibilityMatrix(working);
          await this.applyFinalStyle(working);
        }
      } else {
        this.report.endpointSupported = 'NO';
        this.report.botTokenSupported = this.report.botTokenSupported === 'YES' ? 'YES' : 'NO';
      }

      await this.finalizeReport(working ? 'Display Name Styles startup task completed.' : 'No working Display Name Styles configuration was found.');
    } catch (err) {
      await this.logEvent('fatal-error', {
        message: err.message,
        stack: err.stack
      });
      await this.finalizeReport('Display Name Styles startup task failed safely; bot startup continued.');
    }

    return this.report;
  }

  createEmptyReport() {
    return {
      title: 'Display Name Styles Report',
      generatedAt: new Date().toISOString(),
      endpointSupported: 'UNKNOWN',
      botTokenSupported: 'UNKNOWN',
      payloadFormat: 'UNKNOWN',
      acceptedFontIds: [],
      acceptedEffectIds: [],
      acceptedColors: [],
      finalWorkingConfiguration: null,
      finalTargetConfiguration: null,
      selectedStylePreset: null,
      availableStylePresets: [],
      unsupportedFields: [],
      endpoints: {},
      notes: []
    };
  }

  async resolveTargetStyle() {
    if (this.options.targetStyle) {
      this.selectedStylePreset = { key: 'custom-options', label: 'Custom Options', style: this.options.targetStyle };
      return;
    }

    const envStyle = this.parseEnvironmentStyle();
    if (envStyle) {
      this.options.targetStyle = envStyle;
      this.selectedStylePreset = { key: 'custom-env', label: 'Custom Environment Style', style: envStyle };
      return;
    }

    const configStyle = this.readStyleConfig();
    if (configStyle) {
      this.options.targetStyle = configStyle;
      this.selectedStylePreset = { key: 'custom-config', label: 'Custom Config File Style', style: configStyle };
      return;
    }

    const preset = await this.selectPreset();
    this.options.targetStyle = { ...preset.style, colors: [...preset.style.colors] };
    this.selectedStylePreset = preset;
    await this.writeSummary(`Selected Display Name Style preset: ${preset.label} (${preset.key}).`);
  }

  readStyleConfig() {
    try {
      const configPath = path.resolve(process.cwd(), 'style.json');
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf8');
        const cleaned = raw.split('\n').filter(line => !line.trim().startsWith('#')).join('\n');
        const style = JSON.parse(cleaned);
        if (this.validateStyle(style)) {
          return style;
        } else {
          this.report.notes.push('style.json was present but invalid style.');
        }
      }
    } catch (err) {
      this.report.notes.push(`style.json could not be parsed: ${err.message}`);
    }
    return null;
  }

  parseEnvironmentStyle() {
    if (process.env.DISCORD_PROFILE_STYLE_JSON) {
      try {
        const style = JSON.parse(process.env.DISCORD_PROFILE_STYLE_JSON);
        if (this.validateStyle(style)) return style;
        this.report.notes.push('DISCORD_PROFILE_STYLE_JSON was present but invalid.');
      } catch (err) {
        this.report.notes.push(`DISCORD_PROFILE_STYLE_JSON could not be parsed: ${err.message}`);
      }
    }

    const fontId = Number(process.env.DISCORD_PROFILE_STYLE_FONT_ID);
    const effectId = Number(process.env.DISCORD_PROFILE_STYLE_EFFECT_ID);
    const colors = this.parseColorList(process.env.DISCORD_PROFILE_STYLE_COLORS);
    const style = { font_id: fontId, effect_id: effectId, colors };

    return this.validateStyle(style) ? style : null;
  }

  parseColorList(value) {
    if (!value) return null;
    return value.split(',')
      .map((color) => Number(color.trim()))
      .filter((color) => Number.isInteger(color));
  }

  async selectPreset() {
    const presetKey = (this.options.stylePreset || '').trim().toLowerCase();
    if (presetKey) {
      const preset = STYLE_PRESETS.find((entry) => entry.key === presetKey || entry.label.toLowerCase() === presetKey);
      if (preset) return preset;
      this.report.notes.push(`Unknown Display Name Style preset '${this.options.stylePreset}', falling back to rotation mode.`);
    }

    const mode = String(this.options.styleMode || 'rotate').toLowerCase();
    if (mode === 'random') {
      return STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)];
    }

    if (mode === 'fixed') return STYLE_PRESETS[0];

    const state = await this.loadRotationState();
    const index = Number.isInteger(state.nextIndex) ? state.nextIndex % STYLE_PRESETS.length : 1;
    const preset = STYLE_PRESETS[index];
    await this.saveRotationState({
      nextIndex: (index + 1) % STYLE_PRESETS.length,
      lastPresetKey: preset.key,
      updatedAt: new Date().toISOString()
    });
    return preset;
  }

  async loadRotationState() {
    try {
      return JSON.parse(await fs.promises.readFile(this.rotationFile, 'utf8'));
    } catch {
      return {};
    }
  }

  async saveRotationState(state) {
    await fs.promises.writeFile(this.rotationFile, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  }

  validateStyle(style) {
    return Boolean(style)
      && Number.isInteger(style.font_id)
      && Number.isInteger(style.effect_id)
      && Array.isArray(style.colors)
      && style.colors.length >= 1
      && style.colors.every((color) => Number.isInteger(color) && color >= 0 && color <= 0xffffff);
  }

  async getCandidateEndpoints() {
    const guildIds = await this.getGuildIdsAsync();
    const guildId = this.options.guildId || guildIds[0] || null;
    const endpoints = [];

    if (guildId) {
      endpoints.push({
        key: 'guild-members-me',
        label: 'PATCH /guilds/{guild_id}/members/@me',
        endpoint: `/guilds/${guildId}/members/@me`,
        endpointTemplate: '/guilds/{guild_id}/members/@me',
        guildId,
        guildScoped: true,
        payloadFormats: ['B', 'A']
      });
      endpoints.push({
        key: 'guild-profile-me',
        label: 'PATCH /guilds/{guild_id}/profile/@me',
        endpoint: `/guilds/${guildId}/profile/@me`,
        endpointTemplate: '/guilds/{guild_id}/profile/@me',
        guildId,
        guildScoped: true,
        payloadFormats: ['B', 'A']
      });
    } else {
      this.report.notes.push('No guild id was available, so guild-specific profile endpoints were skipped.');
    }

    endpoints.push({
      key: 'users-me',
      label: 'PATCH /users/@me',
      endpoint: '/users/@me',
      endpointTemplate: '/users/@me',
      guildId: null,
      guildScoped: false,
      payloadFormats: ['B', 'A']
    });

    return endpoints;
  }

  getGuildIds() {
    const cache = this.client?.guilds?.cache;
    if (!cache) return [];
    if (typeof cache.map === 'function') return cache.map((guild) => guild.id).filter(Boolean);
    if (typeof cache.values === 'function') return Array.from(cache.values()).map((guild) => guild.id).filter(Boolean);
    return [];
  }

  async getGuildIdsAsync() {
    let ids = this.getGuildIds();
    if (ids.length === 0) {
      const response = await this.api.get('/users/@me/guilds');
      if (response.ok && Array.isArray(response.parsed)) {
        ids = response.parsed.map(g => g.id).filter(Boolean);
      }
    }
    return ids;
  }

  endpointForGuild(working, guildId) {
    if (!working.guildScoped || !guildId) return working.endpoint;
    return (working.endpointTemplate || working.endpoint).replace('{guild_id}', guildId);
  }

  async detectWorkingConfiguration(endpoints) {
    for (const endpoint of endpoints) {
      for (const payloadFormat of endpoint.payloadFormats || Object.keys(PAYLOAD_FORMATS)) {
        const payload = this.buildPayload(payloadFormat, this.options.targetStyle);
        if (!this.validatePayload(payloadFormat, payload)) continue;

        const response = await this.testPayload({
          phase: 'endpoint-discovery',
          endpoint,
          payloadFormat,
          payload,
          style: this.options.targetStyle
        });

        this.recordEndpointResult(endpoint, payloadFormat, response);
        if (this.isStyleConfirmed(response, this.options.targetStyle)) {
          const working = {
            endpoint: endpoint.endpoint,
            endpointTemplate: endpoint.endpointTemplate,
            endpointLabel: endpoint.label,
            endpointKey: endpoint.key,
            guildId: endpoint.guildId,
            guildScoped: endpoint.guildScoped,
            payloadFormat,
            style: this.options.targetStyle,
            discoveredAt: new Date().toISOString()
          };

          this.report.endpointSupported = 'YES';
          this.report.botTokenSupported = 'YES';
          this.report.payloadFormat = payloadFormat;
          this.report.finalWorkingConfiguration = working;
          return working;
        }

        if (response.ok) this.report.notes.push(`${endpoint.label} returned ${response.status}, but the response did not confirm Display Name Styles were applied.`);
        this.captureUnsupportedFields(response);
        await sleep(this.options.requestDelayMs);
      }
    }

    return null;
  }

  async runCompatibilityMatrix(working) {
    await this.writeSummary('Running Display Name Styles compatibility matrix for known fonts, effects, and colors.');

    for (const font of FONTS) {
      const response = await this.testStyleVariant(working, 'font', font.label, {
        ...this.options.targetStyle,
        font_id: font.id
      });
      if (response.ok) this.addUnique(this.report.acceptedFontIds, font.id);
      await sleep(this.options.requestDelayMs);
    }

    for (const effect of EFFECTS) {
      const response = await this.testStyleVariant(working, 'effect', effect.label, {
        ...this.options.targetStyle,
        effect_id: effect.id
      });
      if (response.ok) this.addUnique(this.report.acceptedEffectIds, effect.id);
      await sleep(this.options.requestDelayMs);
    }

    for (const colorTest of COLOR_TESTS) {
      const response = await this.testStyleVariant(working, 'color', colorTest.label, {
        ...this.options.targetStyle,
        effect_id: colorTest.colors.length > 1 ? 2 : this.options.targetStyle.effect_id,
        colors: colorTest.colors
      });
      if (response.ok) this.addUnique(this.report.acceptedColors, colorTest.colors.join(','));
      await sleep(this.options.requestDelayMs);
    }
  }

  async testStyleVariant(working, category, label, style) {
    const payload = this.buildPayload(working.payloadFormat, style);
    return this.testPayload({
      phase: `compatibility-${category}`,
      endpoint: {
        key: working.endpointKey,
        label: working.endpointLabel,
        endpoint: working.endpoint,
        guildId: working.guildId
      },
      payloadFormat: working.payloadFormat,
      payload,
      style,
      label
    });
  }

  async applyFinalStyle(working) {
    const presetLabel = this.selectedStylePreset?.label || 'Custom Display Name Style';
    await this.writeSummary(`Applying final target Display Name Style: ${presetLabel}.`);
    const responses = await this.applyStyleToConfiguredScope(working, this.options.targetStyle, 'final-apply', presetLabel);
    const confirmed = responses.filter((response) => this.isStyleConfirmed(response, this.options.targetStyle));

    if (confirmed.length > 0) {
      this.report.finalWorkingConfiguration = {
        ...working,
        style: this.options.targetStyle,
        appliedAt: new Date().toISOString(),
        appliedGuildIds: working.guildScoped ? confirmed.map((response) => response.guildId).filter(Boolean) : []
      };
      await this.saveWorkingConfig(this.report.finalWorkingConfiguration);
    }

    return responses;
  }

  async applyCachedConfiguration(cached) {
    const style = this.options.targetStyle;
    const responses = await this.applyStyleToConfiguredScope(cached, style, 'cached-apply', 'Saved Working Configuration');

    if (responses.some((response) => this.isStyleConfirmed(response, style))) {
      this.report.endpointSupported = 'YES';
      this.report.botTokenSupported = 'YES';
      this.report.payloadFormat = cached.payloadFormat;
      this.report.finalWorkingConfiguration = {
        ...cached,
        style,
        appliedAt: new Date().toISOString()
      };
    } else {
      for (const response of responses) this.captureUnsupportedFields(response);
    }

    return responses;
  }

  async applyStyleToConfiguredScope(working, style, phase, label) {
    const fetchedGuilds = await this.getGuildIdsAsync();
    const guildIds = working.guildScoped
      ? Array.from(new Set([working.guildId, ...fetchedGuilds].filter(Boolean)))
      : [null];
    const responses = [];

    for (const guildId of guildIds) {
      const payload = this.buildPayload(working.payloadFormat, style);
      const endpoint = {
        key: working.endpointKey,
        label: working.endpointLabel,
        endpoint: this.endpointForGuild(working, guildId),
        guildId,
        guildScoped: working.guildScoped
      };

      const response = await this.testPayload({
        phase,
        endpoint,
        payloadFormat: working.payloadFormat,
        payload,
        style,
        label
      });
      response.guildId = guildId;
      responses.push(response);
      await sleep(this.options.requestDelayMs);
    }

    return responses;
  }

  isStyleConfirmed(response, expectedStyle) {
    if (!response?.ok) return false;
    return response.verifiedStyle === true || this.responseContainsStyle(response, expectedStyle);
  }

  responseContainsStyle(response, expectedStyle) {
    return this.objectContainsStyle(response?.parsed, expectedStyle);
  }

  objectContainsStyle(value, expectedStyle, seen = new Set()) {
    if (!value || typeof value !== 'object') return false;
    if (seen.has(value)) return false;
    seen.add(value);

    if (this.styleMatches(value.display_name_styles, expectedStyle)) return true;
    if (this.styleMatches(value, expectedStyle)) return true;

    if (value.display_name_font_id === expectedStyle.font_id
      && value.display_name_effect_id === expectedStyle.effect_id
      && this.colorsMatch(value.display_name_colors, expectedStyle.colors)) {
      return true;
    }

    return Object.values(value).some((child) => this.objectContainsStyle(child, expectedStyle, seen));
  }

  styleMatches(value, expectedStyle) {
    return Boolean(value)
      && value.font_id === expectedStyle.font_id
      && value.effect_id === expectedStyle.effect_id
      && this.colorsMatch(value.colors, expectedStyle.colors);
  }

  colorsMatch(actual, expected) {
    return Array.isArray(actual)
      && Array.isArray(expected)
      && actual.length === expected.length
      && actual.every((color, index) => color === expected[index]);
  }


  async testPayload({ phase, endpoint, payloadFormat, payload, style, label = null }) {
    await this.logDisplayNameStyleTest({ phase, endpoint, payloadFormat, payload, style, label, status: 'STARTED' });
    const response = await this.api.patch(endpoint.endpoint, payload);

    if (response.ok && !this.responseContainsStyle(response, style)) {
      response.verification = await this.verifyAppliedStyle(endpoint, style);
      response.verifiedStyle = response.verification.some((entry) => entry.confirmed);
    } else {
      response.verifiedStyle = this.responseContainsStyle(response, style);
    }

    await this.logDisplayNameStyleTest({
      phase,
      endpoint,
      payloadFormat,
      payload,
      style,
      label,
      status: response.status,
      response,
      result: this.isStyleConfirmed(response, style) ? 'SUCCESS_CONFIRMED' : (response.ok ? 'SUCCESS_UNCONFIRMED' : 'FAILURE')
    });

    if (!response.ok && SUPPORTED_ERROR_STATUSES.has(response.status)) {
      this.report.notes.push(`${endpoint.label} returned ${response.status} during ${phase}.`);
    }

    return response;
  }

  async verifyAppliedStyle(endpoint, style) {
    const userId = this.client?.user?.id;
    const checks = ['/users/@me'];
    if (userId) {
      const query = endpoint.guildId ? `?guild_id=${endpoint.guildId}` : '';
      checks.push(`/users/${userId}/profile${query}`);
    }

    const results = [];
    for (const checkEndpoint of checks) {
      const response = await this.api.get(checkEndpoint, { maxRetries: 1 });
      results.push({
        endpoint: checkEndpoint,
        status: response.status,
        confirmed: this.responseContainsStyle(response, style),
        response
      });
    }

    return results;
  }

  buildPayload(format, style) {
    return PAYLOAD_FORMATS[format](style);
  }

  validatePayload(format, payload) {
    if (!PAYLOAD_FORMATS[format]) return false;

    const style = format === 'A'
      ? payload.display_name_styles
      : {
          font_id: payload.display_name_font_id,
          effect_id: payload.display_name_effect_id,
          colors: payload.display_name_colors
        };

    const valid = this.validateStyle(style);

    if (!valid) this.report.notes.push(`Skipped invalid payload format ${format}.`);
    return valid;
  }

  recordEndpointResult(endpoint, payloadFormat, response) {
    if (!this.report.endpoints[endpoint.label]) this.report.endpoints[endpoint.label] = {};
    this.report.endpoints[endpoint.label][payloadFormat] = {
      status: response.status,
      supported: this.isStyleConfirmed(response, this.options.targetStyle) ? 'YES' : (response.ok ? 'UNCONFIRMED' : 'NO'),
      rateLimited: response.rateLimited,
      errorCode: response.parsed?.code || null,
      message: response.parsed?.message || response.statusText || null
    };
  }

  captureUnsupportedFields(response) {
    const fields = this.extractErrorFields(response.parsed?.errors);
    for (const field of fields) this.addUnique(this.report.unsupportedFields, field);
  }

  extractErrorFields(errors, prefix = '') {
    if (!errors || typeof errors !== 'object') return [];

    const fields = [];
    for (const [key, value] of Object.entries(errors)) {
      if (key === '_errors') continue;
      const next = prefix ? `${prefix}.${key}` : key;
      if (value?._errors) fields.push(next);
      fields.push(...this.extractErrorFields(value, next));
    }
    return fields;
  }

  async ensureLogDirectory() {
    await fs.promises.mkdir(this.options.logDir, { recursive: true });
  }

  async logApiResponse(entry) {
    await this.logEvent('api-response', this.sanitizeLogEntry(entry));
  }

  async logDisplayNameStyleTest(entry) {
    await this.logEvent('display-name-style-test', this.sanitizeLogEntry({
      separator: '━━━━━━━━━━━━━━━━━━',
      title: 'Display Name Style Test',
      ...entry
    }));
  }

  async writeSummary(message) {
    this.report.notes.push(message);
    await this.logEvent('summary', { message });
    console.log(`[DisplayNameStyles] ${message} | Main: KyronixStudio | Contributors: dray.me, 6fck`);
  }

  async logEvent(type, data) {
    const entry = {
      type,
      timestamp: new Date().toISOString(),
      data
    };
    await fs.promises.appendFile(this.logFile, `${JSON.stringify(entry)}\n`, 'utf8');
  }

  sanitizeLogEntry(entry) {
    if (!entry || typeof entry !== 'object') return entry;
    return JSON.parse(JSON.stringify(entry, (key, value) => {
      if (key.toLowerCase().includes('authorization')) return '[REDACTED]';
      return value;
    }));
  }

  async loadWorkingConfig() {
    try {
      const raw = await fs.promises.readFile(this.cacheFile, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed?.endpoint && parsed?.payloadFormat && parsed?.style) return this.normalizeWorkingConfig(parsed);
    } catch {}
    return null;
  }

  async saveWorkingConfig(config) {
    await fs.promises.writeFile(this.cacheFile, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  }

  normalizeWorkingConfig(config) {
    const normalized = { ...config };

    if (normalized.endpoint?.startsWith('/guilds/') && normalized.endpoint?.includes('/members/@me')) {
      normalized.guildScoped = true;
      normalized.endpointTemplate = '/guilds/{guild_id}/members/@me';
      normalized.endpointLabel = normalized.endpointLabel || 'PATCH /guilds/{guild_id}/members/@me';
      normalized.endpointKey = normalized.endpointKey || 'guild-members-me';
    }

    if (normalized.endpoint?.startsWith('/guilds/') && normalized.endpoint?.includes('/profile/@me')) {
      normalized.guildScoped = true;
      normalized.endpointTemplate = '/guilds/{guild_id}/profile/@me';
      normalized.endpointLabel = normalized.endpointLabel || 'PATCH /guilds/{guild_id}/profile/@me';
      normalized.endpointKey = normalized.endpointKey || 'guild-profile-me';
    }

    if (normalized.endpoint === '/users/@me') {
      normalized.guildScoped = false;
      normalized.endpointTemplate = '/users/@me';
      normalized.endpointLabel = normalized.endpointLabel || 'PATCH /users/@me';
      normalized.endpointKey = normalized.endpointKey || 'users-me';
    }

    return normalized;
  }

  async finalizeReport(message) {
    this.report.generatedAt = new Date().toISOString();
    this.report.notes.push(message);
    await fs.promises.writeFile(this.reportFile, this.renderReport(), 'utf8');
    await this.logEvent('report', this.report);
    console.log(`[DisplayNameStyles] ${message} | Powered by KyronixStudio | Contributors: dray.me, 6fck`);
  }

  renderReport() {
    return [
      '# Display Name Styles Report',
      '',
      '## Credits',
      '- **Main Server**: KyronixStudio',
      '- **Contributors**: dray.me, 6fck',
      '',
      `Generated At: ${this.report.generatedAt}`,
      '',
      `Endpoint Supported: ${this.report.endpointSupported}`,
      `Bot Token Supported: ${this.report.botTokenSupported}`,
      `Payload Format: ${this.report.payloadFormat}`,
      `Selected Preset: ${this.report.selectedStylePreset?.label || 'UNKNOWN'} (${this.report.selectedStylePreset?.key || 'UNKNOWN'})`,
      `Accepted Font IDs: ${this.report.acceptedFontIds.length ? this.report.acceptedFontIds.join(', ') : 'UNKNOWN'}`,
      `Accepted Effect IDs: ${this.report.acceptedEffectIds.length ? this.report.acceptedEffectIds.join(', ') : 'UNKNOWN'}`,
      `Accepted Colors: ${this.report.acceptedColors.length ? this.report.acceptedColors.join(' | ') : 'UNKNOWN'}`,
      `Unsupported Fields: ${this.report.unsupportedFields.length ? this.report.unsupportedFields.join(', ') : 'NONE DETECTED'}`,
      '',
      '## Final Working Configuration',
      '```json',
      JSON.stringify(this.report.finalWorkingConfiguration, null, 2),
      '```',
      '',
      '## Final Target Configuration',
      '```json',
      JSON.stringify({ display_name_styles: this.options.targetStyle }, null, 2),
      '```',
      '',
      '## Available Style Presets',
      '```json',
      JSON.stringify(this.report.availableStylePresets, null, 2),
      '```',
      '',
      '## Endpoint Results',
      '```json',
      JSON.stringify(this.report.endpoints, null, 2),
      '```',
      '',
      '## Notes',
      ...this.report.notes.map((note) => `- ${note}`),
      ''
    ].join('\n');
  }

  addUnique(target, value) {
    if (!target.includes(value)) target.push(value);
  }
}

ProfileStyleService.FONTS = FONTS;
ProfileStyleService.EFFECTS = EFFECTS;
ProfileStyleService.COLOR_TESTS = COLOR_TESTS;
ProfileStyleService.TARGET_STYLE = TARGET_STYLE;
ProfileStyleService.STYLE_PRESETS = STYLE_PRESETS;

module.exports = ProfileStyleService;
