function wrapQuery(model, query) {
  return Object.assign(query, {
    find: wrapQueryMethod(model, query, "find"),
    findOne: wrapQueryMethod(model, query, "findOne"),
    create: wrapQueryMethod(model, query, "create"),
    update: wrapQueryMethod(model, query, "update"),
    delete: wrapQueryMethod(model, query, "delete"),
    count: wrapQueryMethod(model, query, "count"),
    search: wrapQueryMethod(model, query, "search"),
    countSearch: wrapQueryMethod(model, query, "countSearch"),
  });
}

function methodToHookName(prefix, methodName) {
  return prefix + methodName.charAt(0).toUpperCase() + methodName.slice(1);
}

function wrapQueryMethod(model, query, methodName) {
  const originalMethod = query[methodName];
  const preHook = methodToHookName("pre", methodName);
  const postHook = methodToHookName("post", methodName);

  const method = async (...args) => {
    await callModelHook(model, preHook, ...args);
    const result = await originalMethod.apply(query, args);
    await callModelHook(model, postHook, result, ...args);
    return result;
  };

  return method.bind(query);
}

function callModelHook(model, handler, ...args) {
  const fn = model[handler];
  if (typeof fn === "function") {
    return fn(...args);
  }
}

module.exports = wrapQuery;
