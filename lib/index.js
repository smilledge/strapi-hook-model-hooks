"use strict";

const wrapQuery = require("./wrapQuery");

/**
 * Strapi model lifecycle hooks hook
 */
module.exports = (strapi) => {
  return {
    defaults: {
      debug: false,
      whitelist: undefined,
      blacklist: undefined,
    },

    async initialize() {
      const settings = {
        ...this.defaults,
        ...strapi.config.hook.settings.modelHooks,
      };
      const { debug, whitelist, blacklist } = settings;

      const modelNames = Object.keys(strapi.models)
        .filter((name) => !(blacklist && blacklist.includes(name)))
        .filter((name) => !whitelist || whitelist.includes(name));

      if (debug) {
        strapi.log.debug(
          `Adding model lifecycle hooks to ${modelNames.join(",")}`
        );
      }

      for (const modelName of modelNames) {
        const model = strapi.models[modelName];
        const originalQuery = strapi.query(modelName);
        const wrappedQuery = wrapQuery(model, originalQuery);
        strapi.db.queries.set(modelName, wrappedQuery);
      }
    },
  };
};
