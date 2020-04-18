# strapi-hook-model-hooks

This package provides a temporary workaround for the [limitations/bugs](https://github.com/strapi/strapi/issues/1443) in Strapi's current implementation of model hooks.

This has not been extensively tested, use at own risk.

## Install

Install the node module:

```bash
npm install --save strapi-hook-model-hooks
```

Enable the hook in your Strapi config (`./config/hook.json`):

```json
"model-hooks": {
  "enabled": true
}
```

## Config

By default all modules will have lifecycle hooks installed. If you would like to enable if for only some models you can use the `whitelist` setting:

```json
"model-hooks": {
  "enabled": true,
  "whitelist": ["example-model"]
}
```

You can also blacklist models:

```json
"model-hooks": {
  "enabled": true,
  "blacklist": ["another-model"]
}
```

## Usage

New hooks will now be available for your model (`api/{model name}/models/{model name}.js`).

Pre and post query hooks are available for the following methods: `find`, `findOne`, `create`, `update`, `delete`, `count`, `search`, `countSearch`:

```javascript
{
  preCreate(data) {},
  postCreate(result, data) {},
  preUpdate(query, data) {},
  postUpdate(result, query, data) {},
  preDelete(query) {},
  postDelete(result, query) {}
  ...etc
}
```

**Note:** Hooks will recieve the arguments passed the query method and the result from that method. Therefore, queries like bulk deletes will call the `postDelete` hook with an array of deleted objects.
