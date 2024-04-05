const { saveHackerNewsArticles } = require('./utils/saveHackerNewsArticles');


(async () => {
  await saveHackerNewsArticles();
})();

